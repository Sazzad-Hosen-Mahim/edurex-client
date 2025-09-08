"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { updateCourse } from "@/src/features/courses/coursesApi";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const { data: courses } = useSelector((state: any) => state.courses);
  useEffect(() => {
    if (courses) {
      const foundCourse = courses.find((c: any) => c._id === id);
      setCourse(foundCourse);
    }
  }, [courses, id]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setPrice(course.price);
      setDescription(course.description);
      setThumbnailUrl(course.thumbnailUrl);
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCourse({
      id: id as string,
      data: { title, price, description, thumbnailUrl },
    });
    router.push("/admin/courses");
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Thumbnail URL"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
