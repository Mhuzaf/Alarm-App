
import { useState, useEffect } from "react";
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
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      // Update the alarm's next ring time
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const now = new Date();
      let nextRing = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      
      if (nextRing < now) {
        nextRing.setDate(nextRing.getDate() + 1);
      }

      setAlarms(alarms.map(a => 
        a.id === id ? { ...a, nextRing } : a
      ));
      toast.success(`Alarm updated to ring at ${alarm.time}`);
    }
  };

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.nextRing <= now) {
          toast.success(`Alarm! ${alarm.label || alarm.time}`, {
            duration: 10000,
          });
          // Update next ring time to tomorrow
          handleEditAlarm(alarm.id);
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

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
