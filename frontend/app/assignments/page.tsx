'use client';

import { Edit2, LifeBuoyIcon, Plus, Trash2Icon } from "lucide-react";
import { Medication } from "../medications/page";
import { Patient } from "../page";
import { Button } from "@/components/ui/button";
import React from "react";
import { API_BASE_URL } from "../api";

export type Assignment = {
    id: number;
    startDate: string;
    numberOfDays: number;
    patient: Patient;
    medications: Medication[];
    treatmentDaysLeft?: number; 
}
export default function Page() {

    const[assignments, setAssignments] = React.useState<Assignment[]>([]);

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/assignments`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Failed to fetch medications:', error);
        }
    };

    React.useEffect(() => {
        fetchAssignments();
    }, []);
    return (
    <div className="container mx-auto p-2">
        <div className="flex justify-between p-2 rounded-md bg-amber-100 border border-amber-300 mb-2 gap-4 items-center">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Assignments</h1>
                <LifeBuoyIcon />
            </div>
            <div className="flex items-center gap-2 mr-2">
                <Button className="cursor-pointer"><Plus />Add Assignment</Button>
            </div>
        </div>
        <div className="flex rounded-md border overflow-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">Start Date</th>
                        <th className="p-2 text-left">Medications</th>
                        <th className="p-2 text-left">Days Left</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.id} className="border-b">
                            <td className="p-2">{new Date(assignment.startDate).toLocaleDateString()}</td>
                            <td className="p-2">{assignment.medications.map(med => med.name).join(", ")}</td>
                            <td className="p-2">{assignment.treatmentDaysLeft}</td>
                            <td className="p-2">
                                <Button size={'icon'} className="mr-2">
                                    <Edit2 />
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