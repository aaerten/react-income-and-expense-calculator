"use client";
import React, { useState } from "react";
import { Income, Expense } from "./components";

export default function Home() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-16 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">
          Main Balance{" "}
          <span className="text-sky-400">
            {totalIncome >= totalExpense ? "" : "-"}$
            {Math.abs(totalIncome - totalExpense)}
          </span>
        </h1>
        <div>
          <Income updateTotal={setTotalIncome} />
          <Expense updateTotal={setTotalExpense} />
        </div>
      </div>
    </main>
  );
}
