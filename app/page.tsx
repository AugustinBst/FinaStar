"use client";
import SpendModal from "./components/modals/spendModal";
import GoalsModal from "./components/modals/goalsModal";
import Particles from "./components/particles";
import { TitleRotate } from "./components/titleRotate";
import DepositModal from "./components/modals/depositModal";
import { StatCard } from "./components/cards/statCards";
import { Carousel } from "./components/carousel/carousel";
import { useEffect, useState } from "react";
import {CreditCard, HandCoins, PiggyBankIcon, Trash, WalletIcon } from "lucide-react";
import { StatCardCompact } from "./components/cards/statCardsCompact";
import CategoryModal from "./components/modals/categoryModal";
import { apiFetch, getToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import DebtModal from "./components/modals/debtModal";

interface Goal {
  id: string;
  emoji: string;
  name: string;
  deadline: string;
  target_price: number;
  amount_saved: number;
  progress: number;
}

interface Overview {
  balance: number;
  monthly_expenses: number;
  monthly_savings: number;
}

interface Profil {
  id: string;
  pseudo: string;
  age: number | null;
  currency: string;
  avatar: string | null;
  created_at: string;
}

interface Debt {
  id: string;
  name: string;
  type: string;
  total_amount: number;
  remaining_amount: number;
  monthly_payment: number;
  regularity: string;
  progress: number;
}

export default function Home() {

  const [goals, setGoals] = useState<Goal[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [profil, setProfil] = useState<Profil | null>(null);

  const router = useRouter();
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    await apiFetch("/debts/process-payments", { method: "POST" });

    apiFetch("/goals/")
      .then((res: Response) => res.json())
      .then((data: Goal[]) => setGoals(data));

    apiFetch("/overview/")
      .then((res: Response) => res.json())
      .then((data: Overview) => setOverview(data));

    apiFetch("/auth/me")
      .then((res: Response) => res.json())
      .then((data: Profil) =>  setProfil(data));

    apiFetch("/debts/")
      .then((res: Response) => res.json())
      .then((data: Debt[]) => setDebts(data));
  };

  const deleteGoal = async (id: string) => {
    await apiFetch(`/goals/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleDeleteDebt = async (id: string) => {
    await apiFetch(`/debts/${id}`, { method: "DELETE" });
    fetchData();
  };
  return (

    <div className="relative min-h-screen w-full overflow-x-hidden bg-base-100">
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ff40ff"]}
          particleCount={500}
          particleSpread={20}
          speed={0.2}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-8 md:gap-10 font-sans min-h-full py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <TitleRotate />
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <GoalsModal onSuccess={fetchData} />
          <CategoryModal />
          <SpendModal onSuccess={fetchData} />
          <DepositModal onSuccess={fetchData} />
          <DebtModal onSuccess={fetchData} />
        </div>

        <div className="font-sans font-light flex flex-col items-center w-full">
          {goals && goals.length > 0 ? (
          <div className="flex flex-col justify-center items-start w-full max-w-5xl">
            <h1 className="flex justify-center text-center text-lg font-sans font-semibold mb-4 w-full">
              YOUR GOALS
            </h1>

            <div className="flex justify-center overflow-hidden w-full">
              <Carousel items={goals.map((goal) => (
                <StatCard
                  key={goal.id}
                  icon={<span className="text-2xl">{goal.emoji}</span>}
                  title={goal.name}
                  current={Number(goal.amount_saved)}
                  target={Number(goal.target_price)}
                  progress={Math.round(goal.progress)}
                  currency={profil?.currency}
                  actionLabel={<Trash className="text-base-content"/>}
                  onAction={() => deleteGoal(goal.id)}
                />
              ))} />
            </div>
          </div>
          ) : (
          <p className="text-base-content text-lg text-center mt-4">
            Create your first{' '}
            <button
              onClick={() => (document.getElementById("my_modal_goals") as HTMLDialogElement)?.showModal()} 
              className="text-accent text-lg hover:underline"
            >
              goal
            </button>
          </p>
          )}

          <div className="flex flex-col justify-center items-start mt-10 w-full max-w-5xl">
            <h1 className="flex justify-start text-start text-lg font-sans font-semibold mb-4 w-full">
              OVERVIEW
            </h1>
            {/* Utilisation de grid pour gérer facilement 1 colonne sur mobile, et 3 sur écrans moyens/larges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <StatCardCompact
                icon={<WalletIcon className="text-fuchsia-500 w-6 h-6" />}
                title="Total Balance"
                value={overview?.balance ?? 0}
                currency={profil?.currency}
              />
              <StatCardCompact
                icon={<HandCoins className="text-fuchsia-500 w-6 h-6" />}
                title="Month Spending"
                value={overview?.monthly_expenses ?? 0}
                currency={profil?.currency}
              />
              <StatCardCompact
                icon={<PiggyBankIcon className="text-fuchsia-500 w-6 h-6" />}
                title="Month Saving"
                value={overview?.monthly_savings ?? 0}
                currency={profil?.currency}
              />
            </div>
          </div>
          {debts.length > 0 && (
            <div className="flex flex-col justify-center items-start mt-10 w-full max-w-5xl">
              <h1 className="text-lg font-sans font-semibold mb-4 w-full">DEBTS</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {debts.map((debt) => (
                  <StatCard
                    key={debt.id}
                    icon={<CreditCard className="text-fuchsia-500 w-6 h-6" />}
                    title={debt.name}
                    body={debt.type}
                    current={Number(debt.total_amount) - Number(debt.remaining_amount)}
                    target={Number(debt.total_amount)}
                    progress={Math.round(debt.progress)}
                    currency="€"
                    actionLabel={<Trash className="text-base-content"/>}
                    onAction={() => handleDeleteDebt(debt.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}