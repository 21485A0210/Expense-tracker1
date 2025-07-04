import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: "", amount: "", category: "", date: "" });

  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) setExpenses(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.category || !form.date) return;
    setExpenses([...expenses, { ...form, amount: parseFloat(form.amount) }]);
    setForm({ description: "", amount: "", category: "", date: "" });
  };

  const grouped = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: "Expense by Category",
        data: Object.values(grouped),
        backgroundColor: ["#1e88e5", "#f4511e", "#43a047", "#fb8c00"],
      },
    ],
  };

  return (
    <div className="container">
      <h1 className="heading">Expense Tracker</h1>
      <form className="form" onSubmit={addExpense}>
        <input
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          className="input"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          className="input"
          placeholder="Category (e.g. Food, Rent)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          type="date"
          className="input"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button className="button">Add Expense</button>
      </form>

      <h2 className="subheading">Recent Expenses</h2>
      <ul className="expense-list">
        {expenses.map((e, i) => (
          <li key={i} className="expense-item">
            {e.date} - {e.description} - ₹{e.amount} ({e.category})
          </li>
        ))}
      </ul>

      <div className="chart-container">
        <Bar data={data} />
      </div>
    </div>
  );
};

export default App;
