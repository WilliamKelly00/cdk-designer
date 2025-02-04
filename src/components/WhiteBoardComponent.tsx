'use client';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useState } from 'react';
import { ExportButton } from './buttons/ExportButton';

const ExcalidrawWrapper: React.FC = () => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  return (
    <div style={{ height: '100vh', width: '100vw, position: relative' }}>
      <ExportButton excalidrawAPI={excalidrawAPI} />
      <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />
    </div>
  );
};
export default ExcalidrawWrapper;
