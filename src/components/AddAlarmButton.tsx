
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddAlarmButton = () => {
  return (
    <Button
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default AddAlarmButton;
