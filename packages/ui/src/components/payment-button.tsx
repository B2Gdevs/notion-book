import React from 'react';
import { Button} from './ui/button';

interface ButtonProps {
  label: string;
  amount?: number;
  onClick?: () => void;
  className?: string;
  type?: 'submit' | 'button' | 'reset' | undefined;
  disabled?: boolean;
}

export const PaymentButton: React.FC<ButtonProps> = ({
  label,
  amount,
  onClick,
  className,
  type,
  disabled,
}) => {
  return (
    <Button
      className={`w-64 h-12 px-5 py-3.5 bg-primary-spinach-green rounded justify-center items-end gap-1 inline-flex ${
        className || ''
      }`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <div>
        <span className="text-primary-off-white font-righteous">
          {label} {(amount || amount === 0) && '- '}
        </span>
        {(amount || amount === 0) && (
          <span className="text-secondary-peach-orange font-righteous">
            ${amount.toFixed(2)}
          </span>
        )}
      </div>
    </Button>
  );
};
