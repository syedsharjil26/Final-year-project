import { useAuth } from '@/contexts/AuthContext';
import { usePropertyContext } from '@/contexts/PropertyContext';
import { RealTimeChatInterface } from '@/components/ui/RealTimeChatInterface';

export default function MessageCenterPage() {
  const { user } = useAuth();
  const { selectedProperty } = usePropertyContext();

  if (!user || user.role !== 'student' || !selectedProperty) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Message Center</h1>
      <RealTimeChatInterface
        propertyId={selectedProperty.id}
        userId={user.id}
        otherUserId={selectedProperty.ownerId}
        propertyTitle={selectedProperty.title}
      />
    </div>
  );
}
