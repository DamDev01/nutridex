"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewPatient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    goal: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar o paciente (ex.: API)
    console.log("Novo paciente:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Novo Paciente</h1>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar ao Dashboard
        </Link>
      </header>
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-foreground"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-foreground"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-foreground"
            />
          </div>
          <div>
            <label htmlFor="goal" className="block text-sm font-medium">
              Objetivo
            </label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-foreground"
            >
              <option value="">Selecione um objetivo</option>
              <option value="perda-de-peso">Perda de Peso</option>
              <option value="ganho-de-massa">Ganho de Massa</option>
              <option value="manutencao">Manutenção</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Cadastrar Paciente
          </button>
        </form>
      </div>
    </div>
  );
}