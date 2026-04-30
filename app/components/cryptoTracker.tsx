import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface CryptoRate {
  id: string;
  crypto_name: string;
  price: number;
  consulted_at: string;
}

export function CryptoTracker() {
  const [cryptoInput, setCryptoInput] = useState("");
  const [history, setHistory] = useState<CryptoRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await apiFetch("/crypto/history");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.error("API did not return an array:", data);
        setHistory([]); 
      }
    } catch (error) {
      console.error("Failed to fetch crypto history:", error);
      setHistory([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSaveRate = async () => {
    if (!cryptoInput) return;

    try {
      await apiFetch("/crypto/save-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crypto: cryptoInput.toLowerCase() })
      });
      setCryptoInput("");
      fetchHistory();
    } catch (error) {
      console.error("Failed to save rate:", error);
    }
  };

  return (
    <div className="mt-10 w-full max-w-5xl bg-base-300 rounded-3xl border border-base-700 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-base-content mb-4">Crypto Live Tracker</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={cryptoInput}
          onChange={(e) => setCryptoInput(e.target.value)}
          placeholder="e.g. bitcoin, ethereum"
          className="input input-bordered w-full rounded-2xl"
        />
        <button onClick={handleSaveRate} className="btn btn-primary rounded-2xl">
          Save Price
        </button>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-base-content/70">Loading history...</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price (USD)</th>
                <th>Time Checked</th>
              </tr>
            </thead>
            <tbody>
              {history && history.length > 0 ? (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.crypto_name}</td>
                    <td>${item.price}</td>
                    <td>{new Date(item.consulted_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-base-content/50">
                    No history found. Search a crypto to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}