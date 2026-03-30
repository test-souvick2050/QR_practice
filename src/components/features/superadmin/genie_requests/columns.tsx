import { DataTableColumnHeader } from '@/components/reusables/datatable/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import ViewAction from './ViewAction';

const columns: ColumnDef<any>[] = [
  {
    id: 'Requester Name',
    accessorKey: 'requester_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Requester Name" />,
    cell: ({ row }) => (
      <ViewAction
        row={row.original}
        text={row.getValue('Requester Name') ? row.getValue('Requester Name') : '----'}
      />
    ),
    enableSorting: false,
  },

  // {
  //   id: 'unique_id',
  //   accessorKey: 'unique_id',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Unique ID" />,
  //   cell: ({ row }) => <ViewAction row={row.original} text={row.getValue('unique_id') || '----'} />,
  //   enableSorting: false,
  // },

  {
    id: 'Requester Unique ID',
    accessorFn: (row) => row.requested_by?.unique_id,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Requester Unique ID" />,
    cell: ({ row }) => (
      <div>
        {row.getValue('Requester Unique ID') ? row.getValue('Requester Unique ID') : '----'}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'Requester Email',
    accessorKey: 'requester_email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Requester Email" />,
    cell: ({ row }) => (
      <div>{row.getValue('Requester Email') ? row.getValue('Requester Email') : '----'}</div>
    ),
    enableSorting: false,
  },
  {
    id: 'Store Location',
    accessorKey: 'store_location.name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Store Location" />,
    cell: ({ row }) => (
      <div>{row.getValue('Store Location') ? row.getValue('Store Location') : '----'}</div>
    ),
    enableSorting: false,
  },
  {
    id: 'Message',
    accessorKey: 'message',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
    cell: ({ row }) => (
      <div>
        {row.getValue('Message')
          ? (row.getValue('Message') as string).slice(0, 50) + '...'
          : '----'}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'Submitted At',
    accessorFn: (row) => row.created_at, // raw timestamp string from your data
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted At" />,
    cell: ({ row }) => {
      const rawValue = row.getValue('Submitted At') as string;
      if (!rawValue) return '----';

      // Parse timestamp with timezone
      const date = new Date(rawValue);

      // Format to "14th August, 2025"
      const formattedDate = format(date, 'do MMMM, yyyy hh:mm a');

      return <div>{formattedDate}</div>;
    },
    enableSorting: false,
  },

  // {
  //   id: 'actions',
  //   header: () => <div>Action</div>,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex items-center gap-2">
  //         {showViewButton && <ViewAction row={row.original} />}
  //         {showEditButton && <UpdateAction row={row.original} />}
  //         {showDeleteButton && <DeleteAction row={row.original} />}
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  // },
];

export default columns;
