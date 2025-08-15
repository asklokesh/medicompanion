import { render, screen } from '@testing-library/react';
import { HealthMetricChart } from './HealthMetricChart';

// Recharts components are not easily testable in a JSDOM environment.
// We will mock the ResponsiveContainer to just render its children.
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }) => children,
    AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
  };
});

describe('HealthMetricChart', () => {
  const mockData = [
    { day: 'Mon', bp: 120, pulse: 70, glucose: 100, weight: 160 },
    { day: 'Tue', bp: 122, pulse: 72, glucose: 105, weight: 160.5 },
  ];

  it('renders the chart with title and correct elements', () => {
    render(
      <HealthMetricChart
        title="Test Metric"
        data={mockData}
        dataKey="bp"
        strokeColor="#000000"
        fillColor="#000000"
        unit="mmHg"
      />
    );

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('renders a "not enough data" message when data is empty', () => {
    render(
      <HealthMetricChart
        title="Test Metric"
        data={[]}
        dataKey="bp"
        strokeColor="#000000"
        fillColor="#000000"
        unit="mmHg"
      />
    );

    expect(screen.getByText('Not enough data to display chart.')).toBeInTheDocument();
  });
});
