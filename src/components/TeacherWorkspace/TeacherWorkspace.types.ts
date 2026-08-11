import type {useAssignmentData} from "@views/TeacherDashboard/hooks/useAssignmentData.ts";
import type {useSessionLifecycle} from "@views/TeacherDashboard/hooks/useSessionLifecycle.ts";
import type {useTeacherHydration} from "./hooks/useTeacherHydration";
import type {useTeacherLiveSession} from "./hooks/useTeacherLiveSession";

export interface TeacherWorkspaceProps {
    sessionCode: string
    assignmentData: ReturnType<typeof useAssignmentData>
    session: ReturnType<typeof useSessionLifecycle>
    /**
     * Hoisted to `TeacherDashboard` (survives the Slides/Practice tab swap —
     * this component unmounts when the teacher switches to Slides, and these
     * two hooks' live SignalR-pushed state must not reset when that happens).
     */
    hydration: ReturnType<typeof useTeacherHydration>
    liveSession: ReturnType<typeof useTeacherLiveSession>
    /** Switches to Slides and opens this page — wired from `TeacherDashboard`. */
    onNavigateToSlide: (slideId: number) => void
}
