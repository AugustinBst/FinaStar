"use client";
import { apiFetch } from "@/lib/api";
import { BanknoteArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface Props {
  onSuccess?: () => void;
}

export default function SpendModal({ onSuccess }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [spendName, setSpendName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [submit, setSubmit] = useState(false);

  const isValid = spendName.trim() !== "" && price !== null && price >= 0;

  useEffect(() => {
    apiFetch("/categories/")
      .then((res: Response) => res.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  const handleSubmit = async () => {
    setSubmit(true);
    if (!isValid) return;

    await apiFetch("/transactions/", {
      method: "POST",
      body: JSON.stringify({
        type: "expense",
        amount: price,
        category_id: selectedCategory,
      }),
    })

    setSpendName("");
    setPrice(null);
    setSelectedCategory(null);
    setSubmit(false);
    (document.getElementById("my_modal_spend") as HTMLDialogElement)?.close();
    onSuccess?.();
  };

  return (
    <div className="flex font-sans">
      <button
        className="btn btn-outline btn-accent border-(--color-base-700) text-base-content bg-base-300 hover:border-accent ease-in duration-300"
        onClick={() => (document.getElementById("my_modal_spend") as HTMLDialogElement)?.showModal()}
      >
        <BanknoteArrowDown /> spend
      </button>
      <dialog id="my_modal_spend" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col gap-6">
          <h3 className="font-bold text-lg">Add a spend</h3>

          <input
            type="text"
            placeholder="What did you spend on?"
            className={`input input-accent w-60 text-center ${submit && spendName.trim() === "" ? "input-error" : ""}`}
            value={spendName}
            onChange={(e) => setSpendName(e.target.value)}
          />

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
            value={selectedCategory ?? ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
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