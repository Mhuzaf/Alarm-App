
import { useState, useEffect } from "react";
import { Alarm, createAlarm } from "@/components/AlarmList";
import { AlarmFormValues } from "@/components/AlarmForm";
import { playAlarmSound, stopAlarmSound } from "@/utils/alarmSounds";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAlarms = (user: any) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const handleAddAlarm = (formValues: AlarmFormValues) => {
    const newAlarm = createAlarm(formValues);
    setAlarms(prev => [...prev, newAlarm]);
    toast.success(`Alarm set for ${formValues.time}`);
    
    if (user) {
      saveAlarmsToDatabase([...alarms, newAlarm]);
    }
  };

  const handleToggleAlarm = (id: string) => {
    const updatedAlarms = alarms.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    );
    
    setAlarms(updatedAlarms);
    
    if (user) {
      saveAlarmsToDatabase(updatedAlarms);
    }
  };

  const handleDeleteAlarm = (id: string) => {
    const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
    setAlarms(updatedAlarms);
    toast.success("Alarm deleted");
    
    if (user) {
      saveAlarmsToDatabase(updatedAlarms);
    }
  };

  const handleEditAlarm = (id: string) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const now = new Date();
      let nextRing = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      
      if (nextRing < now) {
        nextRing.setDate(nextRing.getDate() + 1);
      }

      const updatedAlarms = alarms.map(a => 
        a.id === id ? { ...a, nextRing } : a
      );
      
      setAlarms(updatedAlarms);
      toast.success(`Alarm updated to ring at ${alarm.time}`);
      
      if (user) {
        saveAlarmsToDatabase(updatedAlarms);
      }
    }
  };

  const saveAlarmsToDatabase = async (alarms: Alarm[]) => {
    if (!user) return;
    
    try {
      const alarmsToSave = alarms.map(alarm => ({
        ...alarm,
        nextRing: alarm.nextRing.toISOString(),
      }));
      
      const { error } = await supabase
        .from('user_alarms')
        .upsert({ 
          user_id: user.id, 
          alarms: alarmsToSave 
        }, 
        { onConflict: 'user_id' });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error saving alarms:', error);
      toast.error('Failed to save your alarms');
    }
  };

  const loadAlarmsFromDatabase = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_alarms')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') {
          throw error;
        }
        return;
      }
      
      if (data && data.alarms) {
        const alarmsData = Array.isArray(data.alarms) ? data.alarms : [];
        
        const loadedAlarms = alarmsData.map((alarm: any) => ({
          ...alarm,
          nextRing: new Date(alarm.nextRing)
        }));
        
        setAlarms(loadedAlarms);
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
      toast.error('Failed to load your alarms');
    }
  };

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.nextRing <= now) {
          playAlarmSound(alarm.soundId);
          
          toast.success(
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span>⏰ Alarm! {alarm.label || alarm.time}</span>
                <button 
                  className="px-2 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80"
                  onClick={() => stopAlarmSound()}
                >
                  Stop
                </button>
              </div>
            </div>,
            {
              duration: 3000,
            }
          );
          
          handleEditAlarm(alarm.id);
        }
      });
    }, 1000);

    return () => {
      clearInterval(checkAlarms);
      stopAlarmSound();
    };
  }, [alarms]);

  useEffect(() => {
    if (user) {
      loadAlarmsFromDatabase();
    }
  }, [user]);

  return {
    alarms,
    handleAddAlarm,
    handleToggleAlarm,
    handleDeleteAlarm,
    handleEditAlarm
  };
};
