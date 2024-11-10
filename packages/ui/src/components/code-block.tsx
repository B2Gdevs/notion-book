import React from 'react';
import { cn } from '..';

interface CodeBlockProps {
    children: React.ReactNode;
    className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
    return (
        <span className={cn(`font-mono bg-gray-200 p-1 rounded text-sm`, className)} >
            {children}
        </span>
    );
};