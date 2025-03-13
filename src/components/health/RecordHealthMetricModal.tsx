
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recordHealthMetric } from "@/services/healthTrackingService";

const healthMetricSchema = z.object({
  type: z.string().min(1, "Metric type is required"),
  value: z.string().min(1, "Value is required"),
  unit: z.string().min(1, "Unit is required"),
});

type HealthMetricFormValues = z.infer<typeof healthMetricSchema>;

interface RecordHealthMetricModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMetricAdded: () => void;
}

export function RecordHealthMetricModal({
  open,
  onOpenChange,
  onMetricAdded,
}: RecordHealthMetricModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<HealthMetricFormValues>({
    resolver: zodResolver(healthMetricSchema),
    defaultValues: {
      type: "blood_pressure",
      value: "",
      unit: "mmHg",
    },
  });

  const onSubmit = async (data: HealthMetricFormValues) => {
    setIsLoading(true);
    try {
      const success = await recordHealthMetric(
        {
          type: data.type,
          value: data.value,
          unit: data.unit,
        },
        user?.id
      );

      if (success) {
        toast.success("Health metric recorded successfully");
        form.reset({
          type: "blood_pressure",
          value: "",
          unit: "mmHg",
        });
        onMetricAdded();
        onOpenChange(false);
      } else {
        toast.error("Failed to record health metric");
      }
    } catch (error) {
      console.error("Error recording health metric:", error);
      toast.error("An error occurred while recording the health metric");
    } finally {
      setIsLoading(false);
    }
  };

  // Set the unit field and placeholder based on the selected type
  const handleTypeChange = (type: string) => {
    form.setValue("type", type);
    
    let unit = "";
    let placeholder = "";
    
    switch (type) {
      case "blood_pressure":
        unit = "mmHg";
        placeholder = "120/80";
        break;
      case "heart_rate":
        unit = "BPM";
        placeholder = "72";
        break;
      case "blood_glucose":
        unit = "mg/dL";
        placeholder = "105";
        break;
      case "temperature":
        unit = "°F";
        placeholder = "98.6";
        break;
      case "weight":
        unit = "lbs";
        placeholder = "160";
        break;
      case "oxygen_saturation":
        unit = "%";
        placeholder = "98";
        break;
      case "steps":
        unit = "steps";
        placeholder = "8500";
        break;
      case "sleep":
        unit = "hours";
        placeholder = "7.5";
        break;
      case "water_intake":
        unit = "oz";
        placeholder = "64";
        break;
      default:
        unit = "";
        placeholder = "";
    }
    
    form.setValue("unit", unit);
    
    // Update the placeholder of the value field
    const valueField = document.getElementById("value");
    if (valueField) {
      (valueField as HTMLInputElement).placeholder = placeholder;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Health Metric</DialogTitle>
          <DialogDescription>
            Add a new health measurement to track your health over time.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Type</FormLabel>
                  <Select
                    onValueChange={(value) => handleTypeChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                      <SelectItem value="heart_rate">Heart Rate</SelectItem>
                      <SelectItem value="blood_glucose">Blood Glucose</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="oxygen_saturation">Oxygen Saturation</SelectItem>
                      <SelectItem value="steps">Steps</SelectItem>
                      <SelectItem value="sleep">Sleep</SelectItem>
                      <SelectItem value="water_intake">Water Intake</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input id="value" placeholder="Enter value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="Unit" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                {isLoading ? "Recording..." : "Record Metric"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
