"use client";
import SpendModal from "./components/modals/spendModal";
import GoalsModal from "./components/modals/goalsModal";
import Particles from "./components/particles";
import { TitleRotate } from "./components/titleRotate";
import DepositModal from "./components/modals/depositModal";
import { StatCard } from "./components/cards/statCards";
import { Carousel } from "./components/carousel/carousel";
import { useEffect, useState } from "react";
import { HandCoins, PiggyBankIcon, WalletIcon } from "lucide-react";
import { StatCardCompact } from "./components/cards/statCardsCompact";

interface Goal {
  id: number;
  emoji: string;
  name: string;
  deadline: string;
}

export default function Home() {
  const [listGoals, setListGoals] = useState<Goal[]>([]);



  // Lecture initiale
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("goals") || "[]");
    setListGoals(stored);
  }, []);

  // Re-lecture quand la fenêtre reprend le focus (après fermeture du modal)
  useEffect(() => {
    const refresh = () => {
      const stored = JSON.parse(localStorage.getItem("goals") || "[]");
      setListGoals(stored);
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Particles plein écran en fond */}
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

      {/* Contenu par-dessus */}
      <div className="relative z-10 flex flex-col gap-10 font-sans h-full">
        <div className="flex justify-center">
          <TitleRotate />
        </div>
        <div className="flex justify-center gap-4">
          <GoalsModal />
          <SpendModal/>
          <DepositModal/>
        </div>

        <div className="font-sans font-light flex flex-col items-center">

          <div className="flex flex-col justify-center items-start">
                <h1 className="flex justify-start text-start text-lg font-sans font-semibold mb-2">YOUR GOALS</h1>
                <div className="flex justify-center overflow-hidden max-w-5xl">
                      <Carousel items={[
                      <StatCard icon={<PiggyBankIcon className="text-fuchsia-500 w-6 h-6" />} title="Emergency Fund"  current={1400} target={2000} progress={68} actionLabel="View details" onAction={() => console.log("details")} />,
                      <StatCard icon={<PiggyBankIcon className="text-fuchsia-500 w-6 h-6" />} title="Emergency Fund"  current={1400} target={2000} progress={68} actionLabel="View details" onAction={() => console.log("details")} />,
                      <StatCard icon={<PiggyBankIcon className="text-fuchsia-500 w-6 h-6" />} title="Emergency Fund"  current={1400} target={2000} progress={68} actionLabel="View details" onAction={() => console.log("details")} />,
                      <StatCard icon={<PiggyBankIcon className="text-fuchsia-500 w-6 h-6" />} title="Emergency Fund"  current={1400} target={2000} progress={68} actionLabel="View details" onAction={() => console.log("details")} />,
                      ]} />
                </div>
          </div>
          <div className="flex flex-col justify-center items-start mt-8">
                <h1 className="flex justify-start text-start text-lg font-sans font-semibold mb-2">OVERVIEW</h1>
                <div className="flex justify-center overflow-hidden max-w-5xl gap-4">
                  <StatCardCompact
                    icon={<WalletIcon className="text-fuchsia-500 w-6 h-6" />}
                    title="Total Balance"
                    value={2500}
                    currency="€"
                  />
                  <StatCardCompact
                    icon={<HandCoins className="text-fuchsia-500 w-6 h-6" />}
                    title="Month Spending"
                    value={93}
                    currency="€"
                  />
                  <StatCardCompact
                    icon={<PiggyBankIcon className="text-fuchsia-500 w-6 h-6" />}
                    title="Month Saving"
                    value={136}
                    currency="€"
                  />
                </div>
          </div>
        </div>
      </div>

    </div>
  );
}