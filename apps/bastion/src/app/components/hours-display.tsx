import React from 'react';
import { CodeBlock, Collapsible, MenuHoursConfiguration, MenuRegularHours, MenuTimeRange } from 'ui';

interface HoursDisplayProps {
  hoursConfig: MenuHoursConfiguration | undefined;
}

const DayHours: React.FC<{ hours: MenuRegularHours, index: number }> = ({ hours, index }) => {
  const bgColor = index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'; // Alternating background colors
  return (
    <div className={`flex justify-between items-center p-2 ${bgColor}`}>
      <strong className="text-darkgreen-500">{(hours?.days ?? []).join(', ')}:</strong>
      <div className="flex gap-2">
        {hours?.time_ranges.map((range, idx) => (
          <TimeRange key={idx} range={range} />
        ))}
      </div>
    </div>
  );
};

const TimeRange: React.FC<{ range: MenuTimeRange }> = ({ range }) => {
  // Helper function to format time to 12-hour format with AM/PM
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = ((hours + 11) % 12 + 1); // Converts 24h to 12h format
    return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <CodeBlock className="bg-gray-300 text-darkgreen-500 px-2 py-1 rounded-md shadow">
      {`${formatTime(range?.start ?? '')} - ${formatTime(range?.end ?? '')}`}
    </CodeBlock>
  );
};

const HoursDisplay: React.FC<HoursDisplayProps> = ({ hoursConfig }) => {
  if (!hoursConfig || (!hoursConfig.regular_hours && !hoursConfig.special_hours)) {
    return <div className="text-gray-500 italic">No hours found</div>;
  }

  return (
    <Collapsible
      stepHeaderProps={{ text: 'Hours of Operation' }} // Adjust according to actual props
      expanded={false}
    >
      {hoursConfig.regular_hours && hoursConfig.regular_hours.map((hours, index) => (
        <DayHours key={index} hours={hours} index={index} />
      ))}
    </Collapsible>
  );
};

export default HoursDisplay;