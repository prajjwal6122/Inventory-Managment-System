import React from "react";

export default function LedgerTable({ ledger }) {
  const all = [
    ...ledger.purchases.map((p) => ({ ...p, type: "purchase" })),
    ...ledger.sales.map((s) => ({ ...s, type: "sale" })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        Transaction Ledger
      </h2>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Product ID</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Cost</th>
            <th className="p-2 border">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {all.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-400">
                No transactions yet
              </td>
            </tr>
          ) : (
            all.map((t, i) => (
              <React.Fragment key={i}>
                <tr
                  className={`${
                    t.type === "purchase"
                      ? "bg-green-50"
                      : "bg-red-50 text-gray-800"
                  }`}
                >
                  <td className="p-2 border capitalize">{t.type}</td>
                  <td className="p-2 border text-center">{t.product_id}</td>
                  <td className="p-2 border text-center">{t.quantity}</td>
                  <td className="p-2 border text-right">
                    {t.type === "purchase"
                      ? "₹" + t.unit_price
                      : "₹" + t.total_cost}
                  </td>
                  <td className="p-2 border text-center">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>

                {/* Allocation details */}
                {t.type === "sale" && t.allocations?.length > 0 && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="p-2 border text-sm">
                      <strong>Allocations:</strong>{" "}
                      {t.allocations
                        .map(
                          (a) =>
                            `Batch ${a.batch_id} → ${a.allocated_quantity} @ ₹${a.allocated_unit_cost}`
                        )
                        .join(", ")}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
