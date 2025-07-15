'use client';
import { Button } from "@/components/ui/button";
import { Plus, PillBottleIcon, Edit, Trash2Icon } from "lucide-react";
import React from "react";
import { API_BASE_URL } from "../api";

export type Medication = {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
}

export default function Page() {

    const [medications, setMedications] = React.useState<Medication[]>([]);

    const fetchMedications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/medications`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMedications(data);
        } catch (error) {
            console.error('Failed to fetch medications:', error);
        }
    };

    React.useEffect(() => {
        fetchMedications();
    }, []);
    return (
    <div className="container mx-auto p-2">
        <div className="flex justify-between p-2 rounded-md bg-amber-100 border border-amber-300 mb-2 gap-4 items-center">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Medications</h1>
                <PillBottleIcon />
            </div>
            <div className="flex items-center gap-2 mr-2">
                <Button className="cursor-pointer"><Plus />Add Medication</Button>
            </div>
        </div>
        <div className="flex rounded-md border overflow-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Dosage</th>
                        <th className="p-2 text-left">Frequency</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {medications.map((medication) => (
                        <tr key={medication.id} className="border-b">
                            <td className="p-2">{medication.name}</td>
                            <td className="p-2">{medication.dosage}</td>
                            <td className="p-2">{medication.frequency}</td>
                            <td className="p-2">
                                <Button size={'icon'} className="mr-2">
                                    <Edit />
                                </Button>
                                <Button size={'icon'} variant={"destructive"}>
                                    <Trash2Icon />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    )
}