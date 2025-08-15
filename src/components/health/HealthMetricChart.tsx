import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HealthData } from "@/healthTrackingService";

interface HealthMetricChartProps {
  title: string;
  data: HealthData[];
  dataKey: keyof HealthData;
  strokeColor: string;
  fillColor: string;
  unit: string;
}

export const HealthMetricChart = ({ title, data, dataKey, strokeColor, fillColor, unit }: HealthMetricChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <p className="text-gray-500">Not enough data to display chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis unit={unit} />
              <Tooltip formatter={(value) => `${value} ${unit}`} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={strokeColor}
                fill={fillColor}
                fillOpacity={0.3}
                name={title}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
