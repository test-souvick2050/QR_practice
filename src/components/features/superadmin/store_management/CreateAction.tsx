import AppModal from '@/components/reusables/modal/AppModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import actionMenuItems from './customizer';
import { useState } from 'react';
import { Form, Formik, type FormikHelpers } from 'formik';
import { createStorValidationSchema } from '@/validations/schemas';
import FormikInput from '@/components/reusables/formik/FormikInput';
import type { CreateStoreFormInitialValues } from '@/types/types';
import { errorTransformer } from '@/utils/error';
import { toast } from 'react-toastify';
import RowGrid from '@/components/reusables/dashboard/RowGrid';
import { useCreateStore, useActiveStoreOwners } from '@/hooks/storeManagementHooks';
import Spinner from '@/components/reusables/Spinner';
import FormikSelect from '@/components/reusables/formik/FormikSelect';
import FormikPhoneInput from '@/components/reusables/formik/FormikPhoneInput';
import FormikAddressAutocomplete from '@/components/reusables/formik/FormikAddressAutocomplete';

const CreateAction = () => {
  const { creationOptions } = actionMenuItems;
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  };

  // ? Active store owners fetching
  const {
    isError: isOwnerFetchError,
    error: ownerFetchError,
    data: activeStoreOwners,
    isLoading: isOwnerFetchLoading,
  } = useActiveStoreOwners();
  console.log('activeStoreOwners', activeStoreOwners);

  const ownerOptions = activeStoreOwners?.map((owner) => ({
    label: owner.name,
    value: owner.store_owner_id.toString(),
  }));
  console.log('ownerOptions+++', ownerOptions);
  const { mutate: createStoreMutation, isPending } = useCreateStore();

  const initialValues: CreateStoreFormInitialValues = {
    name: '',
    email: '',
    phone: '',
    status: 'active',
    subdomain: '',
    store_owner_id: '',
    address: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    lat: '',
    lng: '',
    state_code: '',
    country_code: '',
  };

  const onSubmit = async (
    values: CreateStoreFormInitialValues,
    formik: FormikHelpers<CreateStoreFormInitialValues>
  ) => {
    const name = values.name ? values.name.trim() : '';
    const email = values.email ? values.email.trim() : '';
    const phone = values.phone;
    const subdomain = values.subdomain ? values.subdomain.trim() : '';
    const store_owner_id = values.store_owner_id ? values.store_owner_id.trim() : '';
    const status = values.status ? values.status : 'active';

    const address = values.address ? values.address.trim() : '';
    const street = values.street ? values.street.trim() : '';
    const city = values.city ? values.city.trim() : '';
    const state = values.state ? values.state.trim() : '';
    const country = values.country ? values.country.trim() : '';
    const zip = values.zip ? values.zip.trim() : '';
    const lat = values.lat;
    const lng = values.lng;
    const state_code = values.state_code ? values.state_code.trim() : '';
    const country_code = values.country_code ? values.country_code.trim() : '';

    createStoreMutation(
      {
        name,
        email,
        phone,
        subdomain,
        status,
        store_owner_id,
        address,
        street,
        city,
        state,
        country,
        zip,
        lat,
        lng,
        state_code,
        country_code,
      },
      {
        onSuccess: () => {
          formik.resetForm();
          formik.setSubmitting(false);
          setOpen(false);
          toast.success('Store created successfully');
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
      <Button variant="iconButton" onClick={handleModalOpen}>
        <Plus />
        Add Store
      </Button>

      <AppModal
        open={open}
        setOpen={setOpen}
        title={creationOptions?.title}
        description={creationOptions?.description}
        modalClass="big-modal"
      >
        {isOwnerFetchLoading ? (
          <div className="itemcenter flex justify-center">
            <Spinner />
          </div>
        ) : isOwnerFetchError ? (
          <p>Error: {errorTransformer(ownerFetchError)}</p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={createStorValidationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
          >
            {(formik) => {
              const { isSubmitting } = formik;

              return (
                <Form className="auth-form mt-0">
                  <RowGrid cols="grid-cols-12" className="gap-y-0">
                    <div className="col-span-12 md:col-span-6">
                      <FormikInput
                        type="text"
                        name="name"
                        label="Store Name"
                        placeholder="Enter Store Name"
                        required
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <FormikInput
                        type="text"
                        name="email"
                        label="Store Email"
                        placeholder="Enter Store Email"
                        required
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <FormikPhoneInput
                        name="phone"
                        label="Store Phone Number"
                        placeholder="Enter the Phone Number"
                        required
                      />
                    </div>

                    <div className="relative col-span-6">
                      {typeof window !== 'undefined' && window.google?.maps?.places && (
                        <FormikAddressAutocomplete
                          name="address"
                          placeholder="Enter the Address"
                          required
                        />
                      )}
                    </div>

                    <div className="col-span-6">
                      <FormikInput
                        type="text"
                        name="street"
                        label="Street"
                        placeholder="Enter the Street"
                      />
                    </div>

                    <div className="col-span-6">
                      <FormikInput
                        type="text"
                        name="city"
                        label="City"
                        placeholder="Enter the City"
                      />
                    </div>

                    <div className="col-span-6">
                      <FormikInput
                        type="text"
                        name="state"
                        label="State"
                        placeholder="Enter the State"
                      />
                    </div>

                    <div className="col-span-6">
                      <FormikInput
                        type="text"
                        name="country"
                        label="Country"
                        placeholder="Enter the Country"
                      />
                    </div>

                    <div className="col-span-6">
                      <FormikInput type="text" name="zip" label="Zip" placeholder="Enter the zip" />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <FormikSelect
                        name="store_owner_id"
                        label="Store Owner"
                        placeholder="Select the owner"
                        options={ownerOptions}
                        required
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <FormikInput
                        type="text"
                        name="subdomain"
                        label="Sub-domain"
                        placeholder="E.g.: mystore"
                        required
                      />
                      <p className="text-info text-warning font-semibold">
                        Only put the <b>subdomain name</b>, the rest will be added automatically.
                        E.g <b>mystore</b> will become{' '}
                        <b>
                          mystore.
                          {import.meta.env.VITE_MAIN_DOMAIN ?? 'fake.domain.com'}
                        </b>
                      </p>
                    </div>

                    <div className="col-span-12 md:col-span-6">
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
                    <Button type="submit" disabled={isSubmitting || isPending} className="min-btn">
                      {isSubmitting || isPending ? 'Adding...' : 'Add Store'}
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

export default CreateAction;
