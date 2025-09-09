"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Users, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { fetchCourses } from "@/src/features/courses/coursesApi";

export default function AllCoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list } = useSelector((state: RootState) => state.courses);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const filteredCourses = list.filter((course: any) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor?.toLowerCase?.() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesLevel =
      selectedLevel === "all" ||
      course.level?.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesLevel;
  });

  // if (loading) {
  //   return <div className="p-8 text-center">Loading courses...</div>;
  // }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-xl text-muted-foreground">
            Discover high-quality courses taught by industry experts
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses, instructors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "beginner", "intermediate", "advanced"].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(level)}
              >
                {level === "all"
                  ? "All Levels"
                  : level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: any) => (
            <Card
              key={course._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-muted">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  {course.level && (
                    <Badge variant="secondary">{course.level}</Badge>
                  )}
                  {course.rating && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.instructor && (
                    <p className="text-sm text-muted-foreground">
                      By {course.instructor}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {course.students && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students.toLocaleString()} students
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-lg font-bold text-foreground">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {course.price}
                    </div>
                    <Link href={`/courses/${course._id}`}>
                      <Button>View Course</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No courses found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedLevel("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
