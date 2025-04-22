
import React from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlarmClock, Edit, Trash } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { AlarmFormValues } from './AlarmForm';
import { format } from 'date-fns';
import { alarmSounds } from '@/utils/alarmSounds';

export interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  label?: string;
  nextRing: Date;
  soundId: string;
}

interface AlarmListProps {
  alarms: Alarm[];
  onDeleteAlarm: (id: string) => void;
  onToggleAlarm: (id: string) => void;
  onEditAlarm: (id: string) => void;
}

const AlarmList = ({ 
  alarms,
  onDeleteAlarm,
  onToggleAlarm,
  onEditAlarm
}: AlarmListProps) => {
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
                <p className="text-xs text-muted-foreground">
                  Rings at: {format(alarm.nextRing, 'PPp')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Sound: {alarmSounds.find(s => s.id === alarm.soundId)?.name || 'Default'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={alarm.enabled}
                  onCheckedChange={() => onToggleAlarm(alarm.id)}
                />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => onEditAlarm(alarm.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => onDeleteAlarm(alarm.id)}>
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

export const createAlarm = (formValues: AlarmFormValues): Alarm => {
  const [hours, minutes] = formValues.time.split(':').map(Number);
  const now = new Date();
  let nextRing = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  
  // If the time has already passed today, set it for tomorrow
  if (nextRing < now) {
    nextRing.setDate(nextRing.getDate() + 1);
  }

  return {
    id: uuidv4(),
    time: formValues.time,
    label: formValues.label,
    enabled: true,
    nextRing,
    soundId: formValues.soundId || 'default'
  };
};

export default AlarmList;
