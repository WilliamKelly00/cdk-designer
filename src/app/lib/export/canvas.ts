import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { exportToBlob } from '@excalidraw/excalidraw';

const initialData = {
  appState: {
    exportWithDarkMode: false,
  },
};

export default async function exportCanvasToBlob(
  excalidrawAPI: ExcalidrawImperativeAPI | null,
): Promise<Blob | null> {
  if (!excalidrawAPI) {
    return null;
  }
  const elements = excalidrawAPI.getSceneElements();
  if (!elements || !elements.length) {
    return null;
  }
  const canvas = await exportToBlob({
    elements,
    appState: {
      ...initialData.appState,
    },
    files: excalidrawAPI.getFiles(),
  });

  return canvas;
}
