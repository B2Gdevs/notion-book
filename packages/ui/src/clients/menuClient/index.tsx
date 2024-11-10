import { ItemPart } from './itemPart';
import { MenuPart } from './menuPart';
import { CategoryPart } from './categoryPart';
import { ModifierGroupPart } from './modifierGroupPart';
import { PhotoPart } from './photoPart';
import { Mixin } from '../mixin';

export const MenuClient = Mixin(
  MenuPart,
  ItemPart,
  CategoryPart,
  ModifierGroupPart,
  PhotoPart,
);
