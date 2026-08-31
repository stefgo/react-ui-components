import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaginationControls, PaginationControlsProps } from './PaginationControls';

const meta = {
    title: 'Data/PaginationControls',
    component: PaginationControls,
    args: {
        page: 2,
        totalPages: 7,
        pageSize: 10,
        totalItems: 68,
        onPageChange: () => {},
        onPageSizeChange: () => {},
    },
} satisfies Meta<typeof PaginationControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FirstPage: Story = { args: { page: 1 } };
export const LastPage: Story = { args: { page: 7 } };
export const SinglePage: Story = { args: { page: 1, totalPages: 1, totalItems: 4 } };

/** Server-side paging where the backend cannot give a total. */
export const UnknownTotal: Story = { args: { totalPages: -1, totalItems: -1 } };

// A real component, not an inline render function: hooks belong in one.
const InteractiveDemo = (args: PaginationControlsProps) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalItems = 68;

    return (
        <PaginationControls
            {...args}
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={Math.ceil(totalItems / pageSize)}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
    );
};

export const Interactive: Story = {
    render: (args) => <InteractiveDemo {...args} />,
};
