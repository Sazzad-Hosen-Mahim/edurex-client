

import { CourseDetails } from "@/components/user/CourseDetails";

export default function CoursePage({ params }: { params: { id: string } }) {
  return <CourseDetails courseId={params.id} />;
}
