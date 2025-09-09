"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import {
  fetchMyCourses,
  completeLecture,
} from "@/src/features/progress/progressSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Play,
  CheckCircle,
  Lock,
  Download,
  FileText,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface LecturePageProps {
  courseId: string;
  lectureId: string;
}

export function LecturePage({ courseId, lectureId }: LecturePageProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { courses, loading } = useSelector(
    (state: RootState) => state.progress
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  // Find current course from Redux
  const course = courses.find(
    (c: any) => c.courseId._id === courseId
  )?.courseId;

  const progressData = courses.find((c: any) => c.courseId._id === courseId);

  const completedLectures =
    progressData?.completedLectures.map((l: any) => l._id) || [];

  const nextLectureOrder = progressData?.nextLecture || 1;

  if (!course) return <div className="p-8 text-center">Loading course...</div>;

  const allLectures =
    course?.modules?.flatMap((module: any) =>
      module.lectures.map((lecture: any) => ({
        ...lecture,
        moduleTitle: module.title,
        moduleId: module._id,
        lectureId: lecture._id,
      }))
    ) || [];

  // All lectures already have lectureId: lecture._id
  const currentLecture = allLectures.find(
    (lecture) => lecture.lectureId === lectureId
  );

  const currentIndex = allLectures.findIndex(
    (lecture) => lecture.lectureId === lectureId
  );

  const filteredLectures = allLectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const previousLecture =
    currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex < allLectures.length - 1
      ? allLectures[currentIndex + 1]
      : null;

  const isLectureUnlocked = (lecture: any) =>
    lecture.globalOrder <= (progressData?.nextLecture || 1);

  console.log("lectureId from route:", lectureId);
  console.log(
    "allLectures ids:",
    allLectures.map((l) => l.lectureId)
  );

  const handleCompleteLecture = () => {
    if (currentLecture && !completedLectures.includes(currentLecture._id)) {
      dispatch(
        completeLecture({ courseId, lectureOrder: currentLecture.globalOrder })
      ).unwrap();

      if (nextLecture) {
        router.push(`/courses/${courseId}/lecture/${nextLecture._id}`);
      }
    }
  };

  const progressPercent = Math.round(
    (completedLectures.length / allLectures.length) * 100
  );

  console.log("lectureId from route:", lectureId);
  console.log(
    "allLectures:",
    allLectures.map((l) => l.lectureId)
  );
  console.log("currentLecture:", currentLecture);

  if (!currentLecture) return <div>Lecture not found</div>;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-transparent"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <Link
              href={`/courses/${courseId}`}
              className="flex items-center space-x-2 mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-medium">Back to Course</span>
            </Link>
            <h2 className="font-semibold text-lg line-clamp-2">
              {course.title}
            </h2>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Progress</span>
                <span>
                  {completedLectures.length}/{allLectures.length}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search lectures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.modules.map((module: any) => (
              <div key={module._id} className="border-b border-border">
                <div className="p-4 bg-muted/30">
                  <h3 className="font-medium text-sm">{module.title}</h3>
                </div>
                <div className="divide-y divide-border">
                  {module.lectures
                    .filter(
                      (lecture: any) =>
                        searchTerm === "" ||
                        lecture.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((lecture: any) => {
                      const isCompleted = completedLectures.includes(
                        lecture._id
                      );
                      const isUnlocked = isLectureUnlocked(lecture);
                      const isCurrent = lecture.lectureId === lectureId;

                      return (
                        <Link
                          key={lecture._id}
                          href={
                            isUnlocked
                              ? `/courses/${courseId}/lecture/${lecture._id}`
                              : "#"
                          }
                          className={cn(
                            "block p-4 hover:bg-muted/50 transition-colors",
                            isCurrent &&
                              "bg-primary/10 border-r-2 border-primary",
                            !isUnlocked && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={(e) => {
                            if (!isUnlocked) e.preventDefault();
                            setIsSidebarOpen(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            ) : isUnlocked ? (
                              <Play className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm line-clamp-2">
                                {lecture.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lecture.duration}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="bg-black">
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            {currentLecture.videoUrl ? (
              <iframe
                src={currentLecture.videoUrl}
                title={currentLecture.title}
                className="w-full h-full"
              />
            ) : (
              <p className="text-white text-center px-4">
                Video not available for this lecture.
              </p>
            )}
          </div>
        </div>

        {/* Lecture Info */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentLecture.title}
              </h1>
              <p className="text-muted-foreground">{currentLecture.duration}</p>
            </div>
            <div className="flex items-center space-x-2">
              {completedLectures.includes(lectureId) ? (
                <Badge variant="default" className="bg-primary">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Badge>
              ) : (
                <Button onClick={handleCompleteLecture}>
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div>
              {previousLecture && (
                <Link
                  href={`/courses/${courseId}/lecture/${previousLecture._id}`}
                >
                  <Button variant="outline">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                </Link>
              )}
            </div>
            <div>
              {nextLecture && isLectureUnlocked(nextLecture) && (
                <Link href={`/courses/${courseId}/lecture/${nextLecture._id}`}>
                  <Button>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* PDF Notes */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Lecture Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentLecture.pdfUrls && currentLecture.pdfUrls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentLecture.pdfNotes.map(
                    (note: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{note}</p>
                            <p className="text-sm text-muted-foreground">
                              PDF Document
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No notes available for this lecture.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
