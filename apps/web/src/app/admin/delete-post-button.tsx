"use client";

import { deletePostAction } from "./actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(e) => {
        if (!window.confirm(`למחוק את הפוסט "${title}"? לא ניתן לבטל פעולה זו.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="min-h-11 cursor-pointer rounded-control px-4 text-caption text-red-700 hover:bg-red-50"
      >
        מחיקה
      </button>
    </form>
  );
}
