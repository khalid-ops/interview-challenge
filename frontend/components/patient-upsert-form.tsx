import { Dialog } from "./ui/dialog";

import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
interface PatientUpsertFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onSubmit?: (data: FormData) => void
  id?: number
  mode?: "create" | "update"
}

export default function PatientUpsertForm({open, onOpenChange, title = "Add Patient", description = "Fill in the details below to add a new patient.", onSubmit, id, mode}: PatientUpsertFormProps)  {

    return(
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="textInput">Name</Label>
            <Input
              id="textInput"
              placeholder="Enter your name"
              value={formData.textInput}
              onChange={(e) => setFormData({ ...formData, textInput: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>

          </div>

          {/* <div className="space-y-2">
            <Label>Categories</Label>
            <MultiSelectCombobox
              options={categories}
              selected={formData.multiSelect1}
              onSelectionChange={(selected) => setFormData({ ...formData, multiSelect1: selected })}
              placeholder="Select categories"
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <MultiSelectCombobox
              options={skills}
              selected={formData.multiSelect2}
              onSelectionChange={(selected) => setFormData({ ...formData, multiSelect2: selected })}
              placeholder="Select skills"
            />
          </div> */}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline">
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>)
}