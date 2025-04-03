"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewConsultation() {
  const [formData, setFormData] = useState({
    patient: "",
    date: "",
    time: "",
    type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar a consulta (ex.: API)
    console.log("Nova consulta:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nova Consulta</h1>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar ao Dashboard
        </Link>
      </header>
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="patient" className="block text-sm font-medium">
              Paciente
            </label>
            <input
              type="text"
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-foreground"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-foreground"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium">
              Horário
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-foreground"
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium">
              Tipo de Consulta
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-foreground"
            >
              <option value="">Selecione o tipo</option>
              <option value="primeira-consulta">Primeira Consulta</option>
              <option value="retorno">Retorno</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Agendar Consulta
          </button>
        </form>
      </div>
    </div>
  );
}