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
import { Patient } from "@/app/page";
import { toast } from "sonner";


interface PatientUpsertFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onSubmit?: () => void
  id?: number
  mode?: "create" | "update"
}

 
const FormSchema = z.object({
  name: z.string({
    message: "Patient name is required",
  }),
  dateOfBirth: z.string({
    message: "Date of birth is required",
  }),
})

type FormValues = z.infer<typeof FormSchema>;

export default function PatientUpsertForm({open, onOpenChange, onSubmit, id, mode}: PatientUpsertFormProps)  {
    const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
    });

  const PatientRecord = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`);
      if (!response.ok) {
        toast.error('Network response was not ok');
      }
      const data = await response.json();
      return data as Patient;
    } catch (error) {
      toast.error('Failed to fetch patient:' + error);
      return null;
    }
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      if (mode === "create") {
        const response = await fetch(`${API_BASE_URL}/patients/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          toast.success('Patient created successfully');
        } else {
          toast.error('Failed to create patient');
        }
      } else if (mode === "update" && id !== null) {
        const response = await fetch(`${API_BASE_URL}/patients/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          toast.success('Patient updated successfully');
        } else {
          toast.error('Failed to update patient');
        }
      }
      onOpenChange(false);
      form.reset();
      onSubmit?.();
    } catch (error) {
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} patient: ${error}`);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      return;
    }
    if (mode === "create") {
      form.reset();
      return;
    }
    const fetchAndSetPatient = async () => {
      if (id !== null && mode === "update") {
        form.reset();
        const existingPatient = await PatientRecord();
        if (existingPatient) {
          form.setValue("name", existingPatient.name);
          form.setValue("dateOfBirth", existingPatient.dateOfBirth);
        }
      }
    };

    fetchAndSetPatient();
  }, [id, mode, form]);

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{mode === "update" ? "Update Patient" : "Add Patient"}</DialogTitle>
              <DialogDescription>{"Fill in the form below to " + mode + " a patient"}</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={
                form.handleSubmit((data) => {
                  handleSubmit(data);
                })
              } 
              className="space-y-6">
                <div className="space-y-2">
                  <FormField 
                  control={form.control} 
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input defaultValue={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder="Enter patient name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField 
                  control={form.control} 
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" defaultValue={field.value} onChange={(e) => field.onChange(e.target.value)} />
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

