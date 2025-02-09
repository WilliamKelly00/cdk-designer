import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useState, useEffect } from 'react';
import exportCanvasToBlob from '@/app/lib/export/canvas';
import toBase64 from '@/app/lib/export/base64';
import Button from '@mui/material/Button';
import { IMAGE_SIZE_LIMIT, OVERLAY_POSITION_STYLE, OVERLAY_Z_INDEX } from '@/Constants';
import MonacoEditor from '../editor/Editor';
import { isBase64StringUnderSizeLimit } from '@/app/lib/export/exportImageValidator';
import { Box, Modal, Typography } from '@mui/material';

interface ExportButtonProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  excalidrawAPI,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cdkCode, setCdkCode] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      if (isBase64StringUnderSizeLimit(base64, IMAGE_SIZE_LIMIT)) {
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

        setCdkCode(data);
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography id="modal-title" variant="h6" component="h2" style={{ color: 'black' }}>
                  Image Too Large
                </Typography>
                <Button onClick={handleCloseModal} style={{ position: 'absolute', top: 8, right: 8 }}>
                  X
                </Button>
                <Typography id="modal-description" style={{ color: 'black' }} sx={{ mt: 2 }}>
                  The image exceeds the size limit. Please try with a smaller image.
                </Typography>
              </Box>
            </Modal>
    </div>
  );
};
