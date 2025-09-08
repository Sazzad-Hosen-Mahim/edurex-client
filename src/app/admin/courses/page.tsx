"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchCourses, deleteCourse } from "@/src/features/courses/coursesApi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  const { list: courses, status } = useAppSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Courses</h2>
        <Link href="/admin/courses/create">
          <Button>Add Course</Button>
        </Link>
      </div>

      <table className="w-full border border-border">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses?.map((course) => (
            <tr key={course._id} className="border-t">
              <td className="p-2">{course.title}</td>
              <td className="p-2">${course.price}</td>
              <td className="p-2 space-x-2">
                <Link href={`/admin/courses/${course._id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Link href={`/admin/courses/${course._id}/modules`}>
                  <Button variant="secondary">Modules</Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => dispatch(deleteCourse(course._id))}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
