import { DataTableColumnHeader } from '@/components/reusables/datatable/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import ViewAction from './ViewAction';
import { Chip } from '@/components/reusables/dashboard/Chip';

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <ViewAction row={row.original} text={row.getValue('name') ? row.getValue('name') : '----'} />
    ),
    enableSorting: true,
  },
  {
    id: 'SFTP Host',
    accessorKey: 'sftp_host',
    header: ({ column }) => <DataTableColumnHeader column={column} title="SFTP Host" />,
    cell: ({ row }) => <div>{row.getValue('SFTP Host') ? row.getValue('SFTP Host') : '----'}</div>,
    enableSorting: false,
  },
  {
    id: 'SFTP Port',
    accessorKey: 'sftp_port',
    header: ({ column }) => <DataTableColumnHeader column={column} title="SFTP Port" />,
    cell: ({ row }) => <div>{row.getValue('SFTP Port') ? row.getValue('SFTP Port') : '----'}</div>,
    enableSorting: false,
  },
  {
    id: 'SFTP Username',
    accessorKey: 'sftp_username',
    header: ({ column }) => <DataTableColumnHeader column={column} title="SFTP Username" />,
    cell: ({ row }) => (
      <div>{row.getValue('SFTP Username') ? row.getValue('SFTP Username') : '----'}</div>
    ),
    enableSorting: false,
  },
  {
    id: 'SFTP Location',
    accessorKey: 'sftp_location',
    header: ({ column }) => <DataTableColumnHeader column={column} title="SFTP Location" />,
    cell: ({ row }) => (
      <div>{row.getValue('SFTP Location') ? row.getValue('SFTP Location') : '----'}</div>
    ),
    enableSorting: false,
  },
  {
    id: 'Auth Type',
    accessorKey: 'sftp_auth_type',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Auth Type" />,
    cell: ({ row }) => {
      const value = row.getValue('Auth Type');
      return <div>{value ? (value == 'ssh_key' ? 'SSH Key' : 'Password') : '----'}</div>;
    },
    enableSorting: false,
  },
  {
    id: 'Store Location',
    accessorFn: (row) => row.store_location?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Store Location" />,
    cell: ({ row }) => (
      <div>
        {row.getValue('Store Location') ? <Chip label={row.getValue('Store Location')} /> : '----'}
      </div>
    ),
    enableSorting: false,
  },
];

export default columns;
