"use client";
import { apiFetch } from "@/lib/api";
import { PiggyBank } from "lucide-react";
import { useState, useEffect } from "react";

interface Goal {
  id: string;
  name: string;
  emoji: string;
}

interface Props {
  onSuccess?: () => void;
}

export default function DepositModal({ onSuccess }: Props) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [submit, setSubmit] = useState(false);

  const isValid = price !== null && price >= 0;


    useEffect(() => {
      apiFetch("/goals/")
        .then((res: Response) => res.json())
        .then((data: Goal[]) => setGoals(data));
    }, []);

  const handleSubmit = async () => {
    setSubmit(true);
    if (!isValid) return;


    await apiFetch("/transactions/", {
      method: "POST",
      body: JSON.stringify({
        type: "deposit",
        amount: price,
        goal_id: selectedGoal,
      }),
    })

    setPrice(null);
    setSelectedGoal(null);
    setSubmit(false);
    (document.getElementById("my_modal_deposit") as HTMLDialogElement)?.close();
    onSuccess?.();
  };

  return (
    <div className="flex font-sans">
      <button
        className="btn btn-outline btn-accent border-(--color-base-700) text-base-content bg-base-300 hover:border-accent ease-in duration-300"
        onClick={() => (document.getElementById("my_modal_deposit") as HTMLDialogElement)?.showModal()}
      >
        <PiggyBank /> save deposit
      </button>
      <dialog id="my_modal_deposit" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col gap-6">
          <h3 className="font-bold text-lg">Add a deposit</h3>

          <input
            type="number"
            className={`input input-accent w-60 text-center ${(price !== null && price < 0) || (submit && price === null) ? "input-error" : ""}`}
            placeholder="Amount ? 10€"
            min="0"
            value={price ?? ""}
            onChange={(e) => setPrice(e.target.valueAsNumber)}
          />

          <select
            className="select select-accent w-60"
            value={selectedGoal ?? ""}
            onChange={(e) => setSelectedGoal(e.target.value || null)}
          >
            <option value="">No goal linked</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.emoji} {goal.name}
              </option>
            ))}
          </select>

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