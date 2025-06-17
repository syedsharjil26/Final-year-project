import { Button } from '@/components/ui/button';

interface University {
  id: string;
  name?: string;
  location?: string;
  logo?: string;
  description?: string;
  website?: string;
  latitude?: string | number;
  longitude?: string | number;
}

interface UniversityTableProps {
  universities: University[];
  onEdit: (u: University) => void;
  onDelete: (id: string) => void;
}

export default function UniversityTable({ universities, onEdit, onDelete }: UniversityTableProps) {
  return (
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Location</th>
          <th className="p-2 text-left">Website</th>
          <th className="p-2 text-left">Latitude</th>
          <th className="p-2 text-left">Longitude</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {universities.map((u: University) => (
          <tr key={u.id} className="border-t">
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.location}</td>
            <td className="p-2"><a href={u.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">{u.website}</a></td>
            <td className="p-2">{u.latitude}</td>
            <td className="p-2">{u.longitude}</td>
            <td className="p-2 space-x-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(u)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(u.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 