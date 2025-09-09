"use client"

import { LecturePage } from "@/components/user/LecturePage";
import { useParams } from "next/navigation";

interface PageProps {
  params: { id: string; lectureId: string };
}
export default function LectureViewPage() {
  const { id: courseId, lectureId } = useParams() as {
    id: string;
    lectureId: string;
  };
  return <LecturePage courseId={courseId} lectureId={lectureId} />;
}
