"use client";
import { FaCalendarAlt } from "react-icons/fa";
import React from "react";

export default function Calendario({ paidMonth }) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <section className="flex flex-col items-center justify-center h-full p-4 lg:ml-[200px] sm:ml-[100px]">
      <h2 className="text-xl font-bold mb-4">Calendário de Pagamento</h2>

      {/* Grid responsiva */}
      <div className="grid grid-cols-4 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-4">
        {months.map((month, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center rounded-lg 
              h-24 w-24 sm:h-36 sm:w-40 lg:h-44 lg:w-[180px]
              ${index === paidMonth ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}
          >
            <h1 className="text-lg font-semibold">{month}</h1>
            <FaCalendarAlt size={24} className="mt-2" />
          </div>
        ))}
      </div>
    </section>
  );
}
