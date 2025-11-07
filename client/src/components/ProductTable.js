import React from "react";

export default function ProductTable({ products }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Product Stock Overview</h2>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left">Product ID</th>
            <th className="p-2 border text-right">Current Quantity</th>
            <th className="p-2 border text-right">Total Inventory Cost</th>
            <th className="p-2 border text-right">Average Cost / Unit</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">
                No Data Available
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.product_id} className="border-t">
                <td className="p-2 border">{p.product_id}</td>
                <td className="p-2 border text-right">{p.total_quantity}</td>
                <td className="p-2 border text-right">
                  ₹{p.total_cost.toLocaleString("en-IN")}
                </td>
                <td className="p-2 border text-right">
                  ₹{p.average_cost.toLocaleString("en-IN")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
