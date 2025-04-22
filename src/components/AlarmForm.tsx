
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { DrawerFooter } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { alarmSounds, playAlarmSound, stopAlarmSound } from "@/utils/alarmSounds";
import { Volume2, VolumeX } from "lucide-react";

interface AlarmFormProps {
  onSubmit: (data: AlarmFormValues) => void;
  onCancel: () => void;
  isMobile: boolean;
  defaultValues?: AlarmFormValues;
}

export interface AlarmFormValues {
  time: string;
  label?: string;
  soundId?: string;
}

const AlarmForm = ({ onSubmit, onCancel, isMobile, defaultValues }: AlarmFormProps) => {
  const form = useForm<AlarmFormValues>({
    defaultValues: defaultValues || {
      time: '08:00',
      label: '',
      soundId: 'default',
    }
  });

  const [hours, setHours] = useState(() => {
    const defaultHours = defaultValues ? parseInt(defaultValues.time.split(':')[0]) : 8;
    return defaultHours;
  });
  
  const [minutes, setMinutes] = useState(() => {
    const defaultMinutes = defaultValues ? parseInt(defaultValues.time.split(':')[1]) : 0;
    return defaultMinutes;
  });
  
  const [period, setPeriod] = useState(() => {
    const defaultHours = defaultValues ? parseInt(defaultValues.time.split(':')[0]) : 8;
    return defaultHours >= 12 ? 'PM' : 'AM';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);

  // Update time value when hours, minutes, or period changes
  const updateTimeValue = (newHours: number, newMinutes: number, newPeriod: string) => {
    let hours24 = newHours;
    
    if (newPeriod === 'PM' && newHours !== 12) {
      hours24 = newHours + 12;
    } else if (newPeriod === 'AM' && newHours === 12) {
      hours24 = 0;
    }
    
    const formattedHours = hours24.toString().padStart(2, '0');
    const formattedMinutes = newMinutes.toString().padStart(2, '0');
    form.setValue('time', `${formattedHours}:${formattedMinutes}`);
  };

  // Handle hours slider change
  const handleHoursChange = (value: number[]) => {
    const newHours = value[0];
    setHours(newHours);
    updateTimeValue(newHours, minutes, period);
  };

  // Handle minutes slider change
  const handleMinutesChange = (value: number[]) => {
    const newMinutes = value[0];
    setMinutes(newMinutes);
    updateTimeValue(hours, newMinutes, period);
  };

  // Handle AM/PM change
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    updateTimeValue(hours, minutes, value);
  };

  // Handle sound preview
  const handleSoundPreview = (soundId: string) => {
    if (isPlaying && currentSound === soundId) {
      stopAlarmSound();
      setIsPlaying(false);
      setCurrentSound(null);
    } else {
      if (isPlaying) {
        stopAlarmSound();
      }
      playAlarmSound(soundId);
      setIsPlaying(true);
      setCurrentSound(soundId);
    }
  };

  // Clean up sound preview when component unmounts
  React.useEffect(() => {
    return () => {
      stopAlarmSound();
    };
  }, []);

  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Set Time</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Hours ({hours})</span>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newPeriod = period === 'AM' ? 'PM' : 'AM';
                    setPeriod(newPeriod);
                    updateTimeValue(hours, minutes, newPeriod);
                  }}
                >
                  {period}
                </Button>
              </div>
            </div>
            <Slider 
              value={[hours]} 
              min={1} 
              max={12} 
              step={1} 
              onValueChange={handleHoursChange} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Minutes ({minutes})</span>
            </div>
            <Slider 
              value={[minutes]} 
              min={0} 
              max={59} 
              step={1} 
              onValueChange={handleMinutesChange} 
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Alarm label" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="soundId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alarm Sound</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl className="flex-1">
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Stop previous sound if playing
                      if (isPlaying) {
                        stopAlarmSound();
                        setIsPlaying(false);
                        setCurrentSound(null);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sound" />
                    </SelectTrigger>
                    <SelectContent>
                      {alarmSounds.map(sound => (
                        <SelectItem key={sound.id} value={sound.id}>
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleSoundPreview(field.value || 'default')}
                  title={isPlaying && currentSound === field.value ? "Stop preview" : "Preview sound"}
                >
                  {isPlaying && currentSound === field.value ? 
                    <VolumeX className="h-4 w-4" /> : 
                    <Volume2 className="h-4 w-4" />
                  }
                </Button>
              </div>
            </FormItem>
          )}
        />

        <Footer className="pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">
            Save Alarm
          </Button>
        </Footer>
      </form>
    </Form>
  );
};

export default AlarmForm;
