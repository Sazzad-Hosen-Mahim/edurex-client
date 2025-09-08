"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  fetchLecturesByModule,
  createLecture,
  deleteLecture,
} from "@/src/features/lectures/lectureSlice";

export default function LecturesPage() {
  const params = useParams();
  const moduleId = Array.isArray(params.moduleId)
    ? params.moduleId[0]
    : params.moduleId;

  console.log(moduleId, "from fadsfasfadsfs");

  const dispatch = useAppDispatch();
  const { byModule: lecturesByModule, loading } = useAppSelector(
    (state) => state.lectures
  );

  if (!moduleId) return <p>Module not found</p>;

  const lectures = lecturesByModule[moduleId] || [];

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    dispatch(fetchLecturesByModule(moduleId));
  }, [dispatch, moduleId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) return;
    await dispatch(
      createLecture({
        moduleId,
        data: {
          title,
          videoUrl,
          orderInModule: lectures.length + 1,
          globalOrder: lectures.length + 1,
        },
      })
    );
    setTitle("");
    setVideoUrl("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this lecture?")) await dispatch(deleteLecture(id));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lectures</h1>

      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lecture Title"
          className="border p-2 w-full"
        />
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Video URL"
          className="border p-2 w-full"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Add Lecture
        </button>
      </form>

      {loading ? (
        <p>Loading lectures...</p>
      ) : (
        <ul className="space-y-3">
          {lectures.map((l: any) => (
            <li key={l._id} className="flex justify-between border p-3 rounded">
              <span>
                <b>
                  {l.orderInModule}. {l.title}
                </b>
              </span>
              <div className="space-x-2">
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(l._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
