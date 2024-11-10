import { ArrowUpRightSquareIcon } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Correct import as per instructions
import React from 'react';

export interface TableIdColumnProps {
  id: string;
  getPath: (id: string) => string; // Function that takes an id and returns the navigation path
}

export const TableIdColumn: React.FC<TableIdColumnProps> = ({ id, getPath }) => {
  const router = useRouter();

  const navigateToDetail = () => {
    const path = getPath(id); // Use the getPath function to determine the navigation path
    router.push(path);
  };

  return (
    <button 
      onClick={navigateToDetail} 
      className='flex justify-between items-center w-full text-left hover:bg-gray-200 cursor-pointer'
    >
      <span className='w-fit relative p-4'>
        {id}
        <ArrowUpRightSquareIcon className='w-4 absolute top-0 right-0' />
      </span>
      
    </button>
  );
};
