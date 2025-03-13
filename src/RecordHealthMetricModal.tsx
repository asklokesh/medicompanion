
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recordHealthMetric } from "./healthTrackingService";

const healthMetricSchema = z.object({
  type: z.string().min(1, "Metric type is required"),
  value: z.string().min(1, "Value is required"),
  unit: z.string().min(1, "Unit is required"),
});

type HealthMetricForm = z.infer<typeof healthMetricSchema>;

interface RecordHealthMetricModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMetricAdded?: () => void;
}

export function RecordHealthMetricModal({
  open,
  onOpenChange,
  onMetricAdded,
}: RecordHealthMetricModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HealthMetricForm>({
    resolver: zodResolver(healthMetricSchema),
    defaultValues: {
      type: "",
      value: "",
      unit: "",
    },
  });

  const onSubmit = async (data: HealthMetricForm) => {
    setIsSubmitting(true);
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
        toast.success("Health metric recorded successfully!");
        form.reset();
        onOpenChange(false);
        onMetricAdded?.();
      } else {
        toast.error("Failed to record health metric");
      }
    } catch (error) {
      console.error("Error submitting health metric:", error);
      toast.error("An error occurred while recording the health metric");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        placeholder = "100";
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
        placeholder = "8000";
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
            Log your latest health readings to track your wellbeing over time.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Metric Type</FormLabel>
              <Select
                onValueChange={handleTypeChange}
                defaultValue={form.getValues("type")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a metric type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                  <SelectItem value="heart_rate">Heart Rate</SelectItem>
                  <SelectItem value="blood_glucose">Blood Glucose</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="oxygen_saturation">
                    Oxygen Saturation
                  </SelectItem>
                  <SelectItem value="steps">Steps</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="water_intake">Water Intake</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input
                  id="value"
                  {...form.register("value")}
                  placeholder="Enter measurement value"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input
                  id="unit"
                  {...form.register("unit")}
                  readOnly
                  className="bg-gray-50"
                />
              </FormControl>
              <FormDescription>
                Unit is automatically set based on metric type
              </FormDescription>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Metric"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
