
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { DrawerFooter } from "@/components/ui/drawer";
import { toast } from "sonner";

interface AlarmFormProps {
  onSubmit: (data: AlarmFormValues) => void;
  onCancel: () => void;
  isMobile: boolean;
  defaultValues?: AlarmFormValues;
}

export interface AlarmFormValues {
  time: string;
  label?: string;
  days: string[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AlarmForm = ({ onSubmit, onCancel, isMobile, defaultValues }: AlarmFormProps) => {
  const form = useForm<AlarmFormValues>({
    defaultValues: defaultValues || {
      time: '08:00',
      label: '',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    }
  });

  const handleSubmit = (data: AlarmFormValues) => {
    if (data.days.length === 0) {
      toast.error("Please select at least one day for the alarm");
      return;
    }
    onSubmit(data);
  };

  const toggleDay = (day: string) => {
    const currentDays = form.getValues().days || [];
    if (currentDays.includes(day)) {
      form.setValue('days', currentDays.filter(d => d !== day));
    } else {
      form.setValue('days', [...currentDays, day]);
    }
  };

  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-2">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} className="text-2xl" />
              </FormControl>
            </FormItem>
          )}
        />

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

        <div>
          <FormLabel>Repeat</FormLabel>
          <div className="flex gap-1 mt-2">
            {DAYS.map((day) => (
              <Button
                key={day}
                type="button"
                size="sm"
                variant={form.watch('days')?.includes(day) ? "default" : "outline"}
                onClick={() => toggleDay(day)}
                className="min-w-9"
              >
                {day[0]}
              </Button>
            ))}
          </div>
        </div>

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
