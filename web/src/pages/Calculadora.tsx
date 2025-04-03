import React from "react";
import { useState } from "react";

interface Payment {
  month: number;
  cuota: number;
  interest: number;
  amortization: number;
  balance: number;
}

export default function Calculadora() {
  const [amount, setAmount] = useState(50000);
  const [rate, setRate] = useState(14);
  const [months, setMonths] = useState(60);
  const [schedule, setSchedule] = useState<Payment[]>([]);

  const calculateSchedule = () => {
    const i = rate / 100 / 12;
    const cuota = (amount * i) / (1 - Math.pow(1 + i, -months));
    let balance = amount;
    const newSchedule: Payment[] = [];

    for (let month = 1; month <= months; month++) {
      const interest = balance * i;
      const amortization = cuota - interest;
      balance -= amortization;

      newSchedule.push({
        month,
        cuota: cuota,
        interest: interest,
        amortization: amortization,
        balance: balance > 0 ? balance : 0,
      });
    }
    setSchedule(newSchedule);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Simulador de Préstamos</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Monto del préstamo"
        />
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          placeholder="Tasa anual (%)"
        />
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          placeholder="Plazo en meses"
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        onClick={calculateSchedule}
      >
        Calcular
      </button>

      {schedule.length > 0 && (
        <table className="mt-4 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Mes</th>
              <th className="border p-2">Cuota</th>
              <th className="border p-2">Interés</th>
              <th className="border p-2">Amortización</th>
              <th className="border p-2">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((payment) => (
              <tr key={payment.month}>
                <td className="border p-2 text-center">{payment.month}</td>
                <td className="border p-2 text-center">{payment.cuota.toFixed(2)}</td>
                <td className="border p-2 text-center">{payment.interest.toFixed(2)}</td>
                <td className="border p-2 text-center">{payment.amortization.toFixed(2)}</td>
                <td className="border p-2 text-center">{payment.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
