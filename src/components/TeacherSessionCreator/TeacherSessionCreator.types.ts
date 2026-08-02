import type {useAssignmentData} from "@views/TeacherDashboard/hooks/useAssignmentData.ts";
import type {useSessionLifecycle} from "@views/TeacherDashboard/hooks/useSessionLifecycle.ts";

export interface TeacherSessionCreatorProps {
    assignmentData: ReturnType<typeof useAssignmentData>
    session: ReturnType<typeof useSessionLifecycle>
}