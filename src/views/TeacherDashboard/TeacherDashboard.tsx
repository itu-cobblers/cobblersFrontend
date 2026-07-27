import { useState } from 'react'
import {
  Button,
  Spinner,
  TeacherProblemsList,
  AttendanceList,
  TeacherAssignmentPanel,
  TeacherCodeViewer,
  type TeacherProblemItem,
  type AttendanceStudent,
  type TeacherSubmissionItem,
  type CodeFileTab,
} from '@components'
import { defaultStarter } from '@lib/defaultStarter'
import { useTeacherSession } from './TeacherDashboard.hooks'
import {
  TEACHER_LAYOUT_CLASS,
  TEACHER_GRID_CLASS,
  TEACHER_GLOW_CLASS,
  TEACHER_RESTORING_CLASS,
  TEACHER_BODY_CLASS,
  TEACHER_ERROR_CLASS,
  TEACHER_BROWSE_CLASS,
  TEACHER_BROWSE_HEAD_CLASS,
  TEACHER_BROWSE_TITLE_CLASS,
  TEACHER_BROWSE_SUBTITLE_CLASS,
  TEACHER_BROWSE_ACTIONS_CLASS,
  TEACHER_ASSIGNMENT_SET_ROW_CLASS,
  TEACHER_ASSIGNMENT_SET_LABEL_CLASS,
  TEACHER_ASSIGNMENT_SET_SELECT_CLASS,
} from './TeacherDashboard.constants'
import type { AssignmentPanelTab } from '@components/AssignmentPanel/AssignmentPanel.types'

/** The file tabs for a code assignment's starter — mirrors the student view's `codeFiles`. */
function starterFileTabs(files?: { name: string }[]): CodeFileTab[] {
  return files?.map((file) => ({ name: file.name })) ?? [{ name: 'Main.java' }]
}

export default function TeacherDashboard() {
  const {
    assignmentSets,
    selectedAssignmentSetId,
    onAssignmentSetChange,
    previewGroups,
    previewTitle,
    assignments,
    sessionCode,
    isCreatingSession,
    isEndingSession,
    sessionError,
    students,
    minutes,
    isStartingTimer,
    timerEndsAt,
    timerError,
    isRestoringSession,
    focusedAssignmentId,
    handleCreateSession,
    handleStartTimer,
    handleMinutesChange,
    handleEndSession,
    handleFocusAssignment,
    handleLogout,
    // Dual selection states & handlers
    selectedAssignmentId,
    selectedStudentId,
    handleSelectAssignment,
    handleSelectStudent,
    handleClearStudentFilter,
  } = useTeacherSession()

  const [isRailOpen, setIsRailOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<AssignmentPanelTab>('description')
  const [activeSubId, setActiveSubId] = useState<string | null>(null)
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const createLabel = isCreatingSession ? 'Creating…' : 'Create session'

  // Flatten preview groups into TeacherProblemItems for Col 1
  const problemItems: TeacherProblemItem[] = previewGroups.flatMap((group) =>
    group.items.map((item) => {
      // Find selected student's status for this item if student selected
      const studentStatus = selectedStudentId ? 'untried' : undefined
      return {
        id: item.id,
        title: item.title,
        kind: item.kind,
        passedNum: 0,
        totalNum: students.length,
        studentStatus,
      }
    }),
  )

  // Map students into AttendanceStudents for Col 2
  const attendanceStudents: AttendanceStudent[] = students.map((s) => ({
    studentId: s.studentId,
    displayName: s.displayName,
    isActive: true,
    assignmentStatus: selectedAssignmentId ? 'untried' : undefined,
  }))

  // Selected assignment (full object, with starter/starterFiles — for the Col4 starter preview)
  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId)
  const activeAssignmentItem = problemItems.find((p) => p.id === selectedAssignmentId) || problemItems[0]

  // Selected student item
  const activeStudent = students.find((s) => s.studentId === selectedStudentId)

  // Submissions placeholder array based on selection
  const mockSubmissions: TeacherSubmissionItem[] = []

  const activeSubmission = mockSubmissions.find((s) => s.subId === activeSubId)

  // Starter-code preview for Col4 when no submission is selected yet — matches the student view exactly.
  const starterTabs = activeAssignment?.kind === 'code' ? starterFileTabs(activeAssignment.starterFiles) : []
  const starterCode =
    activeAssignment?.kind === 'code'
      ? activeAssignment.starterFiles?.[activeFileIndex]?.content ?? activeAssignment.starter ?? defaultStarter
      : activeAssignment?.kind === 'predict'
        ? activeAssignment.snippet
        : ''
  const predictExpectedOutput = activeAssignment?.kind === 'predict' ? activeAssignment.expectedOutput : undefined
  const projectBrief = activeAssignment?.kind === 'project' ? activeAssignment.brief : undefined
  // Namespaces the Monaco model path (see TeacherCodeViewer.types.ts) so switching between
  // assignments/submissions that share a file name (every multi-file assignment has a
  // `Main.java`) never shows another context's stale, cached model content.
  const editorKey = activeSubmission ? `sub-${activeSubmission.subId}` : `assignment-${selectedAssignmentId ?? 'none'}`

  function handleSelectAssignmentAndResetFile(id: number) {
    setActiveFileIndex(0)
    setActiveSubId(null)
    handleSelectAssignment(id)
  }

  return (
    <div className={TEACHER_LAYOUT_CLASS}>
      <div className={TEACHER_GRID_CLASS} />
      <div className={TEACHER_GLOW_CLASS} />

      {isRestoringSession ? (
        <div className={TEACHER_RESTORING_CLASS}>
          <Spinner />
        </div>
      ) : !sessionCode ? (
        // ── Browse Screen (Create Session & Sign Out in header) ────────────────
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-md">
            <span className="text-sm font-bold text-foreground">BootIT Teacher Portal</span>
            <Button variant="ghost" onClick={handleLogout}>
              Sign out
            </Button>
          </header>

          <div className={TEACHER_BROWSE_CLASS}>
            <div className={TEACHER_BROWSE_HEAD_CLASS}>
              <h1 className={TEACHER_BROWSE_TITLE_CLASS}>Start a session</h1>
              <p className={TEACHER_BROWSE_SUBTITLE_CLASS}>
                Select an assignment set below to preview tasks, then create a session room for your students.
              </p>
            </div>

            <div className={TEACHER_BROWSE_ACTIONS_CLASS}>
              <div className={TEACHER_ASSIGNMENT_SET_ROW_CLASS}>
                <label className={TEACHER_ASSIGNMENT_SET_LABEL_CLASS} htmlFor="teacher-assignmentSet-select">
                  Assignment set
                </label>
                <select
                  id="teacher-assignmentSet-select"
                  className={TEACHER_ASSIGNMENT_SET_SELECT_CLASS}
                  value={selectedAssignmentSetId}
                  onChange={(event) => onAssignmentSetChange(event.target.value)}
                >
                  {assignmentSets.length === 0 && <option value="">Loading assignment sets…</option>}
                  {assignmentSets.map((assignmentSet) => (
                    <option key={assignmentSet.assignmentSetId} value={assignmentSet.assignmentSetId}>
                      {assignmentSet.displayTitle}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleCreateSession}
                isLoading={isCreatingSession}
                isDisabled={!selectedAssignmentSetId}
              >
                {createLabel}
              </Button>
            </div>
            {sessionError && <p className={TEACHER_ERROR_CLASS}>{sessionError}</p>}
          </div>
        </div>
      ) : (
        // ── Active Session 4-Column IDE View ──────────────────────────────────
        <div className={TEACHER_BODY_CLASS}>
          {/* Col 1: Teacher Rail (Assignments List + Room Code + Timer) */}
          <TeacherProblemsList
            sessionCode={sessionCode}
            items={problemItems}
            activeId={selectedAssignmentId}
            onSelect={handleSelectAssignmentAndResetFile}
            teacherFocusId={focusedAssignmentId}
            isOpen={isRailOpen}
            onToggleOpen={() => setIsRailOpen(!isRailOpen)}
            minutes={minutes}
            isStartingTimer={isStartingTimer}
            timerEndsAt={timerEndsAt}
            timerError={timerError}
            onMinutesChange={handleMinutesChange}
            onStartTimer={handleStartTimer}
            onEndSession={handleEndSession}
            isEndingSession={isEndingSession}
          />

          {/* Col 2: Attendance List */}
          <AttendanceList
            students={attendanceStudents}
            activeStudentId={selectedStudentId}
            onSelectStudent={handleSelectStudent}
            selectedAssignmentTitle={activeAssignmentItem?.title}
          />

          {/* Col 3: Teacher Assignment Panel (Description & Submissions with Filters) */}
          <div className="flex flex-[4] min-w-0 flex-col overflow-hidden">
            <TeacherAssignmentPanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              title={activeAssignment?.title || activeAssignmentItem?.title || previewTitle || 'Assignments'}
              lesson={activeAssignment?.lesson}
              description={activeAssignment?.description ?? ''}
              hint={activeAssignment?.hint}
              onFocusClick={() => selectedAssignmentId != null && handleFocusAssignment(selectedAssignmentId)}
              isFocused={selectedAssignmentId != null && selectedAssignmentId === focusedAssignmentId}
              selectedStudentName={activeStudent?.displayName}
              onClearStudentFilter={handleClearStudentFilter}
              submissions={mockSubmissions}
              activeSubId={activeSubId}
              onSelectSubmission={setActiveSubId}
              onSelectStudentFilter={(studentId) => handleSelectStudent(studentId)}
            />
          </div>

          {/* Col 4: Starter-code preview (matches student view) until a submission is picked, then that submission's code + output */}
          <TeacherCodeViewer
            assignmentKind={activeAssignment?.kind ?? 'code'}
            editorKey={editorKey}
            hasSubmission={Boolean(activeSubmission)}
            code={activeSubmission?.code ?? starterCode}
            fileTabs={starterTabs}
            activeFileIndex={activeFileIndex}
            onSelectFile={setActiveFileIndex}
            studentName={activeSubmission?.studentName}
            assignmentTitle={activeSubmission?.assignmentTitle}
            submittedAt={activeSubmission?.submittedAt}
            passed={activeSubmission?.passed}
            result={activeSubmission?.result}
            predictExpectedOutput={predictExpectedOutput}
            projectBrief={projectBrief}
          />
        </div>
      )}
    </div>
  )
}
