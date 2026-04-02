import { Button } from '@/components/ui/button';
import type { Manufacturer, UpdateManufacturerFormInitialValues } from '@/types/types';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import actionMenuItems from './customizer';
import AppModal from '@/components/reusables/modal/AppModal';
import { Formik, type FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { errorTransformer } from '@/utils/error';
import { updateManufacturerValidationSchema } from '@/validations/schemas';
import Spinner from '@/components/reusables/Spinner';
import {
  useFetchAllStoreLocations,
  useFetchSingleManufacturer,
  useUpdateManufacturer,
} from '@/hooks/manufacturerHooks';
import UpdateManufacturerForm from './UpdateManufacturerForm';

const UpdateAction = ({ row, setParentOpen }: { row: Manufacturer; setParentOpen: any }) => {
  const { updateOptions } = actionMenuItems;
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };

  const {
    isError: isSingleFetchError,
    error: singleFetchError,
    data: manufacturerData,
    isLoading: isSingleFetchLoading,
  } = useFetchSingleManufacturer(row.id);

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

  const { mutate: updateManufacturerMutation, isPending } = useUpdateManufacturer();

  const initialValues: UpdateManufacturerFormInitialValues = {
    connection_type: manufacturerData?.connection_type ?? '',
    name: manufacturerData?.name ?? '',
    sftp_host: manufacturerData?.sftp_host ?? '',
    sftp_port: manufacturerData?.sftp_port ?? 0,
    sftp_location: manufacturerData?.sftp_location ?? '',
    sftp_username: manufacturerData?.sftp_username ?? '',
    sftp_auth_type: manufacturerData?.sftp_auth_type ?? 'password',
    // sftp_password: '',
    sftp_password: manufacturerData?.sftp_password ?? '',
    sftp_ssh_key_file: null,
    store_location_id: manufacturerData?.store_location?.id
      ? manufacturerData.store_location.id.toString()
      : '__none',
  };

  const onSubmit = async (
    values: UpdateManufacturerFormInitialValues,
    formik: FormikHelpers<UpdateManufacturerFormInitialValues>
  ) => {
    console.log('values>>>>>', values);
    const connection_type = values.connection_type ? values.connection_type.trim() : '';
    const name = values.name ? values.name.trim() : '';
    const sftp_host = values.sftp_host ? values.sftp_host.trim() : '';
    const sftp_port = values.sftp_port;
    const sftp_location = values.sftp_location ? values.sftp_location.trim() : '';
    const sftp_username = values.sftp_username ? values.sftp_username.trim() : '';
    const sftp_auth_type = values.sftp_auth_type;
    const sftp_password = values.sftp_password ? values.sftp_password.trim() : '';
    const sftp_ssh_key_file = values.sftp_ssh_key_file;
    const store_location_id = values.store_location_id;

    updateManufacturerMutation(
      {
        manufacturerId: row.id,
        manufacturerData: {
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
        sftp_ssh_key_file,
      },
      {
        onSuccess: () => {
          formik.resetForm();
          formik.setSubmitting(false);
          setOpen(false);
          setParentOpen(false);
          toast.success('Manufacturer updated successfully');
        },
        onError: (error) => {
          // formik.resetForm();
          formik.setSubmitting(false);
          const message = errorTransformer(error);
          toast.error(message);
        },
      }
    );
  };

  return (
    <div>
      <Button
        variant="iconButtonGreen"
        size="icon"
        onClick={handleModalOpen}
        className="size-7 sm:size-10"
      >
        <PencilLine className="size-4 sm:size-5" />
      </Button>

      <AppModal
        open={open}
        setOpen={setOpen}
        title={updateOptions?.title}
        description={updateOptions?.description}
        // modalClass="big-modal"
      >
        {isSingleFetchLoading || isStoreLocationFetchLoading ? (
          <div className="itemcenter flex justify-center">
            <Spinner />
          </div>
        ) : isSingleFetchError || isStoreLocationFetchError ? (
          <p>
            Error: {errorTransformer(singleFetchError) || errorTransformer(storeLocationFetchError)}
          </p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={updateManufacturerValidationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            enableReinitialize={true}
          >
            <UpdateManufacturerForm
              isPending={isPending}
              storeLocationOptions={storeLocationOptions}
            />
          </Formik>
        )}
      </AppModal>
    </div>
  );
};

export default UpdateAction;
