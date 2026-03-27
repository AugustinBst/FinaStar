"use client";
import { apiFetch } from "@/lib/api";
import { Plus } from "lucide-react";
import { useState } from "react";

const emojis = ["🎯", "🚀", "💶", "🏠", "✈️", "🎓", "💻", "💪", "🎮", "🏥", "👕", "👨‍🍳"];

interface Props {
  onSuccess?: () => void;
}

export default function GoalsModal({ onSuccess }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [selected, setSelected] = useState("🎯");
  const [goalName, setGoalName] = useState("");
  const [deadline, setDeadline] = useState(today);
  const [price, setPrice] = useState<number | null>(null);
  const [submit, setSubmit] = useState(false);

  const isValid = goalName.trim() !== "" && deadline !== "" && price !== null && price >= 0;

  const handleSubmit = async () => {
    setSubmit(true);
    if (!isValid) return;

    await apiFetch("/goals/", {
      method: "POST",
      body: JSON.stringify({
        emoji: selected,
        name: goalName,
        deadline: deadline,
        target_price: price,
      }),
    })

    setGoalName("");
    setDeadline(today);
    setPrice(null);
    setSelected("🎯");
    setSubmit(false);
    (document.getElementById("my_modal_goals") as HTMLDialogElement)?.close();
    onSuccess?.();
  };

  return (
    <div className="flex font-sans">
      <button
        className="btn btn-outline btn-accent border-(--color-base-700) text-base-content bg-base-300 hover:border-accent ease-in duration-300"
        onClick={() => (document.getElementById("my_modal_goals") as HTMLDialogElement)?.showModal()}
      >
        <Plus /> save goal
      </button>
      <dialog id="my_modal_goals" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col gap-6">
          <h3 className="font-bold text-lg">Add a goal</h3>

          <input
            type="text"
            placeholder="What is your goal?"
            className={`input input-accent w-60 text-center ${submit && goalName.trim() === "" ? "input-error" : ""}`}
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />

          <input
            type="number"
            className={`input input-accent w-60 text-center ${(price !== null && price < 0) || (submit && price === null) ? "input-error" : ""}`}
            placeholder="Target price ? 10€"
            min="0"
            max="10000000"
            value={price ?? ""}
            onChange={(e) => setPrice(e.target.valueAsNumber)}
          />

          <input
            type="date"
            min={today}
            className={`input input-accent w-60 ${submit && deadline === "" ? "input-error" : ""}`}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
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