"use client";
import { apiFetch } from "@/lib/api";
import { CreditCard } from "lucide-react";
import { useState } from "react";

const DEBT_TYPES = ["Student loan", "Mortgage", "Car loan", "Credit card", "Personal loan", "Other"];
const REGULARITIES = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
];

interface Props {
  onSuccess?: () => void;
}

export default function DebtModal({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Student loan");
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [regularity, setRegularity] = useState("monthly");
  const [submit, setSubmit] = useState(false);

  const isValid = name.trim() !== "" && totalAmount !== null && totalAmount > 0 && remainingAmount !== null && remainingAmount >= 0 && monthlyPayment !== null && monthlyPayment > 0;

  const handleSubmit = async () => {
    setSubmit(true);
    if (!isValid) return;

    await apiFetch("/debts/", {
      method: "POST",
      body: JSON.stringify({
        name,
        type,
        total_amount: totalAmount,
        remaining_amount: remainingAmount,
        monthly_payment: monthlyPayment,
        regularity,
      }),
    });

    setName("");
    setType("Student loan");
    setTotalAmount(null);
    setRemainingAmount(null);
    setMonthlyPayment(null);
    setRegularity("monthly");
    setSubmit(false);
    (document.getElementById("my_modal_debt") as HTMLDialogElement)?.close();
    onSuccess?.();
  };

  return (
    <div className="flex font-sans">
      <button
        className="btn btn-outline btn-accent border-(--color-base-700) text-base-content bg-base-300 hover:border-accent ease-in duration-300"
        onClick={() => (document.getElementById("my_modal_debt") as HTMLDialogElement)?.showModal()}
      >
        <CreditCard className="w-4 h-4" /> add debt
      </button>
      <dialog id="my_modal_debt" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">Add a debt</h3>

          <input
            type="text"
            placeholder="Debt name"
            className={`input input-accent w-full ${submit && name.trim() === "" ? "input-error" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="select select-accent w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {DEBT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Total amount"
            className={`input input-accent w-full ${submit && !totalAmount ? "input-error" : ""}`}
            min="0"
            value={totalAmount ?? ""}
            onChange={(e) => setTotalAmount(e.target.valueAsNumber)}
          />

          <input
            type="number"
            placeholder="Remaining amount"
            className={`input input-accent w-full ${submit && remainingAmount === null ? "input-error" : ""}`}
            min="0"
            value={remainingAmount ?? ""}
            onChange={(e) => setRemainingAmount(e.target.valueAsNumber)}
          />

          <input
            type="number"
            placeholder="Payment per period"
            className={`input input-accent w-full ${submit && !monthlyPayment ? "input-error" : ""}`}
            min="0"
            value={monthlyPayment ?? ""}
            onChange={(e) => setMonthlyPayment(e.target.valueAsNumber)}
          />

          <select
            className="select select-accent w-full"
            value={regularity}
            onChange={(e) => setRegularity(e.target.value)}
          >
            {REGULARITIES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
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