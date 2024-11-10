import { OrderTotal } from "..";

interface MobileOrderTotalCardProps {
    orderTotal: OrderTotal;
}

export const MobileOrderTotalCard: React.FC<MobileOrderTotalCardProps> = ({ orderTotal }) => {
    // Render the order total data in a mobile-friendly way
    // This is just a basic example, modify it to suit your needs
    return (
        <div className='my-2 bg-slate-100 py-4 px-6 rounded-lg flex flex-col justify-start items-start gap-2'>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>Order Total ID: </span>
                <span className='text-sm text-end'>{orderTotal.id}</span>
            </div>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>Delivery Date: </span>
                <span className='text-sm text-end'>{orderTotal.delivery_date ? new Date(orderTotal.delivery_date).toLocaleDateString() : ''}</span>
            </div>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>Total: </span>
                <span>${orderTotal.total_before_subsidy?.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>SubTotal: </span>
                <span>${orderTotal.subtotal?.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>Tax Total: </span>
                <span>${orderTotal.tax_total?.toFixed(2)}</span>
            </div>
            {/* Add more fields as needed */}
        </div>
    );
};