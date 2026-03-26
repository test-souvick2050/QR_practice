import { Button } from '@/components/ui/button';
import type { UpdateStoreOwnerFormInitialValues, StoreOwner } from '@/types/types';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import actionMenuItems from './customizer';
import AppModal from '@/components/reusables/modal/AppModal';
import { Form, Formik, type FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { errorTransformer } from '@/utils/error';
import { updateStoreOwnerValidationSchema } from '@/validations/schemas';
import FormikInput from '@/components/reusables/formik/FormikInput';
import FormikSelect from '@/components/reusables/formik/FormikSelect';
import Spinner from '@/components/reusables/Spinner';
import { useFetchSingleOwner, useUpdateOwner } from '@/hooks/storeOwnerHooks';
import RowGrid from '@/components/reusables/dashboard/RowGrid';
import FormikAddressAutocomplete from '@/components/reusables/formik/FormikAddressAutocomplete';
import FormikPhoneInput from '@/components/reusables/formik/FormikPhoneInput';

const UpdateAction = ({ row, setParentOpen }: { row: StoreOwner; setParentOpen: any }) => {
  // console.log('ROW-------', row);
  const { updateOptions } = actionMenuItems;
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };

  // ? Store Owner Details Fetching
  const {
    isError: isSingleFetchError,
    error: singleFetchError,
    data: storeOwnerData,
    isLoading: isSingleFetchLoading,
  } = useFetchSingleOwner(row.id);

  const { mutate: updateStoreOwnerMutation, isPending } = useUpdateOwner();

  const initialValues: UpdateStoreOwnerFormInitialValues = {
    name: storeOwnerData?.name ?? '',
    email: storeOwnerData?.email ?? '',
    phone: storeOwnerData?.phone ?? '',
    status: storeOwnerData?.status,
    address: storeOwnerData?.address ?? '',
    street: storeOwnerData?.street ?? '',
    city: storeOwnerData?.city ?? '',
    state: storeOwnerData?.state ?? '',
    state_code: storeOwnerData?.state_code ?? '',
    country: storeOwnerData?.country ?? '',
    country_code: storeOwnerData?.country_code ?? '',
    zip: storeOwnerData?.zip ?? '',
    lat: storeOwnerData?.lat ?? '',
    lng: storeOwnerData?.lng ?? '',
  };

  const onSubmit = async (
    values: UpdateStoreOwnerFormInitialValues,
    formik: FormikHelpers<UpdateStoreOwnerFormInitialValues>
  ) => {
    const name = values.name ? values.name.trim() : '';
    const email = values.name ? values.email.trim() : '';
    const phone = values.phone;
    const status = values.status ? values.status : 'active';
    const address = values.address ? values.address.trim() : '';
    const street = values.street ? values.street.trim() : '';
    const city = values.city ? values.city.trim() : '';
    const state = values.state ? values.state.trim() : '';
    const state_code = values.state_code ? values.state_code.trim() : '';
    const country = values.country ? values.country.trim() : '';
    const country_code = values.country_code ? values.country_code.trim() : '';
    const zip = values.zip ? values.zip.trim() : '';
    const lat = values.lat;
    const lng = values.lng;

    updateStoreOwnerMutation(
      {
        userId: row.id,
        name,
        email,
        phone,
        status,
        address,
        street,
        city,
        state,
        state_code,
        country,
        country_code,
        zip,
        lat,
        lng,
      },
      {
        onSuccess: () => {
          formik.resetForm();
          formik.setSubmitting(false);
          setOpen(false);
          setParentOpen(false);
          toast.success('User updated successfully');
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
        modalClass="big-modal"
      >
        {isSingleFetchLoading ? (
          <div className="itemcenter flex justify-center">
            <Spinner />
          </div>
        ) : isSingleFetchError ? (
          <p>Error: {errorTransformer(singleFetchError)}</p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={updateStoreOwnerValidationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            enableReinitialize={true}
          >
            {(formik) => {
              const { isSubmitting } = formik;

              return (
                <Form className="auth-form mt-0">
                  <RowGrid cols="grid-cols-1 md:grid-cols-2" className="gap-y-0">
                    <div className="col">
                      <FormikInput
                        type="text"
                        name="name"
                        label="Name"
                        placeholder="Enter the Name"
                        required
                      />
                    </div>

                    <div className="col">
                      <FormikInput
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="Enter the Email"
                        required
                      />
                    </div>

                    <div className="col">
                      <FormikPhoneInput
                        name="phone"
                        label="Phone Number"
                        placeholder="Enter the Phone Number"
                        required
                      />
                    </div>

                    <div className="col relative">
                      {typeof window !== 'undefined' && window.google?.maps?.places && (
                        <FormikAddressAutocomplete
                          name="address"
                          placeholder="Enter the Address"
                          required
                        />
                      )}
                    </div>

                    <div className="col">
                      <FormikInput
                        type="text"
                        name="street"
                        label="Street"
                        placeholder="Enter the Street"
                      />
                    </div>

                    <div className="col">
                      <FormikInput
                        type="text"
                        name="city"
                        label="City"
                        placeholder="Enter the City"
                      />
                    </div>

                    <div className="col">
                      <FormikInput
                        type="text"
                        name="state"
                        label="State"
                        placeholder="Enter the State"
                      />
                    </div>

                    <div className="col">
                      <FormikInput
                        type="text"
                        name="country"
                        label="Country"
                        placeholder="Enter the Country"
                      />
                    </div>

                    <div className="col">
                      <FormikInput type="text" name="zip" label="Zip" placeholder="Enter the zip" />
                    </div>

                    <div className="col">
                      <FormikSelect
                        name="status"
                        label="Status"
                        placeholder="Select status"
                        required
                        options={[
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' },
                        ]}
                      />
                    </div>
                  </RowGrid>

                  <div className="button-wrap flex justify-center text-center">
                    <Button type="submit" disabled={isSubmitting || isPending} className="block">
                      {isSubmitting || isPending ? 'Updating..' : 'Update Owner'}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </AppModal>
    </div>
  );
};

export default UpdateAction;
