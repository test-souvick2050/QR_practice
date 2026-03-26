import { useEffect } from 'react';
import { errorTransformer } from '@/utils/error';
import { toast } from 'react-toastify';
import { DataTable } from '@/components/reusables/datatable/data-table';
import actionMenuItems from './customizer';
import columns from './columns';
import { useFetchAllGenieRequests } from '@/hooks/helpTicketHooks';

const StoreManagementDataTable = () => {
  const { data, isError, error } = useFetchAllGenieRequests();
  const content = data ?? [];

  useEffect(() => {
    if (isError) {
      const message = errorTransformer(error);
      toast.error(message);
    }
  }, [isError, error]);

  return (
    <>
      <DataTable columns={columns} data={content} actionMenuItems={actionMenuItems} />
    </>
  );
};

export default StoreManagementDataTable;
