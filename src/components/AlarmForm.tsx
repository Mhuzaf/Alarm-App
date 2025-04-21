
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { DrawerFooter } from "@/components/ui/drawer";

interface AlarmFormProps {
  onSubmit: (data: AlarmFormValues) => void;
  onCancel: () => void;
  isMobile: boolean;
  defaultValues?: AlarmFormValues;
}

export interface AlarmFormValues {
  time: string;
  label?: string;
}

const AlarmForm = ({ onSubmit, onCancel, isMobile, defaultValues }: AlarmFormProps) => {
  const form = useForm<AlarmFormValues>({
    defaultValues: defaultValues || {
      time: '08:00',
      label: '',
    }
  });

  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-2">
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
