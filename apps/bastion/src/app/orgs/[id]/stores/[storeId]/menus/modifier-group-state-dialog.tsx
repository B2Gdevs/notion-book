import { Menu, useGetModifierGroupsByMenu, useUpdateModifierGroup } from "ui";
import { StateDialog } from "./state-dialog";

interface ModifierGroupStateDialogProps {
  menu: Menu;
  isOpen: boolean;
  onClose: () => void;
}

export const ModifierGroupStateDialog: React.FC<ModifierGroupStateDialogProps> = ({ menu, isOpen, onClose }) => {
  const { data: modifierGroups } = useGetModifierGroupsByMenu(menu?.id ?? '');
  const updateModifierGroupMutation = useUpdateModifierGroup();

  return (
    <StateDialog
      title="Modifier Groups"
      data={modifierGroups ?? []}
      isOpen={isOpen}
      onClose={onClose}
      onToggle={(modifierGroup, isActive) =>
        updateModifierGroupMutation.mutateAsync({
          modifierGroupId: modifierGroup?.id ?? '',
          modifierGroupData: { 
            ...modifierGroup,
            is_active: !isActive },
        }).then(() => {})
      }
      renderItem={modifierGroup => <span className="font-righteous">{modifierGroup.name}</span>}
    />
  );
};