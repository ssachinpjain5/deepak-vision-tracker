
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Patient, EyeDetails } from '@/models/PatientTypes';
import { PatientService } from '@/services/PatientService';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const eyeSchema = z.object({
  sphere: z.string().optional(),
  cylinder: z.string().optional(),
  axis: z.string().optional(),
  add: z.string().optional(),
});

const formSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  name: z.string().min(1, { message: "Name is required" }),
  mobile: z.string().min(10, { message: "Mobile number should be at least 10 digits" }),
  rightEye: eyeSchema,
  leftEye: eyeSchema,
  framePrice: z.string().optional(),
  glassPrice: z.string().optional(),
  remarks: z.string().min(1, { message: "Remarks are required" }),
});

type FormData = z.infer<typeof formSchema>;

export const PatientForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      name: "",
      mobile: "",
      rightEye: { sphere: "", cylinder: "", axis: "", add: "" },
      leftEye: { sphere: "", cylinder: "", axis: "", add: "" },
      framePrice: "",
      glassPrice: "",
      remarks: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const patient: Patient = {
      id: crypto.randomUUID(),
      date: format(data.date, 'yyyy-MM-dd'),
      name: data.name,
      mobile: data.mobile,
      rightEye: data.rightEye,
      leftEye: data.leftEye,
      framePrice: data.framePrice || '',
      glassPrice: data.glassPrice || '',
      remarks: data.remarks,
    };

    if (PatientService.add(patient)) {
      form.reset();
      onSuccess();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Patient Record</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile Field */}
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be unique for each patient
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Eye Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Right Eye Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="rightEye.sphere"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sphere</FormLabel>
                      <FormControl>
                        <Input placeholder="SPH" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rightEye.cylinder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cylinder</FormLabel>
                      <FormControl>
                        <Input placeholder="CYL" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rightEye.axis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Axis</FormLabel>
                      <FormControl>
                        <Input placeholder="AXIS" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rightEye.add"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add</FormLabel>
                      <FormControl>
                        <Input placeholder="ADD" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Left Eye Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Left Eye Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="leftEye.sphere"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sphere</FormLabel>
                      <FormControl>
                        <Input placeholder="SPH" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leftEye.cylinder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cylinder</FormLabel>
                      <FormControl>
                        <Input placeholder="CYL" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leftEye.axis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Axis</FormLabel>
                      <FormControl>
                        <Input placeholder="AXIS" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leftEye.add"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add</FormLabel>
                      <FormControl>
                        <Input placeholder="ADD" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pricing Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="framePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frame Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter frame price" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="glassPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Glass Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter glass price" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Remarks */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional information or remarks"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Patient Record</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
