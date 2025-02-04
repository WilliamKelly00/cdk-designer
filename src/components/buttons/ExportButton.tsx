import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useState } from 'react';
import exportCanvasToBlob from '@/utils/export/canvas';
import toBase64 from '@/utils/export/base64';
import OverlayButton from './OverlayButton';

interface ExportButtonProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  excalidrawAPI,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [base64String, setBase64String] = useState<string | null>(null);

  const handleExportClick = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const blob = await exportCanvasToBlob(excalidrawAPI);
      if (!blob) throw new Error('Failed to generate blob');

      const base64 = await toBase64(blob);
      setBase64String(base64);
      console.log('Base64 Encoded Data:', base64);
    } catch (error) {
      console.error('Error exporting canvas:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <OverlayButton onClick={handleExportClick} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Export Canvas'}
      </OverlayButton>
      {base64String && (
        <textarea readOnly value={base64String} rows={5} cols={50} />
      )}
    </div>
  );
};
