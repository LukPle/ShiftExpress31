import React, { ReactNode } from 'react';

interface ChapterAreaProps {
    children: ReactNode;
}

const ChapterArea: React.FC<ChapterAreaProps> = ({ children }) => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'start',
      }}
    >
      {children}
    </div>
  );
};

export default ChapterArea;
