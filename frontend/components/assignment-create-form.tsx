import { Dialog } from "./ui/dialog";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { API_BASE_URL } from "@/app/api";
import React from "react";
import { toast } from "sonner";
import MultiSelectCombobox from "./ui/multi-select-combobox";
import { Medication } from "@/app/medications/page";
import Combobox from "./ui/combobox";


interface AssignmentCreateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onSubmit?: () => void
}

 
const FormSchema = z.object({
  startDate: z.string({
    message: "Start date is required",
  }),
  numberOfDays: z.number({
    message: "Number of days is required",
  }).int().positive(),
  patientId: z.string({
    message: "Patient ID is required",
  }),
  medicationIds: z.array(z.string()).nonempty({
    message: "At least one medication is required",
  }),
})

type FormValues = z.infer<typeof FormSchema>;

export default function AssignmentCreateForm({open, onOpenChange, onSubmit }: AssignmentCreateFormProps)  {
    const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        medicationIds: [],
      }
    });

  const [medications, setMedications] = React.useState<{ value: string; label: string }[]>([]);
  const [patients, setPatients] = React.useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/medications`);
        if (!response.ok) {
          toast.error('Network response was not ok');
        }
        const data = await response.json();
        const medications = data.map((medication: Medication) => ({
          value: String(medication.id),
          label: medication.name,
        }));
        setMedications(medications);
      } catch (error) {
        toast.error('Failed to fetch medications:' + error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/patients`);
        if (!response.ok) {
          toast.error('Network response was not ok');
        }
        const data = await response.json();
        const patients = data.map((patient: { id: number; name: string }) => ({
          value: String(patient.id),
          label: patient.name,
        }));
        setPatients(patients);
      } catch (error) {
        toast.error('Failed to fetch patients:' + error);
      }
    };

    fetchPatients();
    fetchMedications();
  }, []);



  const handleSubmit = async (data: FormValues) => {
    try {
        const response = await fetch(`${API_BASE_URL}/assignments/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data, medicationIds: data.medicationIds.map(id => Number(id)), patientId: Number(data.patientId)}),
        });
        if (response.ok) {
          toast.success('Assignment created successfully');
        } else {
          const errorText = await response.text();
          toast.error('Failed to create assignment: ' + JSON.parse(errorText).message);
        }
      onOpenChange(false);
      form.reset();
      onSubmit?.();
    } catch (error) {
      toast.error(`Failed to create assignment: ${error}`);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      return;
    }
  }, [open, form]);

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{"Add Assignment"}</DialogTitle>
              <DialogDescription>{"Fill in the form below to add an assignment"}</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={
                form.handleSubmit((data) => {
                  console.log(data);
                  handleSubmit(data);
                })
              } 
              className="space-y-6">
                <div className="space-y-2">
                  <FormField 
                  control={form.control} 
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input defaultValue={field.value} type="date" onChange={(e) => field.onChange(e.target.value)} placeholder="Enter Assignment start date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField 
                  control={form.control} 
                  name="numberOfDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Days</FormLabel>
                      <FormControl>
                        <Input defaultValue={field.value} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="Enter number of days" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField 
                  control={form.control} 
                  name="medicationIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Medications</FormLabel>
                      <FormControl>
                        <MultiSelectCombobox
                          options={medications}
                          selected={field.value}
                          onSelectionChange={field.onChange}
                          placeholder="Select medications"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField 
                  control={form.control} 
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Patient</FormLabel>
                      <FormControl>
                        <Combobox
                          options={patients}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select patient"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                </div>

                <DialogFooter className="gap-2">
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
  )
}

