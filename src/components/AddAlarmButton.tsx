
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useState } from "react";
import AlarmForm, { AlarmFormValues } from "./AlarmForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AddAlarmButtonProps {
  onAddAlarm: (alarm: AlarmFormValues) => void;
}

const AddAlarmButton = ({ onAddAlarm }: AddAlarmButtonProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleAddAlarm = (data: AlarmFormValues) => {
    onAddAlarm(data);
    setOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add Alarm</DrawerTitle>
            </DrawerHeader>
            <AlarmForm 
              onSubmit={handleAddAlarm} 
              onCancel={() => setOpen(false)} 
              isMobile={true}
            />
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Add Alarm</DialogTitle>
          <AlarmForm 
            onSubmit={handleAddAlarm} 
            onCancel={() => setOpen(false)} 
            isMobile={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAlarmButton;
