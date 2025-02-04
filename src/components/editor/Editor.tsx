import React, { useRef } from 'react';
import { editor } from 'monaco-editor';
import { Editor } from '@monaco-editor/react';

interface MonacoEditorProps {
  defaultValue: string;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({ defaultValue }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  return (
    <Editor
      wrapperProps={{
        style: {
          position: 'absolute',
          top: '70px',
          right: '10px',
          width: '30vw',
          zIndex: 1000,
          height: 'calc(100vh - 70px)',
          display: 'flex',
        },
      }}
      height="calc(100vh - 70px)"
      width="30vw"
      defaultLanguage="javascript"
      defaultValue={defaultValue}
      theme="vs-dark"
      onMount={(editor) => {
        editorRef.current = editor;
      }}
      options={{
        fontSize: 16,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 25 },
      }}
    />
  );
};

export default MonacoEditor;
