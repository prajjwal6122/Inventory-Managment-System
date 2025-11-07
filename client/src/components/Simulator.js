import React, { useState } from "react";
import API from "../api/api";

export default function SimulatorButton({ onComplete }) {
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    try {
      await API.post("/simulate", { count: 8 });
      onComplete?.();
    } catch (err) {
      console.error(err);
      alert("Failed to simulate events");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={simulate}
      disabled={loading}
      className={`${
        loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
      } text-white px-4 py-2 rounded-lg transition`}
    >
      {loading ? "Simulating..." : "Simulate Kafka Events"}
    </button>
  );
}
