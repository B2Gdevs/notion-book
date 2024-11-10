import React from 'react';

interface KpiCardProps {
    title: string;
    value: string | number;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 m-2 border-2 border-black">
            <h3 className="text-xl font-righteous text-black">{title}</h3>
            <p className="text-2xl font-sans text-black mt-2">{value}</p>
        </div>
    );
};