import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginPage } from './LoginPage';

const meta = {
    title: 'Shell/LoginPage',
    component: LoginPage,
    parameters: { layout: 'fullscreen' },
    args: {
        title: 'PBC',
        titleHighlight: 'M',
        subtitle: 'Proxmox Backup Client Manager',
        authType: 'local',
        onLogin: () => {},
        onOidcLogin: () => {},
        theme: 'light',
        onToggleTheme: () => {},
    },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Local: Story = {};
export const Oidc: Story = { args: { authType: 'oidc' } };
export const Loading: Story = { args: { isLoading: true } };
export const WithError: Story = { args: { error: 'Invalid username or password.' } };

/** While the auth method is still unknown. */
export const Undetermined: Story = { args: { authType: null } };
