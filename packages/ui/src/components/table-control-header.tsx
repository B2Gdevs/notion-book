import { Table as TanStackTable } from '@tanstack/react-table';
import { Download } from 'lucide-react'; // Import the download icon
import { FC } from 'react';
import { SearchBar } from './search-component';
import { Button } from './ui/button';

interface TableControlHeaderProps<T> { // Add generic type T
  value: string;
  onChange: (value: string) => void;
  onCreateNew?: () => void;
  tableInstance?: TanStackTable<T>; // Optional table instance for downloading CSV
  enableDownload?: boolean; // Optional flag to enable CSV download
  enableFilter?: boolean; // Optional flag to enable filtering
  downloadCSV?: () => void; // Optional downloadCSV function
}

export const TableControlHeader: FC<TableControlHeaderProps<any>> = ({
  value,
  onChange,
  onCreateNew,
  tableInstance,
  enableDownload,
  enableFilter,
  downloadCSV, // Add onDownload prop
}) => {

  if (!onCreateNew && !enableDownload && !enableFilter) return null;

  return (
    <div className="w-full h-14 p-2 bg-primary-cucumber-green/20 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onCreateNew && (
          <Button
            className='w-36 bg-primary-lime-green text-primary-spinach-green hover:text-secondary-peach-orange font-righteous'
            onClick={onCreateNew}
          >
            Create New
          </Button>
        )}
        {enableDownload && tableInstance && (
          <Button onClick={downloadCSV} className='cursor-pointer'>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        )}
        {enableFilter && (
          <SearchBar value={value} onChange={onChange} className="w-40" />

        )}
      </div>
    </div>
  );
};