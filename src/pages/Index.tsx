
import { useState } from "react";
import AlarmList, { Alarm, createAlarm } from "@/components/AlarmList";
import AddAlarmButton from "@/components/AddAlarmButton";
import { AlarmFormValues } from "@/components/AlarmForm";
import { toast } from "sonner";

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const handleAddAlarm = (formValues: AlarmFormValues) => {
    const newAlarm = createAlarm(formValues);
    setAlarms(prev => [...prev, newAlarm]);
    toast.success(`Alarm set for ${formValues.time}`);
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
    toast.success("Alarm deleted");
  };

  const handleEditAlarm = (id: string) => {
    // For now, we'll just show a toast. In a future update, we can implement the edit functionality
    toast.info("Edit functionality coming soon");
  };

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-6">Alarms</h1>
        <AlarmList 
          alarms={alarms}
          onToggleAlarm={handleToggleAlarm}
          onDeleteAlarm={handleDeleteAlarm}
          onEditAlarm={handleEditAlarm}
        />
        <AddAlarmButton onAddAlarm={handleAddAlarm} />
      </div>
    </div>
  );
};

export default Index;
