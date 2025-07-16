"use client"

import { Button } from "@/components/ui/button"
import { ArrowBigDownIcon, ChevronRightIcon, Edit, Plus, Trash2Icon, Users } from "lucide-react"
import * as React from "react"
import { API_BASE_URL } from "./api"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Assignment } from "./assignments/page"
import PatientUpsertForm from "@/components/patient-upsert-form"
import { toast } from "sonner"

export type Patient = {
    id: number;
    name: string;
    dateOfBirth: string;
    assignments: Assignment[]
}


export default function Page() {

    const [patients, setPatients] = React.useState<Patient[]>([]);

    const [isPatientFormOpen, setIsPatientFormOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "update">("create");
    const [patientId, setPatientId] = React.useState<number | null>(null);
    const deletePatient = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Patient deleted successfully');
                fetchPatients();
            } else {
                toast.error('Failed to delete patient');
            }
        } catch (error) {
            toast.error(`Failed to delete patient: ${error}`);
        }
    };
    const fetchPatients = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients/with-treatment-details`);
            if (!response.ok) {
                toast.error('Network response was not ok');
            }
            const data = await response.json();
            setPatients(data);
        } catch (error) {
            toast.error(`Failed to fetch patients: ${error}`);
        }
    };

    React.useEffect(() => {
        fetchPatients();
    }, []);


  return (
    <>
    <div className="container mx-auto p-2">
        <div className="flex justify-between p-2 rounded-md bg-amber-100 border border-amber-300 mb-2 gap-4 items-center">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Patients</h1>
                <Users />
            </div>
            <div className="flex items-center gap-2 mr-2">
                <Button className="cursor-pointer" onClick={() => {setIsPatientFormOpen(true); setFormMode("create"); setPatientId(null);}}><Plus />Add Patient</Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 overflow-auto">
            {patients.map((patient) => (
                <Card className="w-full max-w-sm hover:shadow-lg" key={patient.id}>
                    <CardHeader>
                        <CardTitle>Name: {patient.name}</CardTitle>
                        <CardDescription>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</CardDescription>
                        <CardAction className="flex justify-end gap-2 ml-2">
                            <Button size={'icon'} onClick={() => {
                                setFormMode("update");
                                setPatientId(patient.id);
                                setIsPatientFormOpen(true);
                            }} className="cursor-pointer">
                                <Edit />
                            </Button>
                            <Button size={'icon'} variant={"destructive"}
                                onClick={() => deletePatient(patient.id)}
                                className="cursor-pointer">
                                <Trash2Icon />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between rounded-md bg-green-100 border border-green-300 p-2">
                                <h3>Assignments</h3>
                                <ArrowBigDownIcon className="text-gray-500" />
                            </div>
                            {patient.assignments.length > 0 ? (patient.assignments.map((assignment) => (
                                <div key={assignment.id} className="p-2 border border-gray-300 rounded-md mb-2">
                                    <p>Start Date: {assignment.startDate}</p>
                                    <div className="flex justify-between items-center">
                                        <p>Treatment Days Left </p>
                                        <ChevronRightIcon /> 
                                        <span className="text-2xl rounded-md bg-indigo-100 p-1 border border-indigo-300 ml-2">{assignment.treatmentDaysLeft} days</span>
                                    </div>
                                    <h6>Medications:</h6>
                                    <ul className="list-disc pl-5">
                                        {assignment.medications.map((medication) => (
                                            <li key={medication.id}>{medication.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))): (
                            <div className="p-2 border border-gray-300 rounded-md mb-2">
                                <p className="text-gray-500 flex justify-center">No assignments found for this patient.</p>
                            </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
    <PatientUpsertForm open={isPatientFormOpen} onOpenChange={setIsPatientFormOpen} mode={formMode} id={patientId!} onSubmit={fetchPatients}/>
    </>
  )
}


