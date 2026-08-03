export type {
  AssignmentKind,
  LessonBlock,
  SourceFile,
  Assignment,
  CodeAssignment,
  PredictAssignment,
  ProjectAssignment,
} from './assignment'
export type { AssignmentSet } from './assignmentSet'
export type * from './api.types'


//Domain alias for UI

import type {
  SubmissionHistoryDto,
  SubmissionDetailDto,
  ExecuteResponseDto,
  ExecuteRequestDto,
  SubmissionResponseDto,
  AssignmentSetSummaryDto,
  SessionInfoDto,
  StudentDto
} from './api.types'

export type SubmissionHistoryItem = SubmissionHistoryDto;
export type SubmissionDetails = SubmissionDetailDto;
export type ExecuteResult = ExecuteResponseDto;
export type ExecuteRequest = ExecuteRequestDto;
export type SubmissionResult = SubmissionResponseDto;
export type AssignmentSetSummary = AssignmentSetSummaryDto;
export type SessionInfo = SessionInfoDto;
export type Student = StudentDto;