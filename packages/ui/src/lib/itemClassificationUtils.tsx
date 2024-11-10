import {DairyIcon} from "../icons/DairyIcon";
import {NutsIcon} from "../icons/NutsIcon";
import {VegetarianIcon} from "../icons/VegetarianIcon";
import {ChineseIcon} from "../icons/ChineseIcon";
import {PizzaIcon} from "../icons/PizzaIcon";
import {IndianIcon} from "../icons/IndianIcon";
import {ItalianIcon} from "../icons/ItalianIcon";
import {MexicanIcon} from "../icons/MexicanIcon";
import {MediterraneanIcon} from "../icons/MediterraneanIcon";
import {ThaiIcon} from "../icons/ThaiIcon";
import {JapaneseIcon} from "../icons/JapaneseIcon";
import {VietnameseIcon} from "../icons/VietnameseIcon";
import React from "react";
import { ItemClassificationTags } from "../constants/constants";
import { UtensilsIcon } from "lucide-react";
import { SaladsIcon } from "../icons/SaladsIcon";
import { SandwichIcon } from "../icons/SandwichIcon";
import { BowlsIcon } from "../icons/BowlsIcon";
import { BurgersIcon } from "../icons/BurgersIcon";

export function getIconForClassification(tag: string): React.ComponentType<any> | null {
  // Convert the input tag to match the enum keys
  const tagEnumKey = Object.keys(ItemClassificationTags).find(key => ItemClassificationTags[key as keyof typeof ItemClassificationTags] === tag);
  const tagEnum = tagEnumKey ? ItemClassificationTags[tagEnumKey as keyof typeof ItemClassificationTags] : undefined;

  if (!tagEnum) {
    return null;
  }

  switch (tagEnum) {
    case ItemClassificationTags.NutFree:
      return NutsIcon;
    case ItemClassificationTags.DairyFree:
      return DairyIcon;
    case ItemClassificationTags.Vegetarian:
      return VegetarianIcon;
    case ItemClassificationTags.Chinese:
      return ChineseIcon;
    case ItemClassificationTags.Pizza:
      return PizzaIcon;
    case ItemClassificationTags.Indian:
      return IndianIcon;
    case ItemClassificationTags.Italian:
      return ItalianIcon;
    case ItemClassificationTags.Mexican:
      return MexicanIcon;
    case ItemClassificationTags.Mediterranean:
      return MediterraneanIcon;
    case ItemClassificationTags.Thai:
      return ThaiIcon;
    case ItemClassificationTags.Japanese:
      return JapaneseIcon;
    case ItemClassificationTags.Vietnamese:
      return VietnameseIcon;
    case ItemClassificationTags.Salads:
        return SaladsIcon;
    case ItemClassificationTags.Sandwiches:
        return SandwichIcon;
    case ItemClassificationTags.Bowls:
        return BowlsIcon;
    case ItemClassificationTags.Burgers:
        return BurgersIcon;
    case ItemClassificationTags.All:
      return UtensilsIcon as React.ComponentType<any>;
    default:
      return null;
  }
}