import { Button } from '@/components/ui/button';
import { PencilLine } from 'lucide-react';

const UpdateAction = () => {
  return (
    <div>
      <Button
        variant="iconButtonGreen"
        size="icon"
        // onClick={handleModalOpen}
        className="size-7 sm:size-10"
      >
        <PencilLine className="size-4 sm:size-5" />
      </Button>
    </div>
  );
};

export default UpdateAction;
