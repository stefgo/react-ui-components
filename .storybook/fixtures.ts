/**
 * Sample data for the data-view stories.
 *
 * Lives outside `src/` on purpose: tsup turns every file directly under `src/`
 * into a package entry point, and fixtures have no business being published.
 */

export interface DemoClient {
    id: string;
    hostname: string;
    status: 'online' | 'offline' | 'degraded';
    jobs: number;
    lastSeen: string;
    children?: DemoClient[];
}

export const clients: DemoClient[] = [
    { id: 'c-01', hostname: 'pbs-node-01', status: 'online', jobs: 4, lastSeen: '2 min ago' },
    { id: 'c-02', hostname: 'pbs-node-02', status: 'online', jobs: 2, lastSeen: '5 min ago' },
    { id: 'c-03', hostname: 'web-frontend', status: 'degraded', jobs: 1, lastSeen: '1 h ago' },
    { id: 'c-04', hostname: 'db-primary', status: 'online', jobs: 7, lastSeen: 'just now' },
    { id: 'c-05', hostname: 'db-replica', status: 'offline', jobs: 3, lastSeen: '3 d ago' },
    { id: 'c-06', hostname: 'mail-relay', status: 'online', jobs: 1, lastSeen: '12 min ago' },
    { id: 'c-07', hostname: 'ci-runner-01', status: 'offline', jobs: 0, lastSeen: '2 w ago' },
    { id: 'c-08', hostname: 'ci-runner-02', status: 'online', jobs: 2, lastSeen: '8 min ago' },
    { id: 'c-09', hostname: 'monitoring', status: 'online', jobs: 5, lastSeen: '1 min ago' },
    { id: 'c-10', hostname: 'backup-gw', status: 'degraded', jobs: 2, lastSeen: '40 min ago' },
    { id: 'c-11', hostname: 'staging-app', status: 'online', jobs: 1, lastSeen: '20 min ago' },
    { id: 'c-12', hostname: 'staging-db', status: 'offline', jobs: 0, lastSeen: '5 d ago' },
];

/** The same set as a two-level tree, for the tree table. */
export const clientTree: DemoClient[] = [
    {
        ...clients[0],
        children: [
            { id: 'c-01-a', hostname: '/etc', status: 'online', jobs: 1, lastSeen: '2 min ago' },
            { id: 'c-01-b', hostname: '/var/lib', status: 'online', jobs: 2, lastSeen: '2 min ago' },
        ],
    },
    {
        ...clients[3],
        children: [
            { id: 'c-04-a', hostname: '/var/lib/postgresql', status: 'online', jobs: 5, lastSeen: 'just now' },
        ],
    },
    clients[4],
    clients[6],
];

export const getChildren = (c: DemoClient) => c.children;
