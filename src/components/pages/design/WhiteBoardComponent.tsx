'use client';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useCallbackRefState } from '@/app/lib/hooks/useCallbackRefState';
import { ExportButton } from '../design/buttons/ExportButton';
import { LIBRARY_STYLE } from '@/Constants';

const WhiteBoard: React.FC = () => {
  const [excalidrawAPI, excalidrawRefCallback] =
  useCallbackRefState<ExcalidrawImperativeAPI>();

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <style>{LIBRARY_STYLE}</style>
      <ExportButton excalidrawAPI={excalidrawAPI} />
      <Excalidraw 
        excalidrawAPI={excalidrawRefCallback}
        
        />
    </div>
  );
};
export default WhiteBoard;
