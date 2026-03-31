// import { Form, useFormikContext } from 'formik';
// import React, { useEffect, useState } from 'react';
// import FormikInput from '@/components/reusables/formik/FormikInput';
// import FormikSelect from '@/components/reusables/formik/FormikSelect';
// import FormikFileInput from '@/components/reusables/formik/FormikFileInput';
// import { Button } from '@/components/ui/button';
// import type { CreateManufacturerFormInitialValues } from '@/types/types';
// import RowGrid from '@/components/reusables/dashboard/RowGrid';
// import { useTestEDIConnection } from '@/hooks/manufacturerHooks';
// import { toast } from 'react-toastify';

// const CreateManufacturerForm = ({
//   isPending,
//   storeLocationOptions,
// }: {
//   isPending: boolean;
//   storeLocationOptions: { label: any; value: any }[] | undefined;
// }) => {
//   const { isSubmitting, values, setFieldValue, isValid } =
//     useFormikContext<CreateManufacturerFormInitialValues>();

//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     if (values.sftp_auth_type === 'password') {
//       setFieldValue('sftp_ssh_key_file', null);
//     } else if (values.sftp_auth_type === 'ssh_key') {
//       setFieldValue('sftp_password', '');
//     }
//   }, [values.sftp_auth_type, setFieldValue]);

//   const { mutate: testEDIConnectionMutation, isPending: isTestConnectionPending } =
//     useTestEDIConnection();

//   // * ======== Test Connection Handler ======== *
//   const handleTestConnection = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     e.preventDefault();
//     setIsConnected(false);

//     testEDIConnectionMutation(
//       {
//         ediConnectionData: {
//           host: values.sftp_host ? values.sftp_host.trim() : '',
//           port: Number(values.sftp_port),
//           file_location: values.sftp_location ? values.sftp_location.trim() : '',
//           username: values.sftp_username ? values.sftp_username.trim() : '',
//           auth_type: values.sftp_auth_type == 'ssh_key' ? 'file' : 'password',
//           password: values.sftp_password ? values.sftp_password : '',
//           file: values.sftp_ssh_key_file ? values.sftp_ssh_key_file : null,
//         },
//       },
//       {
//         onSuccess: (testConnection) => {
//           toast.success('Successfully connected to the server.');
//           setIsConnected(testConnection.success);
//         },
//         onError: () => {
//           setIsConnected(false);
//           toast.error('Could not connect to the server. Please check the details.');
//         },
//       }
//     );
//   };

//   return (
//     <Form className="auth-form mt-0">
//       <RowGrid className="gap-y-0">
//         <div className="col">
//           <FormikSelect
//             name="connection_type"
//             label="Connection Type"
//             placeholder="Select the type"
//             required
//             options={[
//               { label: 'FTP', value: 'ftp' },
//               { label: 'SFTP', value: 'sftp' },
//             ]}
//           />
//         </div>

//         <div className="col">
//           <FormikInput
//             type="text"
//             name="name"
//             label="Manufacturer Name"
//             placeholder="Enter the Manufacturer Name"
//             required
//           />
//         </div>

//         <div className="col">
//           <FormikInput
//             type="text"
//             name="sftp_host"
//             label="Host"
//             placeholder="Enter the Host"
//             required
//           />
//         </div>

//         <div className="col">
//           <FormikInput
//             type="number"
//             name="sftp_port"
//             label="Port"
//             placeholder="Enter the Port"
//             required
//           />
//         </div>

//         <div className="col">
//           <FormikInput
//             type="text"
//             name="sftp_location"
//             label="File Location"
//             placeholder="Enter the File Location"
//             required
//           />
//         </div>

//         <div className="col">
//           <FormikInput
//             type="text"
//             name="sftp_username"
//             label="Username"
//             placeholder="Enter the Username"
//             required
//           />
//         </div>

//         <div className="col">
//           <FormikSelect
//             name="sftp_auth_type"
//             label="Auth Type"
//             placeholder="Select the type"
//             required
//             options={[
//               { label: 'Password', value: 'password' },
//               { label: 'SSH Key', value: 'ssh_key' },
//             ]}
//           />
//         </div>

//         <div className="col">
//           {values.sftp_auth_type === 'password' ? (
//             <FormikInput
//               type="password"
//               name="sftp_password"
//               label="Password"
//               placeholder="Enter the Password"
//               required
//               hasEyeIcon
//             />
//           ) : (
//             <FormikFileInput
//               name="sftp_ssh_key_file"
//               label="SFTP SSH Key File"
//               accept=""
//               required
//             />
//           )}
//         </div>

//         <div className="col">
//           <FormikSelect
//             name="store_location_id"
//             label="Store Store Location"
//             placeholder="Select Store Location"
//             options={storeLocationOptions}
//           />
//         </div>

//         {values.connection_type && isValid && (
//           <div className="col mt-8">
//             <Button onClick={handleTestConnection} disabled={isTestConnectionPending}>
//               {isTestConnectionPending ? 'Pinging to Server...' : 'Test Connection'}
//             </Button>
//           </div>
//         )}
//       </RowGrid>

//       <div className="button-wrap flex justify-center text-center">
//         <Button
//           type="submit"
//           disabled={!isConnected || isSubmitting || isPending}
//           className="block"
//         >
//           {isSubmitting || isPending ? 'Adding...' : 'Add Manufacturer'}
//         </Button>
//       </div>
//     </Form>
//   );
// };

// export default CreateManufacturerForm;

import { Form, useFormikContext } from 'formik';
import { useEffect } from 'react';
import FormikInput from '@/components/reusables/formik/FormikInput';
import FormikSelect from '@/components/reusables/formik/FormikSelect';
import { Button } from '@/components/ui/button';
import type { CreateManufacturerFormInitialValues } from '@/types/types';
import RowGrid from '@/components/reusables/dashboard/RowGrid';

const CreateManufacturerForm = ({
  isPending,
  storeLocationOptions,
}: {
  isPending: boolean;
  storeLocationOptions: { label: any; value: any }[] | undefined;
}) => {
  const { isSubmitting, values, setFieldValue } =
    useFormikContext<CreateManufacturerFormInitialValues>();

  useEffect(() => {
    if (values.sftp_auth_type === 'password') {
      setFieldValue('sftp_ssh_key_file', null);
    } else if (values.sftp_auth_type === 'ssh_key') {
      setFieldValue('sftp_password', '');
    }
  }, [values.sftp_auth_type, setFieldValue]);

  return (
    <Form className="auth-form mt-0">
      <RowGrid className="gap-y-0">
        <div className="col">
          <FormikSelect
            name="connection_type"
            label="Connection Type"
            placeholder="Select the type"
            required
            options={[
              { label: 'FTP', value: 'ftp' },
              { label: 'SFTP', value: 'sftp' },
            ]}
          />
        </div>

        <div className="col">
          <FormikInput
            type="text"
            name="name"
            label="Manufacturer Name"
            placeholder="Enter the Manufacturer Name"
            required
          />
        </div>

        <div className="col">
          <FormikInput
            type="text"
            name="sftp_host"
            label="Host"
            placeholder="Enter the Host"
            required
          />
        </div>

        <div className="col">
          <FormikInput
            type="number"
            name="sftp_port"
            label="Port"
            placeholder="Enter the Port"
            required
          />
        </div>

        <div className="col">
          <FormikInput
            type="text"
            name="sftp_location"
            label="File Location"
            placeholder="Enter the File Location"
            required
          />
        </div>

        <div className="col">
          <FormikInput
            type="text"
            name="sftp_username"
            label="Username"
            placeholder="Enter the Username"
            required
          />
        </div>

        <div className="col">
          <FormikSelect
            name="sftp_auth_type"
            label="Auth Type"
            placeholder="Select the type"
            required
            options={[
              { label: 'Password', value: 'password' },
              { label: 'SSH Key', value: 'ssh_key' },
            ]}
          />
        </div>

        <div className="col">
          <FormikInput
            type="password"
            name="sftp_password"
            label="Password"
            placeholder="Enter the Password"
            required
            hasEyeIcon
          />
        </div>

        <div className="col">
          <FormikSelect
            name="store_location_id"
            label="Store Location"
            placeholder="Select Store Location"
            options={storeLocationOptions}
          />
        </div>
      </RowGrid>

      <div className="button-wrap flex justify-center text-center">
        <Button type="submit" disabled={isSubmitting || isPending} className="block">
          {isSubmitting || isPending ? 'Adding...' : 'Add Manufacturer'}
        </Button>
      </div>
    </Form>
  );
};

export default CreateManufacturerForm;
