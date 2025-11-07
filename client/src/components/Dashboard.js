import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProductTable from "./ProductTable";
import LedgerTable from "./LedgerTable";
import SimulatorButton from "./Simulator";
import { io } from "socket.io-client";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [ledger, setLedger] = useState({ purchases: [], sales: [] });

  const loadData = async () => {
    const [pRes, lRes] = await Promise.all([
      API.get("/products"),
      API.get("/ledger"),
    ]);
    console.log(pRes);
    setProducts(pRes.data);
    setLedger(lRes.data);
  };

  useEffect(() => {
    loadData();
    const socket = io("http://localhost:3000");
    socket.on("inventory_event", () => loadData());
    return () => socket.disconnect();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-indigo-700">
          📦 FIFO Inventory Dashboard
        </h1>
        <div className="flex gap-2">
          <SimulatorButton onComplete={loadData} />
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
      {/* FIFO Explanation Section */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-bold text-indigo-700 mb-2">
          Understanding FIFO Inventory Logic
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          This system tracks all <strong>purchases</strong> and{" "}
          <strong>sales</strong> using the
          <strong> First-In-First-Out (FIFO)</strong> method. Each purchase
          creates a new batch of items at its purchase price. When a sale
          happens, the system consumes the{" "}
          <em>oldest available batches first</em>. This ensures that the cost of
          goods sold (COGS) always reflects the earliest purchase costs. The
          remaining stock and its value are then recalculated automatically
          after every transaction.
        </p>
      </div>
      {/* Inventory Summary Section */}
<div className="bg-white p-6 rounded-2xl shadow mb-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
    📊 Inventory & Financial Summary
  </h2>

  {(() => {
    // safely handle undefined data
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + (Number(p.total_cost) || 0),
      0
    );

    const totalSalesRevenue = ledger.sales.reduce(
      (sum, s) => sum + (Number(s.total_cost) || 0),
      0
    );

    const totalPurchaseCost = ledger.purchases.reduce(
      (sum, p) => sum + (Number(p.unit_price || 0) * Number(p.quantity || 0)),
      0
    );

    const profitLoss = totalSalesRevenue - totalPurchaseCost;
    const profitColor = profitLoss >= 0 ? "text-green-600" : "text-red-600";

    return (
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left">Metric</th>
            <th className="p-2 border text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border">Total Inventory Value</td>
            <td className="p-2 border text-right">
              ₹{totalInventoryValue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
          <tr>
            <td className="p-2 border">Total Sales Revenue</td>
            <td className="p-2 border text-right">
              ₹{totalSalesRevenue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
          <tr>
            <td className="p-2 border">Total Purchase Cost</td>
            <td className="p-2 border text-right">
              ₹{totalPurchaseCost.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
          <tr className="bg-gray-50 font-semibold">
            <td className="p-2 border">Overall Profit / Loss</td>
            <td className={`p-2 border text-right ${profitColor}`}>
              ₹{profitLoss.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tbody>
      </table>
    );
  })()}
</div>

      <ProductTable products={products} />
      <LedgerTable ledger={ledger} />
    </div>
  );
}
