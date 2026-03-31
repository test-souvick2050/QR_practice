import AppModal from '@/components/reusables/modal/AppModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import actionMenuItems from './customizer';
import { useState } from 'react';
import { Formik, type FormikHelpers } from 'formik';
import { createManufacturerValidationSchema } from '@/validations/schemas';
import type { CreateManufacturerFormInitialValues } from '@/types/types';
import { errorTransformer } from '@/utils/error';
import { toast } from 'react-toastify';
import { useCreateManufacturer, useFetchAllStoreLocations } from '@/hooks/manufacturerHooks';
import CreateManufacturerForm from './CreateManufacturerForm';
import Spinner from '@/components/reusables/Spinner';

const CreateAction = () => {
  const { creationOptions } = actionMenuItems;
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  };

  // ? all active store locations fetching
  const {
    isError: isStoreLocationFetchError,
    error: storeLocationFetchError,
    data: storestoreLocations,
    isLoading: isStoreLocationFetchLoading,
  } = useFetchAllStoreLocations();

  let storeLocationOptions = [{ label: 'Select Store Location', value: '__none' }];
  const storeLocations = storestoreLocations?.map((storeLocation) => ({
    label: storeLocation.name,
    value: storeLocation.id.toString(),
  }));

  storeLocationOptions = [...storeLocationOptions, ...(storeLocations || [])];

  const { mutate: createManufacturerMutation, isPending } = useCreateManufacturer();

  const initialValues: CreateManufacturerFormInitialValues = {
    connection_type: '',
    name: '',
    sftp_host: '',
    sftp_port: null,
    sftp_location: '',
    sftp_username: '',
    sftp_auth_type: 'password',
    sftp_password: '',
    sftp_ssh_key_file: null,
    store_location_id: '',
  };

  const onSubmit = async (
    values: CreateManufacturerFormInitialValues,
    formik: FormikHelpers<CreateManufacturerFormInitialValues>
  ) => {
    const connection_type = values.connection_type ? values.connection_type.trim() : '';
    const name = values.name ? values.name.trim() : '';
    const sftp_host = values.sftp_host ? values.sftp_host.trim() : '';
    const sftp_port = values.sftp_port;
    const sftp_location = values.sftp_location ? values.sftp_location.trim() : '';
    const sftp_username = values.sftp_username ? values.sftp_username.trim() : '';
    const sftp_auth_type = values.sftp_auth_type;
    const sftp_password = values.sftp_password ? values.sftp_password.trim() : '';
    // const sftp_ssh_key_file = values.sftp_ssh_key_file;
    const store_location_id = values.store_location_id;

    createManufacturerMutation(
      {
        connection_type,
        name,
        sftp_host,
        sftp_port,
        sftp_location,
        sftp_username,
        sftp_auth_type,
        sftp_password,
        store_location_id,
      },
      {
        onSuccess: () => {
          formik.resetForm();
          formik.setSubmitting(false);
          setOpen(false);
          toast.success('Manufacturer created successfully');
        },
        onError: (error) => {
          formik.setSubmitting(false);
          const message = errorTransformer(error);
          toast.error(message);
        },
      }
    );
  };

  return (
    <div>
      <Button variant="iconButton" onClick={handleModalOpen}>
        <Plus />
        Add Manufacturer
      </Button>

      <AppModal
        open={open}
        setOpen={setOpen}
        title={creationOptions?.title}
        description={creationOptions?.description}
        // modalClass="big-modal"
      >
        {' '}
        {isStoreLocationFetchLoading ? (
          <div className="itemcenter flex justify-center">
            <Spinner />
          </div>
        ) : storeLocationFetchError ? (
          <p>Error: {errorTransformer(isStoreLocationFetchError)}</p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={createManufacturerValidationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
          >
            <CreateManufacturerForm
              isPending={isPending}
              storeLocationOptions={storeLocationOptions}
            />
          </Formik>
        )}
      </AppModal>
    </div>
  );
};

export default CreateAction;
