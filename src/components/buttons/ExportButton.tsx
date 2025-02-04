import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useState, useEffect } from 'react';
import exportCanvasToBlob from '@/utils/export/canvas';
import toBase64 from '@/utils/export/base64';
import Button from '@mui/material/Button';
import { OVERLAY_POSITION_STYLE, OVERLAY_Z_INDEX } from '@/Constants';
import MonacoEditor from '../editor/Editor';

interface ExportButtonProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  excalidrawAPI,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cdkCode, setCdkCode] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExportClick = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const blob = await exportCanvasToBlob(excalidrawAPI);
      if (!blob) throw new Error('Failed to generate blob');

      const base64 = await toBase64(blob);
      console.log('Base64 Encoded Data:', base64);

      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64EncodedImage: base64 }),
      });

      const { data, error } = await response.json();

      if (error) {
        console.error('Error generating CDK code:', error);
        return;
      }

      console.log('CDK Code:', data);
      setCdkCode(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      //   setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleExportClick}
        disabled={isProcessing}
        style={{
          position: OVERLAY_POSITION_STYLE,
          zIndex: OVERLAY_Z_INDEX,
          top: windowWidth < 900 ? 'calc(99vh - 100px)' : '15px',
          left: windowWidth < 900 ? '50%' : 'auto',
          right: windowWidth < 900 ? 'auto' : '10px',
          transform: windowWidth < 900 ? 'translateX(-50%)' : 'none',
        }}
      >
        {isProcessing ? 'Processing...' : 'Create Cdk'}
      </Button>
      {cdkCode && <MonacoEditor defaultValue={cdkCode} />}
    </div>
  );
};
