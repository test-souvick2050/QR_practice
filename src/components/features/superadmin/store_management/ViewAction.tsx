import { Button } from '@/components/ui/button';
import type { StoreManagement } from '@/types/types';
import { Eye } from 'lucide-react';
import { useState, type Key } from 'react';
import actionMenuItems from './customizer';
import AppModal from '@/components/reusables/modal/AppModal';
import { errorTransformer } from '@/utils/error';
import Spinner from '@/components/reusables/Spinner';
import { Chip } from '@/components/reusables/dashboard/Chip';
import { useFetchSingleStore } from '@/hooks/storeManagementHooks';
import { DetailList } from '@/components/reusables/dashboard/ModalList';
import { fullSubdomain } from '@/utils/strings';
import DeleteAction from './DeleteAction';
import UpdateAction from './UpdateAction';

// console.log('appmodel', AppModal);

const ViewAction = ({ row, text }: { row: StoreManagement; text?: string }) => {
  // console.log('text++', text); //name
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };

  const { viewOptions } = actionMenuItems;
  // console.log('viewOptions', viewOptions);

  // fetch the api---
  const {
    isError: isSingleFetchError,
    error: singleFetchError,
    data: storeData,
    isLoading: isSingleFetchLoading,
  } = useFetchSingleStore(row.id);

  // console.log('storeData>>>>', storeData);

  //   const {
  //   isError: isSingleFetchError,
  //   error: singleFetchError,
  //   data: storeData,
  //   isLoading: isSingleFetchLoading,
  // } = useFetchSingleStore(row.id);

  // view the store detais......
  const StoreDetails = [
    { label: 'Store Name:', value: storeData?.name ? storeData.name : '----' },
    { label: 'Email Address:', value: storeData?.email ? storeData.email : '----' },
    { label: 'Phone Number:', value: storeData?.phone ? storeData.phone : '----' },
    {
      label: 'Owner:',
      value: (
        <div className="flex flex-wrap gap-2">
          <Chip
            label={storeData?.store_owner?.name ? storeData?.store_owner?.name : '----'}
            variant="info"
          />
        </div>
      ),
    },
    {
      label: 'Sub-domain:',
      value: (
        <div className="chip-break-all flex flex-wrap gap-2">
          <Chip label={storeData?.subdomain ? fullSubdomain(storeData?.subdomain) : '----'} />
        </div>
      ),
    },
    { label: 'Address:', value: storeData?.address ? storeData.address : '----' },
    { label: 'Street:', value: storeData?.street ? storeData.street : '----' },
    { label: 'City:', value: storeData?.city ? storeData.city : '----' },
    { label: 'State:', value: storeData?.state ? storeData.state : '----' },
    { label: 'Country:', value: storeData?.country ? storeData.country : '----' },
    { label: 'Zip:', value: storeData?.zip ? storeData.zip : '----' },
    {
      label: 'Manufacturers:',
      value: (
        <div className="flex flex-wrap gap-2">
          {storeData?.manufacturers?.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {storeData.manufacturers.map((m: { id: Key | null | undefined; name: string }) => (
                  <div className="flex items-center justify-center" key={m.id}>
                    <Chip label={m.name} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            '----'
          )}
        </div>
      ),
    },
    {
      label: 'Status:',
      value: (
        <div className="flex flex-wrap gap-2">
          <Chip
            label={storeData?.status == 'active' ? 'Active' : 'Inactive'}
            variant={storeData?.status == 'active' ? 'active' : 'danger'}
          />
        </div>
      ),
    },
  ];

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

      {/* modal */}
      <AppModal
        open={open}
        setOpen={setOpen}
        title={viewOptions?.title}
        description={viewOptions?.description}
        allowOutsideClick={true}
        // modalClass="small-modal"
      >
        <>
          <div className="absolute top-5 right-11 flex items-center justify-end gap-2 sm:top-3 sm:right-15">
            <DeleteAction row={row} />
            <UpdateAction row={row} setParentOpen={setOpen} />
            {/* <UpdateAction /> */}
          </div>

          {isSingleFetchLoading ? (
            <div className="itemcenter flex justify-center">
              <Spinner />
            </div>
          ) : isSingleFetchError ? (
            <p>Error: {errorTransformer(singleFetchError)}</p>
          ) : (
            <DetailList items={StoreDetails} />
          )}
        </>
      </AppModal>
    </div>
  );
};

export default ViewAction;
