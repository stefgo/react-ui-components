import { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { FormField, type FormFieldClassNames } from './form/FormField';
import { ICON_SIZE, type IconComponent } from './types';
import { cn } from './utils';

export interface InputClassNames extends FormFieldClassNames {
    input?: string;
    icon?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: ReactNode;
    error?: string;
    icon?: IconComponent;
    fullWidth?: boolean;
    classNames?: InputClassNames;
    ref?: Ref<HTMLInputElement>;
}

export const Input = ({
    label,
    hint,
    error,
    icon: Icon,
    fullWidth = true,
    className = '',
    classNames,
    id,
    ref,
    ...props
}: InputProps) => (
    <FormField
        label={label}
        hint={hint}
        error={error}
        required={props.required}
        fullWidth={fullWidth}
        id={id}
        describedBy={props['aria-describedby']}
        className={className}
        classNames={classNames}
    >
        {(ids) => (
            <>
                {Icon && (
                    <div
                        className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted", classNames?.icon)}
                        aria-hidden="true"
                    >
                        <Icon size={ICON_SIZE.lg} />
                    </div>
                )}
                <input
                    ref={ref}
                    id={ids.id}
                    aria-invalid={ids.invalid}
                    className={cn(
                        "block w-full bg-input-bg border",
                        error ? 'border-error' : 'border-input-border',
                        Icon ? 'pl-10' : 'pl-3',
                        "pr-3 py-2.5 rounded-md text-text-primary placeholder:text-text-muted",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        "transition-all sm:text-sm",
                        classNames?.input
                    )}
                    {...props}
                    aria-describedby={ids.describedBy}
                />
            </>
        )}
    </FormField>
);
