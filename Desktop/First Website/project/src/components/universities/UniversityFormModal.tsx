import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface UniversityForm {
  name?: string;
  location?: string;
  logo?: string;
  description?: string;
  website?: string;
  latitude?: string | number;
  longitude?: string | number;
}

interface UniversityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UniversityForm;
  setForm: React.Dispatch<React.SetStateAction<UniversityForm>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editing: string | null;
}

export default function UniversityFormModal({ open, onOpenChange, form, setForm, onSubmit, editing }: UniversityFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit University' : 'Add University'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input name="name" value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" required />
          <Input name="location" value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" required />
          <Input name="description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
          <Input name="website" value={form.website ?? ''} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="Website" />
          <Input name="logo" value={form.logo ?? ''} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} placeholder="Logo URL" />
          <Input name="latitude" value={form.latitude ?? ''} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} placeholder="Latitude" type="number" step="any" />
          <Input name="longitude" value={form.longitude ?? ''} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} placeholder="Longitude" type="number" step="any" />
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="flex-1">{editing ? 'Update' : 'Add'}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 