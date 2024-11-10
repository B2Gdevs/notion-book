import { CodeBlock, Dialog, DialogContent, Switch } from "ui";

interface StateDialogProps<T> {
  title: string;
  data: T[];
  isOpen: boolean;
  onClose: () => void;
  onToggle: (item: T, isActive: boolean) => Promise<void>;
  renderItem: (item: T) => React.ReactNode;
}

export const StateDialog = <T extends { id?: string; is_active?: boolean }>({
  title,
  data,
  isOpen,
  onClose,
  onToggle,
  renderItem,
}: StateDialogProps<T>) => {
  const toggleActive = async (item: T, isActive: boolean) => {
    try {
      await onToggle(item, isActive);
    } catch (error) {
      console.error(`Error updating ${title.toLowerCase()}:`, error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-100 rounded-lg shadow ">
        {data.length > 0 ? <h2 className="text-2xl">{title}</h2> : <div>No {title.toLowerCase()} found</div>}
        <div className="p-4 m-4 overflow-auto max-h-96 border-2 border-black rounded-lg">
          {data.map(item => (
            <div key={item.id} className="flex justify-between items-center gap-2 my-2">
              {renderItem(item)}
              <CodeBlock>Status: {item.is_active ? 'Active' : 'Inactive'}</CodeBlock>
              <Switch
                checked={item.is_active}
                className="inline-flex items-center"
                onClick={() => toggleActive(item, item.is_active ?? false)}
              >
                {item.is_active ? 'Deactivate' : 'Activate'}
              </Switch>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};