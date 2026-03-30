import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="back-btn-wrap mb-4">
      <Button variant="iconButton" size="icon" onClick={() => navigate(-1)}>
        <ChevronLeft />
      </Button>
    </div>
  );
};

export default BackButton;
