"use client";
import { apiFetch } from "@/lib/api";
import { Plus } from "lucide-react";
import { useState } from "react";

const emojis = ["🍔", "🏠", "🚗", "✈️", "💊", "🎓", "💻", "💪", "🎮", "👕", "🛒", "💸"];

export default function CategoryModal() {
  const [selected, setSelected] = useState("🍔");
  const [categoryName, setCategoryName] = useState("");
  const [submit, setSubmit] = useState(false);

  const isValid = categoryName.trim() !== "";

  const handleSubmit = async () => {
    setSubmit(true);
    if (!isValid) return;

    await apiFetch("/categories/", {
      method: "POST",
      body: JSON.stringify({
        name: categoryName,
        emoji: selected,
      }),
    })

    setCategoryName("");
    setSelected("🍔");
    setSubmit(false);
    (document.getElementById("my_modal_category") as HTMLDialogElement)?.close();
  };

  return (
    <div className="flex font-sans">
      <button
        className="btn btn-outline btn-accent border-(--color-base-700) text-base-content bg-base-300 hover:border-accent ease-in duration-300"
        onClick={() => (document.getElementById("my_modal_category") as HTMLDialogElement)?.showModal()}
      >
        <Plus /> add category
      </button>
      <dialog id="my_modal_category" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col gap-6">
          <h3 className="font-bold text-lg">Add a category</h3>

          <input
            type="text"
            placeholder="Category name"
            className={`input input-accent w-60 text-center ${submit && categoryName.trim() === "" ? "input-error" : ""}`}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <div className="dropdown dropdown-start">
            <div tabIndex={0} role="button" className="input input-accent cursor-pointer btn-base-200 text-xl w-60 flex justify-center items-center">
              {selected}
            </div>
            <ul tabIndex={0} className="dropdown-content grid grid-cols-6 bg-base-200 rounded-box z-1 p-2 shadow-sm gap-4 w-max">
              {emojis.map((emoji) => (
                <li key={emoji}>
                  <a onClick={() => {
                    setSelected(emoji);
                    (document.activeElement as HTMLElement)?.blur();
                  }}>
                    {emoji}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-action">
            <button className="btn btn-accent text-base-content" onClick={handleSubmit} disabled={submit && !isValid}>
              Submit
            </button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}