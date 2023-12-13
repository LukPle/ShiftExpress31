import React, { ReactNode } from 'react';

interface ChapterAreaProps {
    children: ReactNode;
}

const ChapterArea: React.FC<ChapterAreaProps> = ({ children }) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'start',
      }}
    >
      {children}
    </div>
  );
};

export default ChapterArea;
