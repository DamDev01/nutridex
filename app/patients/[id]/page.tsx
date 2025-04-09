import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function fetchPatient(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/patients`, { cache: "no-store" });
    if (!res.ok) {
      console.error("Erro ao buscar pacientes - Status:", res.status);
      return null;
    }
    const patients = await res.json();
    console.log("Pacientes recebidos:", patients); // Log para depuração
    const patient = patients.find((p: any) => p.id === Number(id)) || null;
    console.log("Paciente encontrado:", patient); // Log para depuração
    return patient;
  } catch (error) {
    console.error("Erro ao carregar paciente:", error);
    return null;
  }
}

async function fetchConsultations() {
  try {
    const res = await fetch("http://localhost:3000/api/consultations", { cache: "no-store" });
    if (!res.ok) {
      console.error("Erro ao buscar consultas - Status:", res.status);
      return null;
    }
    const consultations = await res.json();
    console.log("Consultas recebidas:", consultations); // Log para depuração
    return consultations;
  } catch (error) {
    console.error("Erro ao carregar consultas:", error);
    return null;
  }
}

export default async function PatientDetails({ params }: { params: { id: string } }) {
  const patient = await fetchPatient(params.id);
  const consultations = await fetchConsultations();
  const patientConsultations = consultations
    ? consultations.filter((c: any) => c.patient === patient?.name)
    : [];

  console.log("Paciente final:", patient); // Log para depuração
  console.log("Consultas do paciente:", patientConsultations); // Log para depuração

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-foreground">Paciente não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">Detalhes do Paciente</h1>
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{patient.name}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {patient.age} anos | {patient.height} | Peso: {patient.weight} | IMC: {patient.imc}
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="meal-plan" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="meal-plan">Plano Alimentar</TabsTrigger>
            <TabsTrigger value="guidelines">Orientações Gerais</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="lab-exams">Exames</TabsTrigger>
            <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
            <TabsTrigger value="notes">Anotações</TabsTrigger>
          </TabsList>

          {/* Plano Alimentar */}
          <TabsContent value="meal-plan">
            <Card>
              <CardHeader>
                <CardTitle>Plano Alimentar</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Elaborado em 15/02/2024 | Última atualização: 15/02/2024
                </p>
              </CardHeader>
              <CardContent>
                {patient.mealPlan.map((meal: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {meal.meal} | {meal.time}
                    </h3>
                    <ul className="list-disc list-inside mt-2">
                      {meal.items.map((item: string, i: number) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orientações Gerais */}
          <TabsContent value="guidelines">
            <Card>
              <CardHeader>
                <CardTitle>Orientações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {patient.generalGuidelines.map((guideline: string, index: number) => (
                    <li key={index} className="text-sm">{guideline}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Histórico de Medidas */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Medidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Progresso Peso e IMC</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Peso: -2.7kg | Gordura: -1.4% | IMC Atual: 21.23
                  </p>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">[Gráfico de Progresso]</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead>IMC</TableHead>
                      <TableHead>Gordura</TableHead>
                      <TableHead>Cintura</TableHead>
                      <TableHead>Quadril</TableHead>
                      <TableHead>Braço</TableHead>
                      <TableHead>Coxa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.measurements.map((measurement: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{measurement.date}</TableCell>
                        <TableCell>{measurement.weight}</TableCell>
                        <TableCell>{measurement.imc}</TableCell>
                        <TableCell>{measurement.fat}</TableCell>
                        <TableCell>{measurement.waist}cm</TableCell>
                        <TableCell>{measurement.hip}cm</TableCell>
                        <TableCell>{measurement.arm}cm</TableCell>
                        <TableCell>{measurement.thigh}cm</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registro Fotográfico */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Registro Fotográfico</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Última atualização: 22/02/2024</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Frontal</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Lateral</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Costas</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Braços</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Abdômen</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Pernas</p>
                  </div>
                </div>
                <Button className="mt-4">Adicionar Fotos</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exames Laboratoriais */}
          <TabsContent value="lab-exams">
            <Card>
              <CardHeader>
                <CardTitle>Exames Laboratoriais</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Última atualização: 10/02/2024</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo de Exame</TableHead>
                      <TableHead>Resultado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.labExams.map((exam: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>{exam.type}</TableCell>
                        <TableCell>{exam.result}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button className="mt-4">Adicionar Novo Exame</Button>
                <Button variant="outline" className="mt-4 ml-2">
                  Histórico Completo
                </Button>
                <Button variant="outline" className="mt-4 ml-2">
                  Exportar Relatório
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anamnese */}
          <TabsContent value="anamnese">
            <Card>
              <CardHeader>
                <CardTitle>Anamnese</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Última atualização: 15/02/2024</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Queixas Principais</h3>
                    <p className="text-sm">{patient.anamnese.complaints}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Histórico Médico</h3>
                    <p className="text-sm">{patient.anamnese.healthHistory}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Histórico Familiar</h3>
                    <p className="text-sm">{patient.anamnese.familyHistory}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Hábitos Alimentares</h3>
                    <p className="text-sm">{patient.anamnese.habits}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Alergias Alimentares</h3>
                    <p className="text-sm">{patient.anamnese.allergies}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Medicamentos em Uso</h3>
                    <p className="text-sm">{patient.anamnese.medications}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Estilo de Vida</h3>
                    <p className="text-sm">{patient.anamnese.lifestyle}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Atividade Física</h3>
                    <p className="text-sm">{patient.anamnese.activity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anotações de Consulta */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Anotações de Consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Nova Anotação</h3>
                  <Input
                    type="text"
                    placeholder="Digite suas anotações aqui..."
                    className="mt-2"
                  />
                  <Button className="mt-2">Salvar Anotação</Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Histórico de Anotações</h3>
                  {patient.notes.map((note: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{note.date}</p>
                      <p className="text-sm">{note.content}</p>
                      <div className="mt-2 flex space-x-2">
                        <Button variant="outline" size="sm">
                          Comparar
                        </Button>
                        <Button variant="outline" size="sm">
                          Tags
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}