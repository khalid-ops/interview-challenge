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
import { Medication } from "@/app/medications/page";


interface MedicationUpsertFormProps {
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
    message: "Medication name is required",
  }),
  dosage: z.string({
    message: "Dosage is required",
  }),
  frequency: z.string({
    message: "Frequency is required",
  }),
})

type FormValues = z.infer<typeof FormSchema>;

export default function MedicationUpsertForm({open, onOpenChange, onSubmit, id, mode}: MedicationUpsertFormProps)  {
    const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
    });

  const MedicationRecord = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medications/${id}`);
      if (!response.ok) {
        toast.error('Network response was not ok');
      }
      const data = await response.json();
      return data as Medication;
    } catch (error) {
      toast.error('Failed to fetch medication:' + error);
      return null;
    }
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      if (mode === "create") {
        const response = await fetch(`${API_BASE_URL}/medications/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          toast.success('Medication created successfully');
        } else {
          toast.error('Failed to create medication');
        }
      } else if (mode === "update" && id !== null) {
        const response = await fetch(`${API_BASE_URL}/medications/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          toast.success('Medication updated successfully');
        } else {
          toast.error('Failed to update medication');
        }
      }
      onOpenChange(false);
      form.reset();
      onSubmit?.();
    } catch (error) {
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} medication: ${error}`);
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
    const fetchAndSetMedication = async () => {
      if (id !== null && mode === "update") {
        form.reset();
        const existingMedication = await MedicationRecord();
        if (existingMedication) {
          form.setValue("name", existingMedication.name);
          form.setValue("dosage", existingMedication.dosage);
          form.setValue("frequency", existingMedication.frequency);
        }
      }
    };

    fetchAndSetMedication();
  }, [id, mode, form]);

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{mode === "update" ? "Update Medication" : "Add Medication"}</DialogTitle>
              <DialogDescription>{"Fill in the form below to " + mode + " a medication"}</DialogDescription>
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
                        <Input defaultValue={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder="Enter medication name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField 
                  control={form.control} 
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input defaultValue={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder="Enter medication dosage" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField 
                  control={form.control} 
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input defaultValue={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder="Enter medication frequency" />
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

