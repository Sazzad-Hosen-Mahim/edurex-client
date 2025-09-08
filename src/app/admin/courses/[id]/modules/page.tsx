"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  createModule,
  deleteModule,
  fetchModulesByCourse,
} from "@/src/features/modules/moduleSlice";
import Link from "next/link";

export default function ModulesPage() {
  const { id } = useParams();
  console.log(id);
  const dispatch = useAppDispatch();
  const { byCourse, loading } = useAppSelector((state) => state.modules);
  const courseModules = byCourse[id as string] || [];

  const [title, setTitle] = useState("");
  const [number, setNumber] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchModulesByCourse(id as string));
    }
  }, [dispatch, id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await dispatch(
      createModule({ courseId: id as string, data: { title, number } })
    );
    setTitle("");
    setNumber(number + 1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      await dispatch(deleteModule(id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Modules</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Module Title"
          className="border p-2 w-full"
        />
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(Number(e.target.value))}
          placeholder="Module Number"
          className="border p-2 w-full"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Add Module
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading modules...</p>
      ) : (
        <ul className="space-y-3">
          {courseModules.map((m: any) => (
            <li key={m._id} className="flex justify-between border p-3 rounded">
              <span>
                <b>
                  {m.number}. {m.title}
                </b>
              </span>
              <div className="space-x-2">
                <Link href={`/admin/courses/${id}/modules/${m._id}`}>
                  <button className="bg-blue-600 text-white px-2 py-1 rounded">
                    Lectures
                  </button>
                </Link>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(m._id)}
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
