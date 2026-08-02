import type {useAssignmentData} from "@views/TeacherDashboard/hooks/useAssignmentData.ts";

export interface TeacherWorkspaceProps {
    sessionCode: string
    assignmentData: ReturnType<typeof useAssignmentData>
}