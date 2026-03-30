import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AppModal from '@/components/reusables/modal/AppModal';
import Spinner from '@/components/reusables/Spinner';

import actionMenuItems from './customizer';
import { Chip } from '@/components/reusables/dashboard/Chip';
import {
  useDecryptManufacturerPasswordMutation,
  useFetchSingleManufacturer,
} from '@/hooks/manufacturerHooks';
// import DeleteAction from './DeleteAction';
// import UpdateAction from './UpdateAction';

const ViewAction = ({ row, text }: { row: any; text?: string }) => {
  const { viewOptions } = actionMenuItems;
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    data: manufacturerData,
    isLoading: isManufacturerLoading,
    error: manufacturerError,
  } = useFetchSingleManufacturer(row.id);

  const {
    mutate: decryptPassword,
    data: decryptedPassword,
    isPending: isDecrypting,
    error: decryptError,
  } = useDecryptManufacturerPasswordMutation();

  const handleModalOpen = () => {
    setOpen(true);
    setShowPassword(false);
  };

  const handleRevealPassword = () => {
    if (!showPassword) {
      decryptPassword(row.id);
    }
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      {text ? (
        <p className="text-primary cursor-pointer font-semibold" onClick={handleModalOpen}>
          {text}
        </p>
      ) : (
        <Button variant="iconButtonOrange" size="icon" onClick={handleModalOpen}>
          <Eye />
        </Button>
      )}

      <AppModal
        open={open}
        setOpen={setOpen}
        title={viewOptions?.title}
        description={viewOptions?.description}
        modalClass="small-modal"
      >
        <>
          <div className="absolute top-5 right-11 flex items-center justify-end gap-2 sm:top-3 sm:right-15">
            {/* <DeleteAction row={row} />
            <UpdateAction row={row} setParentOpen={setOpen} /> */}
          </div>

          {isManufacturerLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : manufacturerError ? (
            <p className="text-red-500">Error loading data</p>
          ) : (
            <div className="details-wrap">
              <section className="space-y-3">
                <RenderRow
                  label="Connection Type"
                  value={manufacturerData?.connection_type?.toUpperCase()}
                />
                <RenderRow label="Manufacturer Name" value={manufacturerData?.name} />
                <RenderRow label="Host" value={manufacturerData?.sftp_host} />
                <RenderRow label="Port" value={manufacturerData?.sftp_port} />
                <RenderRow label="File Location" value={manufacturerData?.sftp_location} />
                <RenderRow label="Username" value={manufacturerData?.sftp_username} />
                <RenderRow
                  label="Auth Type"
                  value={manufacturerData?.sftp_auth_type === 'password' ? 'Password' : 'SSH Key'}
                />
                <RenderRow
                  label="Store Location"
                  value={
                    <>
                      <Chip label={manufacturerData?.store_location?.name ?? '----'} />
                    </>
                  }
                />

                {manufacturerData?.sftp_password ? (
                  <div className="flex items-center justify-between">
                    <p className="w-1/2 text-gray-600">SFTP Password:</p>
                    <div className="flex w-2/4 items-center justify-end space-x-2">
                      {isDecrypting ? (
                        <p className="text-xs">Fetching...</p>
                      ) : decryptError ? (
                        <p className="text-sm text-red-500">Error</p>
                      ) : showPassword && decryptedPassword ? (
                        <p className="font-semibold">{decryptedPassword}</p>
                      ) : (
                        <p className="font-semibold">••••••••••</p>
                      )}

                      {manufacturerData?.sftp_password && (
                        <button
                          type="button"
                          className="text-primary flex cursor-pointer items-center space-x-1 text-sm font-medium hover:underline"
                          onClick={handleRevealPassword}
                        >
                          {showPassword && decryptedPassword ? (
                            <>
                              <span>Hide</span>
                              <EyeOff size={18} />
                            </>
                          ) : (
                            <>
                              <span>Reveal</span>
                              <Eye size={18} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <RenderRow
                    label="SFTP SSH Key File URL"
                    value={manufacturerData?.sftp_ssh_key_file_url}
                  />
                )}
              </section>
            </div>
          )}
        </>
      </AppModal>
    </div>
  );
};

const RenderRow = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex items-start justify-between gap-2">
    <p className="w-1/2 text-gray-600">{label}:</p>
    <p className="w-2/4 text-right break-words whitespace-pre-wrap text-black">{value ?? '----'}</p>
  </div>
);

export default ViewAction;
