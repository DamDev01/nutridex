"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewConsultation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patient: "",
    date: "",
    time: "",
    type: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/schedule");
      } else {
        setError("Erro ao agendar consulta");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">Nova Consulta</h1>
      <div className="max-w-lg mx-auto">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Card>
          <CardHeader>
            <CardTitle>Agendar Nova Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="patient" className="block text-sm font-medium">
                  Paciente
                </label>
                <Input
                  type="text"
                  id="patient"
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium">
                  Data
                </label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium">
                  Horário
                </label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
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
              <Button type="submit" className="w-full">
                Agendar Consulta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}