"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import {
  enrollCourse,
  fetchMyCourses,
  completeLecture,
} from "@/src/features/progress/progressSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Users,
  Clock,
  DollarSign,
  Play,
  CheckCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchCourseById } from "@/src/features/courses/coursesApi";

interface CourseDetailsProps {
  courseId: string;
}

export function CourseDetails({ courseId }: CourseDetailsProps) {
  // const { courseId } = useParams();
  //   const courseId = id;
  const dispatch = useDispatch<AppDispatch>();
  //   const { courses, loading } = useSelector(
  //     (state: RootState) => state.progress
  //   );
  const { currentCourse } = useSelector((state: RootState) => state.courses);

  console.log(currentCourse, "currentCoutsssssss")

  // get this course from redux
  const course = currentCourse;

  const isEnrolled = !!course;

  console.log(course, "mahim coursedeeeeeeeee");

  if ( !course) {
    return <div className="p-8 text-center">Loading coursem...</div>;
  }

  const allLectures = course?.courseId?.modules?.flatMap((module: any) =>
    module.lectures.map((lecture: any) => lecture)
  );

  console.log("all lecture mahim", allLectures);

  const nextLectureObj = allLectures.find(
    (lecture) => lecture.globalOrder === course.nextLecture
  );

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch]);

  console.log("course after fetch", course);

//   useEffect(() => {
//     const course = courses.find((c) => c.courseId._id === courseId);
//     const allLectures =
//       course?.courseId?.modules?.flatMap((m: any) => m.lectures) || [];
//     console.log("all lecture mahim after fetch", allLectures);
//   }, [courses, courseId]);

//   const handleEnroll = () => {
//     dispatch(enrollCourse(courseId));
//   };

  const handleCompleteLecture = (lectureOrder: number) => {
    dispatch(completeLecture({ courseId, lectureOrder }));
  };

//   if (loading) {
//     return <div className="p-8 text-center">Loading...</div>;
//   }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Course Locked</CardTitle>
            <CardDescription>
              You are not enrolled in this course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEnroll} className="w-full">
              Enroll Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLectures = course.courseId.totalLectures || 0;
  const completedLectures = course.completedLectures.length;
  const percent = course.progressPercent || 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
              {/* If you store video/thumbnail */}
              <img
                src={course.courseId.thumbnail || "/placeholder.svg"}
                alt={course.courseId.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-4xl font-bold">{course.courseId.title}</h1>
            <p className="text-muted-foreground">
              {course.courseId.description}
            </p>
          </div>

          {/* Enrollment / Progress Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-2xl font-bold">
                    <DollarSign className="h-6 w-6 mr-1" />
                    {course.courseId.price}
                  </div>
                  {isEnrolled && <Badge variant="default">Enrolled</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {completedLectures}/{totalLectures} lectures
                    </span>
                  </div>
                  <Progress value={percent} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {percent}% complete
                  </p>
                </div>

                <Link
                  href={`/courses/${courseId}/lecture/${
                    nextLectureObj?._id || nextLectureObj?.id
                  }`}
                >
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Curriculum */}
        <Tabs defaultValue="curriculum" className="space-y-6">
          <TabsList>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  {totalLectures} lectures total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.courseId.modules?.map(
                    (module: any, moduleIndex: number) => (
                      <div key={module._id} className="border rounded-lg">
                        <div className="p-4 bg-muted/30">
                          <h3 className="font-semibold">
                            Module {moduleIndex + 1}: {module.title}
                          </h3>
                        </div>
                        <div className="divide-y">
                          {module.lectures.map((lecture: any, idx: number) => {
                            const lectureOrder = lecture.globalOrder;
                            const isCompleted = course.completedLectures.some(
                              (l: any) => l._id === lecture._id
                            );
                            const isLocked = lectureOrder > course.nextLecture;

                            return (
                              <div
                                key={lecture._id}
                                className="p-4 flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-3">
                                  {isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  ) : isLocked ? (
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <Play className="h-5 w-5 text-muted-foreground" />
                                  )}
                                  <div>
                                    <p className="font-medium">
                                      {lecture.title}
                                    </p>
                                  </div>
                                </div>
                                {!isLocked && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleCompleteLecture(lectureOrder)
                                    }
                                  >
                                    {isCompleted ? "Review" : "Start"}
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
