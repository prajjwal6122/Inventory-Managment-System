import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode'; 

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      const decode=jwtDecode(res.data.token);
      localStorage.setItem('user',JSON.stringify(decode))
      onLogin();
      navigate("/"); // ✅ redirect to dashboard
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h1 className="text-2xl font-semibold text-center mb-4 text-indigo-600">
          Inventory Dashboard Login
        </h1>
        {error && (
          <div className="text-red-500 text-center text-sm mb-2">{error}</div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
