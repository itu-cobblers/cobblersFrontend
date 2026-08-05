export interface TeacherFollowBannerProps {
  /** What to call the teacher's focus target — an assignment ("#3 · BMI Calculator") or a slide ("Slide · Layers of languages"). */
  label: string
  onFollow: () => void
}
