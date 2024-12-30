import { useEffect, useState } from 'react';

export const Footer = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  const renderClockNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30) - 90; // 30 degrees per hour
      const x = 50 + 35 * Math.cos((angle * Math.PI) / 180); // X coordinate for number
      const y = 50 + 35 * Math.sin((angle * Math.PI) / 180); // Y coordinate for number
      numbers.push(
        <text
          key={i}
          x={x}
          y={y}
          className="text-white font-semibold text-xs"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {i}
        </text>
      );
    }
    return numbers;
  };

  return (
    <footer className="bg-gray-600 text-white text-center py-4">
      <div className="flex justify-center items-center space-x-6 mt-4">
        <div className="relative flex items-center">
          {/* Clock dial SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-16 h-16 text-white"
          >
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" fill="none" />
            {/* Hour numbers with white color */}
            {renderClockNumbers()}
            {/* Clock hands */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="10"
              stroke="white"
              strokeWidth="2"
              transform={`rotate(${(new Date().getSeconds() * 6) - 90} 50 50)`}
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              stroke="white"
              strokeWidth="4"
              transform={`rotate(${(new Date().getMinutes() * 6) - 90} 50 50)`}
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="20"
              stroke="white"
              strokeWidth="6"
              transform={`rotate(${(new Date().getHours() * 30) - 90} 50 50)`}
            />
          </svg>
          {/* Display current time */}
          <p className="ml-4 text-white">{time}</p>
        </div>
        <div className='space-x-7'>
        <p>&copy; {new Date().getFullYear()} Event Calendar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
