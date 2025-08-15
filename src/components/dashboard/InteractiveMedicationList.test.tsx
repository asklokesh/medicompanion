import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { InteractiveMedicationList } from './InteractiveMedicationList';

describe('InteractiveMedicationList', () => {
  const mockUpdateStatus = vi.fn();
  const mockIsTaken = vi.fn().mockReturnValue(false);

  const mockMedications = [
    { id: 'med1', name: 'Lisinopril', dosage: '10mg', time_of_day: ['morning'] },
    { id: 'med2', name: 'Metformin', dosage: '500mg', time_of_day: ['morning'] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a list of medications', () => {
    render(
      <InteractiveMedicationList
        currentMedications={mockMedications}
        updateMedicationStatus={mockUpdateStatus}
        isMedicationTakenToday={mockIsTaken}
        timeOfDay="morning"
      />
    );

    expect(screen.getByText('Lisinopril')).toBeInTheDocument();
    expect(screen.getByText('Metformin')).toBeInTheDocument();
  });

  it('calls updateMedicationStatus with "taken" when Take button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <InteractiveMedicationList
        currentMedications={mockMedications}
        updateMedicationStatus={mockUpdateStatus}
        isMedicationTakenToday={mockIsTaken}
        timeOfDay="morning"
      />
    );

    const takeButtons = screen.getAllByRole('button', { name: /take/i });
    await user.click(takeButtons[0]);

    expect(mockUpdateStatus).toHaveBeenCalledWith('med1', 'taken');
  });

  it('calls updateMedicationStatus with "skipped" when Skip button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <InteractiveMedicationList
        currentMedications={mockMedications}
        updateMedicationStatus={mockUpdateStatus}
        isMedicationTakenToday={mockIsTaken}
        timeOfDay="morning"
      />
    );

    const skipButtons = screen.getAllByRole('button', { name: /skip/i });
    await user.click(skipButtons[0]);

    expect(mockUpdateStatus).toHaveBeenCalledWith('med1', 'skipped');
  });

  it('shows a completion message when all medications are taken', () => {
    const allTakenMock = vi.fn().mockReturnValue(true);
    render(
      <InteractiveMedicationList
        currentMedications={mockMedications}
        updateMedicationStatus={mockUpdateStatus}
        isMedicationTakenToday={allTakenMock}
        timeOfDay="morning"
      />
    );

    expect(screen.getByText(/medications complete/i)).toBeInTheDocument();
  });
});
