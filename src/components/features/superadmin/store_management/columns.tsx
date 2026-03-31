import { DataTableColumnHeader } from '@/components/reusables/datatable/data-table-column-header';
import { capitalize, fullSubdomain } from '@/utils/strings';
import type { ColumnDef } from '@tanstack/react-table';
import ViewAction from './ViewAction';
import { Chip } from '@/components/reusables/dashboard/Chip';

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Store Name" />,
    cell: ({ row }) => (
      <ViewAction row={row.original} text={row.getValue('name') ? row.getValue('name') : '----'} />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div>{row.getValue('email') ? row.getValue('email') : '----'}</div>,
    enableSorting: false,
  },
  {
    id: 'Phone Number',
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone Number" />,
    cell: ({ row }) => (
      <div>{row.getValue('Phone Number') ? row.getValue('Phone Number') : '----'}</div>
    ),
    enableSorting: false,
  },
  {
    id: 'Owner name',
    accessorFn: (row) => row.store_owner?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner Name" />,
    cell: ({ row }) => (
      <div>
        {row.original.store_owner.name ? (
          <Chip label={row.original.store_owner.name} variant="info" />
        ) : (
          '----'
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'subdomain',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subdomain" />,
    cell: ({ row }) => (
      <div>
        {row.getValue('subdomain') ? (
          <Chip label={fullSubdomain(row.getValue('subdomain'))} />
        ) : (
          '----'
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'Address',
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    cell: ({ row }) => <div>{row.getValue('Address') ? row.getValue('Address') : '----'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const variant = row.getValue('status') === 'active' ? 'active' : 'danger';
      return (
        <div>
          {row.getValue('status') ? (
            <Chip label={capitalize(row.getValue('status'))} variant={variant} />
          ) : (
            '----'
          )}
        </div>
      );
    },
    enableSorting: false,
  },
];

export default columns;
