'use client';
import { useRouter } from 'next/navigation';
import { Area, Button, useToast } from 'ui';

// AreaView.tsx
export const AreaView: React.FC<{ area: Area }> = ({ area }) => {
  const router = useRouter();
  const { toast } = useToast();
  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl  mb-2">{area.name}</h2>
      <div>Description: {area.description}</div>
      <img
        src={area?.image_url ?? ''}
        alt={area?.name ?? ''}
        className="w-64 h-64 mt-4"
      />
      <Button
        onClick={() => {
          toast({
            title: 'Edit Area',
            description: 'Going to edit the area',
          });
          router.push(`/areas/${area.id}`);
        }}
      >
        Edit Area
      </Button>
    </div>
  );
};
