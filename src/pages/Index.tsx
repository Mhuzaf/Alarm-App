
import { useState, useEffect } from "react";
import AlarmList, { Alarm, createAlarm } from "@/components/AlarmList";
import AddAlarmButton from "@/components/AddAlarmButton";
import { AlarmFormValues } from "@/components/AlarmForm";
import { toast } from "sonner";
import { playAlarmSound, stopAlarmSound } from "@/utils/alarmSounds";
import { useAuthContext } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();

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
      // Update the alarm's next ring time
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
      // Convert dates to ISO strings for storage
      const alarmsToSave = alarms.map(alarm => ({
        ...alarm,
        nextRing: alarm.nextRing.toISOString(),
      }));
      
      // Using upsert with the correct table name
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
        if (error.code !== 'PGRST116') { // Record not found error is expected for new users
          throw error;
        }
        return;
      }
      
      if (data && data.alarms) {
        // Convert ISO date strings back to Date objects
        const loadedAlarms = data.alarms.map((alarm: any) => ({
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  useEffect(() => {
    if (user) {
      loadAlarmsFromDatabase();
    }
  }, [user]);

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.nextRing <= now) {
          // Play the selected alarm sound
          playAlarmSound(alarm.soundId);
          
          toast.success(
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span>⏰ Alarm! {alarm.label || alarm.time}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => stopAlarmSound()}
                >
                  Stop
                </Button>
              </div>
            </div>,
            {
              duration: 30000,
            }
          );
          
          // Update next ring time to tomorrow
          handleEditAlarm(alarm.id);
        }
      });
    }, 1000);

    return () => {
      clearInterval(checkAlarms);
      stopAlarmSound();  // Clean up any playing sounds when component unmounts
    };
  }, [alarms]);

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" /> Alarms
          </h1>
          {user ? (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>

        <AlarmList 
          alarms={alarms}
          onToggleAlarm={handleToggleAlarm}
          onDeleteAlarm={handleDeleteAlarm}
          onEditAlarm={handleEditAlarm}
        />
        <AddAlarmButton onAddAlarm={handleAddAlarm} />

        {!user && (
          <div className="mt-8 p-4 border border-dashed rounded-md text-center text-muted-foreground">
            <p>You're not logged in. Your alarms will be saved locally but will be lost if you clear your browser data.</p>
            <Button 
              variant="link" 
              onClick={handleLogin}
              className="mt-2"
            >
              Log in to save your alarms
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
