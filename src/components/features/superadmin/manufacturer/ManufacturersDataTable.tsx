import { useEffect } from 'react';
import { errorTransformer } from '@/utils/error';
import { toast } from 'react-toastify';
import { DataTable } from '@/components/reusables/datatable/data-table';
import actionMenuItems from './customizer';
import columns from './columns';
import { useFetchAllManufacturers } from '@/hooks/manufacturerHooks';

const ManufacturersDataTable = () => {
  const { data, isError, error } = useFetchAllManufacturers();
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

export default ManufacturersDataTable;
