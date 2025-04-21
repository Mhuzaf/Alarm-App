
import React from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlarmClock, Edit, Trash } from "lucide-react";

interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  label?: string;
  days: string[];
}

const AlarmList = () => {
  const [alarms, setAlarms] = React.useState<Alarm[]>([]);

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  return (
    <div className="space-y-4">
      {alarms.length === 0 ? (
        <Card className="p-6 text-center">
          <AlarmClock className="mx-auto mb-4 text-primary h-12 w-12" />
          <p className="text-lg text-muted-foreground">No alarms set</p>
          <p className="text-sm text-muted-foreground">Click the + button to add an alarm</p>
        </Card>
      ) : (
        alarms.map((alarm) => (
          <Card key={alarm.id} className="p-4 alarm-item">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{alarm.time}</h3>
                {alarm.label && (
                  <p className="text-sm text-muted-foreground">{alarm.label}</p>
                )}
                <div className="flex gap-1 mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span
                      key={day}
                      className={`text-xs px-1 rounded ${
                        alarm.days.includes(day)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {day[0]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={alarm.enabled}
                  onCheckedChange={() => toggleAlarm(alarm.id)}
                />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default AlarmList;
