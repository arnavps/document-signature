import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    'card',
                    !hover && 'hover:shadow-soft',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
