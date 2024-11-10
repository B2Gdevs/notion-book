import { Menu, useGetPhotosByMenu, useUpdatePhoto, copyTextToClipboard, toast, Button } from "ui";
import { StateDialog } from "./state-dialog";

interface PhotoStateDialogProps {
  menu: Menu;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoStateDialog: React.FC<PhotoStateDialogProps> = ({ menu, isOpen, onClose }) => {
  const { data: photos } = useGetPhotosByMenu(menu?.id ?? '');
  const updatePhotoMutation = useUpdatePhoto();

  return (
    <StateDialog
      title="Photos"
      data={photos ?? []}
      isOpen={isOpen}
      onClose={onClose}
      onToggle={(photo, isActive) =>
        updatePhotoMutation.mutateAsync({
          photoId: photo?.id ?? '',
          photo: {
            ...photo,
            is_active: !isActive
          },
        }).then(() => { })
      }
      // render a button that copies the photo's URL to the clipboard
      // renderItem={photo => <span className="font-righteous">{photo.url}</span>}
      renderItem={photo => (
        <div className="flex items-center space-x-2">
          <img src={photo.url} alt={photo.file_name} className="w-16 h-16 object-cover rounded-lg" />
          <Button
            onClick={() => {
              copyTextToClipboard(photo.url);
              toast({
                title: 'Copied',
                description: 'Photo URL copied to clipboard.',
                duration: 5000,
              });
            }}
            className="text-secondary-peach-orange"
          >
            Copy URL
          </Button>
        </div>
      )}
    />
  );
};