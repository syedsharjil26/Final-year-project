import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import UniversityTable from '@/components/universities/UniversityTable';
import UniversityFormModal, { UniversityForm } from '@/components/universities/UniversityFormModal';
import { Button } from '@/components/ui/button';

interface University extends UniversityForm {
  id: string;
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<UniversityForm>({ name: '', location: '', description: '', website: '', logo: '', latitude: '', longitude: '' });

  useEffect(() => {
    fetchUniversities();
  }, []);

  async function fetchUniversities() {
    const { data } = await supabase.from('universities').select('*');
    setUniversities((data as University[]) || []);
  }

  function openAdd() {
    setEditing(null);
    setForm({ name: '', location: '', description: '', website: '', logo: '', latitude: '', longitude: '' });
    setShowModal(true);
  }

  function openEdit(u: University) {
    setEditing(u.id);
    setForm(u);
    setShowModal(true);
  }

  async function handleDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this university?')) {
      await supabase.from('universities').delete().eq('id', id);
      fetchUniversities();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (editing) {
      await supabase.from('universities').update(form).eq('id', editing);
    } else {
      await supabase.from('universities').insert([form]);
    }
    setShowModal(false);
    fetchUniversities();
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">University Management</h1>
        <Button onClick={openAdd}>Add University</Button>
      </div>
      <UniversityTable universities={universities} onEdit={openEdit} onDelete={handleDelete} />
      <UniversityFormModal
        open={showModal}
        onOpenChange={setShowModal}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        editing={editing}
      />
    </div>
  );
} 