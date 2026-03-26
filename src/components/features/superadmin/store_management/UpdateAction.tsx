// import AppModal from '@/components/reusables/modal/AppModal';
// import { Button } from '@/components/ui/button';
// import { PencilLine } from 'lucide-react';
// import actionMenuItems from './customizer';
// import { useState } from 'react';
// import { Formik } from 'formik';
// import FormikInput from '@/components/reusables/formik/FormikInput';
// import { Form } from 'react-router';
// import RowGrid from '@/components/reusables/dashboard/RowGrid';
// import FormikPhoneInput from '@/components/reusables/formik/FormikPhoneInput';
// import FormikAddressAutocomplete from '@/components/reusables/formik/FormikAddressAutocomplete';
// import FormikSelect from '@/components/reusables/formik/FormikSelect';
// import { useFetchSingleStore } from '@/hooks/storeManagementHooks';
// import type { StoreManagement } from '@/types/types';

// const UpdateAction = ({ row, setParentOpen }: { row: StoreManagement; setParentOpen: any }) => {
//   const { updateOptions } = actionMenuItems;
//   const [open, setOpen] = useState(false);
//   const handleModalOpen = () => {
//     setOpen(true);
//   };

//   const {
//     isError: isSingleFetchError,
//     error: singleFetchError,
//     data: storeData,
//     isLoading: isSingleFetchLoading,
//   } = useFetchSingleStore(row.id);

//   console.log('');

//   return (
//     <div>
//       {/* app model */}
//       <AppModal
//         open={open}
//         setOpen={setOpen}
//         title={updateOptions?.title}
//         description={updateOptions?.description}
//         modalClass="big-modal"
//       >
//         <Formik
//           // initialValues={initialValues}
//           // validationSchema={updateStoreValidationSchema}
//           // onSubmit={onSubmit}
//           validateOnChange={false}
//         >
//           {(formik) => {
//             const { isSubmitting } = formik;

//             return (
//               <Form className="auth-form mt-0">
//                 <RowGrid cols="grid-cols-12" className="gap-y-0">
//                   <div className="col-span-12 md:col-span-6">
//                     {/* <FormikInput
//                     /> */}
//                     <FormikInput
//                       type="text"
//                       name="name"
//                       label="Store Name"
//                       placeholder="Enter Store Name"
//                       required
//                     />
//                   </div>

//                   <div className="col-span-12 md:col-span-6">
//                     <FormikInput
//                       type="text"
//                       name="email"
//                       label="Store Email"
//                       placeholder="Enter Store Email"
//                       required
//                     />
//                   </div>

//                   <div className="col-span-12 md:col-span-6">
//                     <FormikPhoneInput
//                       name="phone"
//                       label="Store Phone Number"
//                       placeholder="Enter the Store Phone Number"
//                       required
//                     />
//                   </div>

//                   <div className="relative col-span-12 md:col-span-6">
//                     {typeof window !== 'undefined' && window.google?.maps?.places && (
//                       <FormikAddressAutocomplete
//                         name="address"
//                         placeholder="Enter the Address"
//                         required
//                       />
//                     )}
//                   </div>

//                   <div className="col-span-6">
//                     <FormikInput
//                       type="text"
//                       name="street"
//                       label="Street"
//                       placeholder="Enter the Street"
//                     />
//                   </div>

//                   <div className="col-span-6">
//                     <FormikInput
//                       type="text"
//                       name="city"
//                       label="City"
//                       placeholder="Enter the City"
//                     />
//                   </div>

//                   <div className="col-span-6">
//                     <FormikInput
//                       type="text"
//                       name="state"
//                       label="State"
//                       placeholder="Enter the State"
//                     />
//                   </div>

//                   <div className="col-span-6">
//                     <FormikInput
//                       type="text"
//                       name="country"
//                       label="Country"
//                       placeholder="Enter the Country"
//                     />
//                   </div>

//                   <div className="col-span-6">
//                     <FormikInput type="text" name="zip" label="Zip" placeholder="Enter the zip" />
//                   </div>

//                   <div className="col-span-12 md:col-span-6">
//                     <FormikSelect
//                       name="store_owner_id"
//                       label="Store Owner"
//                       placeholder="Select the owner"
//                       // options={ownerOptions}
//                       required
//                     />
//                   </div>

//                   <div className="col-span-12 md:col-span-6">
//                     <FormikInput
//                       type="text"
//                       name="subdomain"
//                       label="Sub-domain"
//                       placeholder="Enter sub-domain"
//                       required
//                     />
//                     <p className="text-info text-warning font-semibold">
//                       Only put the <b>subdomain name</b>, the rest will be added automatically. E.g{' '}
//                       <b>mystore</b> will become{' '}
//                       <b>
//                         mystore.
//                         {import.meta.env.VITE_MAIN_DOMAIN ?? 'fake.domain.com'}
//                       </b>
//                     </p>
//                   </div>

//                   <div className="col-span-6">
//                     <FormikSelect
//                       name="status"
//                       label="Status"
//                       placeholder="Select status"
//                       required
//                       options={[
//                         { label: 'Active', value: 'active' },
//                         { label: 'Inactive', value: 'inactive' },
//                       ]}
//                     />
//                   </div>
//                 </RowGrid>

//                 <div className="button-wrap flex justify-center text-center">
//                   <Button type="submit" disabled={isSubmitting || isPending} className="min-btn">
//                     {isSubmitting || isPending ? 'Updating...' : 'Update Store'}
//                   </Button>
//                 </div>
//               </Form>
//             );
//           }}
//         </Formik>
//       </AppModal>
//       <Button
//         variant="iconButtonGreen"
//         size="icon"
//         onClick={handleModalOpen}
//         className="size-7 sm:size-10"
//       >
//         <PencilLine className="size-4 sm:size-5" />
//       </Button>
//     </div>
//   );
// };

// export default UpdateAction;

// UPDATE STORE.
import { Button } from '@/components/ui/button';
import type { StoreManagement, UpdateStoreFormInitialValues } from '@/types/types';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import actionMenuItems from './customizer';
import AppModal from '@/components/reusables/modal/AppModal';
import { Form, Formik, type FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { errorTransformer } from '@/utils/error';
import { updateStoreValidationSchema } from '@/validations/schemas';
import FormikInput from '@/components/reusables/formik/FormikInput';
import Spinner from '@/components/reusables/Spinner';
import RowGrid from '@/components/reusables/dashboard/RowGrid';
import {
  useFetchSingleStore,
  useActiveStoreOwners,
  useUpdateStore,
} from '@/hooks/storeManagementHooks';
import FormikSelect from '@/components/reusables/formik/FormikSelect';
import FormikPhoneInput from '@/components/reusables/formik/FormikPhoneInput';
import FormikAddressAutocomplete from '@/components/reusables/formik/FormikAddressAutocomplete';

const UpdateAction = ({ row, setParentOpen }: { row: StoreManagement; setParentOpen: any }) => {
  const { updateOptions } = actionMenuItems;
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };

  //  FETCH SINGLE DATA BEFOR EDITING
  const {
    isError: isSingleFetchError,
    error: singleFetchError,
    data: storeData,
    isLoading: isSingleFetchLoading,
  } = useFetchSingleStore(row.id);

  // console.log('storeData+++', storeData);

  // ACTIVE VENDOR
  const {
    isError: isOwnerFetchError,
    error: ownerFetchError,
    data: activeStoreOwners,
    isLoading: isOwnerFetchLoading,
  } = useActiveStoreOwners();
  // console.log('activeStoreOwners+++', activeStoreOwners);

  const ownerOptions = activeStoreOwners?.map((owner) => ({
    label: owner.name,
    value: owner.store_owner_id.toString(),
  }));

  const { mutate: updateStoreMutation, isPending } = useUpdateStore();

  const initialValues: UpdateStoreFormInitialValues = {
    name: storeData?.name ?? '',
    email: storeData?.email ?? '',
    phone: storeData?.phone ?? '',
    status: storeData?.status ?? 'active',
    subdomain: storeData?.subdomain ?? '',
    store_owner_id: storeData?.store_owner_id ?? '',
    address: storeData?.address ?? '',
    street: storeData?.street ?? '',
    city: storeData?.city ?? '',
    state: storeData?.state ?? '',
    country: storeData?.country ?? '',
    zip: storeData?.zip ?? '',
    lat: storeData?.lat ?? '',
    lng: storeData?.lng ?? '',
    state_code: storeData?.state_code ?? '',
    country_code: storeData?.country_code ?? '',
  };

  const onSubmit = async (
    values: UpdateStoreFormInitialValues,
    formik: FormikHelpers<UpdateStoreFormInitialValues>
  ) => {
    const name = values.name ? values.name.trim() : '';
    const email = values.email ? values.email.trim() : '';
    const phone = values.phone;
    const subdomain = values.subdomain;
    const status = values.status ? values.status : 'active';
    const store_owner_id = values.store_owner_id ? values.store_owner_id.trim() : '';
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

    updateStoreMutation(
      {
        storeId: row.id,
        name,
        email,
        phone,
        status,
        subdomain,
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
          setParentOpen(false);
          toast.success('Store updated successfully');
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
        {isSingleFetchLoading || isOwnerFetchLoading ? (
          <div className="itemcenter flex justify-center">
            <Spinner />
          </div>
        ) : isSingleFetchError || isOwnerFetchError ? (
          <p>Error: {errorTransformer(singleFetchError) || errorTransformer(ownerFetchError)}</p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={updateStoreValidationSchema}
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
                        placeholder="Enter the Store Phone Number"
                        required
                      />
                    </div>

                    <div className="relative col-span-12 md:col-span-6">
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
                        placeholder="Enter sub-domain"
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

                    <div className="col-span-6">
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
                      {isSubmitting || isPending ? 'Updating...' : 'Update Store'}
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
