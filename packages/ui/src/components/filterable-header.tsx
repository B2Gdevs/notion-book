import React from 'react';
import { DataTableColumnHeader } from './datatable-column-header';
import { Column } from '@tanstack/react-table'; // Import the Column type from @tanstack/react-table
import { Input } from './ui/input';

interface FilterableHeaderProps {
    id: string;
    title: string;
    setFilters?: (updater: (old: any[]) => any[]) => void;
    column: Column<any, any>; // Adjust the type here based on your actual data type
}

const FilterableHeader: React.FC<FilterableHeaderProps> = ({ id, title, setFilters, column }) => {
    return (
        <div className="flex flex-col">
            <DataTableColumnHeader column={column} title={title} />
            {setFilters && (
                <Input
                    type="text"
                    onChange={(e) => 
                        setFilters((old) => [
                            ...old.filter((f) => f.id !== id),
                            { id, value: e.target.value },
                        ])
                    }
                    placeholder={`Search ${title}`}
                    className="my-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            )}
        </div>
    );
};

export default FilterableHeader;