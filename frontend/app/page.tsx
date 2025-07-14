"use client"

import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import * as React from "react"
import { API_BASE_URL } from "./api"

export type Patient = {
    id: number;
    name: string;
    dateOfBirth: string;
}


export default function Home() {

    const [patients, setPatients] = React.useState<Patient[]>([]);
    const fetchPatients = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPatients(data);
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        }
    };

    React.useEffect(() => {
        fetchPatients();
    }, []);
  return (
    <div className="container mx-auto p-2">
        <div className="flex justify-between p-2 rounded-md bg-amber-100 border border-amber-300 mb-2 gap-4 items-center">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Patients</h1>
                <Users />
            </div>
            <div className="flex items-center gap-2 mr-2">
                <Button className="cursor-pointer"><Plus />Add Patient</Button>
            </div>
        </div>
        <div className="flex rounded-md border overflow-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Date of Birth</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id} className="border-b">
                            <td className="p-2">{patient.name}</td>
                            <td className="p-2">{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}


