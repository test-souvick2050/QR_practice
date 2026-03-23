import type { StoreManagement } from '@/types/types';
import actionMenuItems from './customizer';
import AppConfirmation from '@/components/reusables/confirmation/AppConfirmation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDeleteStore } from '@/hooks/storeManagementHooks';
import { toast } from 'react-toastify';
import { errorTransformer } from '@/utils/error';
import Spinner from '@/components/reusables/Spinner';

const DeleteAction = ({ row }: { row: StoreManagement }) => {
  const { deleteConfirmationOptions } = actionMenuItems;
  const { mutate: deleteStoreMutation, isPending } = useDeleteStore();

  const handleDelete = () => {
    deleteStoreMutation(row.id, {
      onSuccess: () => {
        toast.success('Store deleted successfully');
      },
      onError: (error) => {
        const message = errorTransformer(error);
        toast.error(message);
      },
    });
  };
  if (isPending) {
    return (
      <Button variant="iconButtonRed" size="icon">
        <Spinner classes="fill-destructive!" />
      </Button>
    );
  }

  return (
    <div>
      <AppConfirmation
        trigger={
          <Button variant="iconButtonRed" size="icon" className="size-7 sm:size-10">
            <Trash2 className="size-4 sm:size-5" />
          </Button>
        }
        title={deleteConfirmationOptions?.title}
        description={deleteConfirmationOptions?.description}
        confirmLabel={deleteConfirmationOptions?.confirmLabel}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DeleteAction;
