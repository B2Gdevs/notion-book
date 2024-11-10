import React from 'react';
import { Package, StoreIcon } from "lucide-react";
import { MetricsBar } from './metrics-bar';

interface MenusMetricBarProps {
    menus: Record<string, any>;
    categories: Record<string, any>;
    modifierGroups: Record<string, any>;
    items: Record<string, any>;
    photos: Record<string, any>;
}

export const MenusMetricBar: React.FC<MenusMetricBarProps> = ({ menus, categories, modifierGroups, items }) => {
    const metrics = [
        { icon: StoreIcon, count: Object.values(menus).length, label: 'Menus' },
        { icon: Package, count: Object.values(categories).length, label: 'Categories' },
        { icon: Package, count: Object.values(modifierGroups).length, label: 'ModifierGroups' },
        { icon: Package, count: Object.values(items).length, label: 'MenuItems' },
        { icon: Package, count: Object.values(items).length, label: 'Photos' },
    ];

    return <MetricsBar metrics={metrics} />;
};