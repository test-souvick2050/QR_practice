import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import actionMenuItems from './customizer';
import { lazy, useState } from 'react';
import { Form, Formik, type FormikHelpers } from 'formik';
import { createStoreOwnerValidationSchema } from '@/validations/schemas';
import FormikInput from '@/components/reusables/formik/FormikInput';
import type { CreateStoreOwnerFormInitialValues } from '@/types/types';
import { errorTransformer } from '@/utils/error';
import { toast } from 'react-toastify';
import { useCreateOwner } from '@/hooks/storeOwnerHooks';
import RowGrid from '@/components/reusables/dashboard/RowGrid';
import FormikAddressAutocomplete from '@/components/reusables/formik/FormikAddressAutocomplete';
import FormikPhoneInput from '@/components/reusables/formik/FormikPhoneInput';
const AppModal = lazy(() => import('@/components/reusables/modal/AppModal'));

const CreateAction = () => {
  const { creationOptions } = actionMenuItems;
  const [open, setOpen] = useState(false);

  // open the app model.
  const handleModalOpen = () => {
    setOpen(true);
  };

  const { mutate: createStoreOwnerMutation, isPending } = useCreateOwner();

  const initialValues: CreateStoreOwnerFormInitialValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    street: '',
    city: '',
    state: '',
    state_code: '',
    country: '',
    country_code: '',
    zip: '',
    lat: '',
    lng: '',
  };

  const onSubmit = async (
    values: CreateStoreOwnerFormInitialValues,
    formik: FormikHelpers<CreateStoreOwnerFormInitialValues>
  ) => {
    const name = values.name ? values.name.trim() : '';
    const email = values.email ? values.email.trim() : '';
    const phone = values.phone;
    const status = 'active';
    const address = values.address ? values.address.trim() : '';
    const street = values.street ? values.street.trim() : '';
    const city = values.city ? values.city.trim() : '';
    const state = values.state ? values.state.trim() : '';
    const state_code = values.state_code ? values.state_code.trim() : '';
    const country_code = values.country_code ? values.country_code.trim() : '';
    const country = values.country ? values.country.trim() : '';
    const zip = values.zip ? values.zip.trim() : '';
    const lat = values.lat;
    const lng = values.lng;

    createStoreOwnerMutation(
      {
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
          toast.success('Store Owner created successfully');
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
        Add Owner
      </Button>

      <AppModal
        open={open}
        setOpen={setOpen}
        title={creationOptions?.title}
        description={creationOptions?.description}
        // modalClass="big-modal"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={createStoreOwnerValidationSchema}
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
                </RowGrid>

                <div className="button-wrap flex justify-center text-center">
                  <Button type="submit" disabled={isSubmitting || isPending} className="block">
                    {isSubmitting || isPending ? 'Adding...' : 'Add Owner'}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </AppModal>
    </div>
  );
};

export default CreateAction;
