import { useState } from 'react';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Input } from './input';
import { Label } from './label';

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'homeowner' | 'admin';
    avatar?: string;
  };
  listingCount?: number;
  savedCount?: number;
  onUpdate?: (data: { name: string; avatar?: string; contact?: string }) => void;
}

export function ProfileCard({ user, listingCount, savedCount, onUpdate }: ProfileCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [contact, setContact] = useState('');

  const handleSave = () => {
    if (onUpdate) onUpdate({ name, avatar, contact });
    setEditOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-muted text-muted-foreground capitalize">
            {user.role}
          </span>
        </div>
        {user.role === 'homeowner' && (
          <div className="mt-2 text-sm">Listings: <span className="font-semibold">{listingCount ?? 0}</span></div>
        )}
        {user.role === 'student' && (
          <div className="mt-2 text-sm">Saved Properties: <span className="font-semibold">{savedCount ?? 0}</span></div>
        )}
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          Edit Profile
        </Button>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input id="avatar" value={avatar} onChange={e => setAvatar(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input id="contact" value={contact} onChange={e => setContact(e.target.value)} placeholder="Phone or other contact info" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 