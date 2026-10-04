import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
    it('interrupts for an error', () => {
        render(<Alert title="Could not load the users">Connection refused</Alert>);

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Could not load the users');
        expect(alert).toHaveTextContent('Connection refused');
    });

    it('waits its turn for every other tone', () => {
        // A delivered webhook is not worth cutting a screen reader off for.
        render(<Alert tone="success" title="Delivered (HTTP 200)" />);

        expect(screen.queryByRole('alert')).toBeNull();
        expect(screen.getByRole('status')).toHaveTextContent('Delivered (HTTP 200)');
    });

    it('keeps its icon out of what is read', () => {
        const { container } = render(<Alert tone="warning">Repository is offline</Alert>);
        expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('shows no icon when told so', () => {
        const { container } = render(<Alert icon={null}>Plain</Alert>);
        expect(container.querySelector('svg')).toBeNull();
    });
});
