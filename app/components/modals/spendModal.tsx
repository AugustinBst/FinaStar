
"use client";
import { BanknoteArrowDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const emojis = ["🎯", "🚀", "💶", "🏠", "✈️", "🎓", "💻", "💪", "🎮",  "🏥", "👕", "👨‍🍳"];



export default function SpendModal() {
  const today = new Date().toISOString().split("T")[0];

  const [selected, setSelected] = useState("🎯");
  const [spendName, setspendName] = useState("");
  const [deadline, setDeadline] = useState(today);
  const [price, setPrice] = useState<number | null>(null);

  const [sumbit, setSumbit] = useState(false);

  const isValid = spendName.trim() !== "" && deadline !== "" && (price !== null && price >= 0);

  const handleSubmit = async () => {
    setSumbit(true);
    if (!isValid) return;
    const payload = {
      emoji: selected,
      name: spendName,
      deadline: deadline,
    };

    //TODO ✅ Remplace ces 2 lignes par ton fetch() quand le back est prêt :
    // const res = await fetch("/api/spends", { method: "POST", body: JSON.stringify(payload) });
    // const data = await res.json();

    const existing = JSON.parse(localStorage.getItem("spends") || "[]");
    existing.push({ id: Date.now(), ...payload });
    console.log("spend saved:", payload); // stockage temporaire
    localStorage.setItem("spends", JSON.stringify(existing));
    (document.getElementById("my_modal_5") as HTMLDialogElement)?.close();
    setSumbit(false);
  };



  return (
    <div className="flex font-sans">
        <button className="btn btn-outline btn-accent border-(--color-base-700) text-base-content bg-base-300 hover:border-accent ease-in duration-300" onClick={()=>(document.getElementById('my_modal_5') as HTMLDialogElement)?.showModal()}><BanknoteArrowDown />spend</button>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box flex flex-col gap-6">
            <h3 className="font-bold text-lg">You can set up a spend !</h3>
            <p className="py-4">Set up the deadline with the price of your spend so the app will help you to manage your budget !</p>

            <input
              type="date"
              min={today} className={`input input-accent w-60 flex justify-center ${sumbit && deadline === "" ? "input-error" : ""}`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <input
              type="text"
              placeholder="What is your spend ?"
              className={`input input-accent w-60 text-center ${sumbit && spendName.trim() === "" ? "input-error" : ""}`}
              value={spendName}
              onChange={(e) => setspendName(e.target.value)}
            />

            <input
              type="number"
              className={`input validator input-accent w-60 text-center ${(price !== null && price < 0) || (sumbit && price === null) ? "input-error" : ""}`}
              required
              placeholder="Price of your spend ? 10€"
              min="0"
              max="10000000"
              onChange={(e) => setPrice(e.target.valueAsNumber)}
            />

            <div className="dropdown dropdown-start">
              <div tabIndex={0} role="button" className="input input-accent cursor-pointer  btn-base-200  text-xl w-60 flex justify-center items-center">
                {selected}
              </div>
              <ul tabIndex={0} className="dropdown-content grid grid-cols-6 bg-base-200 rounded-box z-1 p-2 shadow-sm  gap-4 w-max">
                {emojis.map((emoji) => (
                  <li><a onClick={() => {
                    setSelected(emoji);
                    (document.activeElement as HTMLElement)?.blur();
                  }
                  }>{emoji}</a></li>
                ))}
              </ul>
            </div>



            <div className="modal-action">
              <button className="btn btn-accent text-base-content" onClick={handleSubmit} disabled={sumbit && !isValid}>Submit</button>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
    </div>
  );
}
