import { createContext, useContext, useState, ReactNode } from 'react';

interface PropertyContextType {
  selectedProperty: { id: string; ownerId: string; ownerName: string; title: string } | null;
  setSelectedProperty: (property: { id: string; ownerId: string; ownerName: string; title: string } | null) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [selectedProperty, setSelectedProperty] = useState<{ id: string; ownerId: string; ownerName: string; title: string } | null>(null);

  return (
    <PropertyContext.Provider value={{ selectedProperty, setSelectedProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
}
