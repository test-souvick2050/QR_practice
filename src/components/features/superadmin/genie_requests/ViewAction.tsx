import { Button } from '@/components/ui/button';
import type { StoreOwner } from '@/types/types';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import actionMenuItems from './customizer';
import AppModal from '@/components/reusables/modal/AppModal';
import { errorTransformer } from '@/utils/error';
import Spinner from '@/components/reusables/Spinner';
import { useFetchSingleGenieRequest } from '@/hooks/helpTicketHooks';

const ViewAction = ({ row, text }: { row: StoreOwner; text?: string }) => {
  const { viewOptions } = actionMenuItems;
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };

  // ? Help Ticket Details Fetching
  const {
    isError: isSingleFetchError,
    error: singleFetchError,
    data: helpTicketData,
    isLoading: isSingleFetchLoading,
  } = useFetchSingleGenieRequest(row.id);

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
          {isSingleFetchLoading ? (
            <div className="itemcenter flex justify-center">
              <Spinner />
            </div>
          ) : isSingleFetchError ? (
            <p>Error: {errorTransformer(singleFetchError)}</p>
          ) : (
            <div className="details-wrap">
              <section className="space-y-3">
                <div className="flex items-start justify-between">
                  <p className="text-gray-600">Requester Name:</p>
                  <p className="text-black">
                    {helpTicketData?.requester_name ? helpTicketData.requester_name : '----'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Requester Email:</p>
                  <p className="text-black">
                    {helpTicketData?.requester_email ? helpTicketData.requester_email : '----'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Store Location:</p>
                  <p className="text-black">
                    {helpTicketData?.store_location?.name
                      ? helpTicketData.store_location?.name
                      : '----'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Message:</p>
                  <p className="text-black">
                    {helpTicketData?.message ? helpTicketData.message : '----'}
                  </p>
                </div>
              </section>
            </div>
          )}
        </>
      </AppModal>
    </div>
  );
};

export default ViewAction;
