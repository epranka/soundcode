import React, { useEffect } from "react";
import Editor, { monaco } from "@monaco-editor/react";

interface IProps {
  width: number;
  height: number;
  value: string;
  onChange: (value: string) => any;
}

const CodeEditor: React.SFC<IProps> = ({ value, onChange, width, height }) => {
  const handleEditorDidMount = (_, editor) => {
    editor.onDidChangeModelContent(_ => {
      onChange(editor.getValue());
    });
  };

  useEffect(() => {
    monaco.init().then(monaco => {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
        noSuggestionDiagnostics: true
      });
    });
  }, []);

  return (
    <Editor
      width={width}
      height={height}
      value={value}
      editorDidMount={handleEditorDidMount}
      language="typescript"
      theme="dark"
      options={{
        minimap: { enabled: false },
        contextmenu: false,
        showUnused: false,
        folding: false,
        formatOnPaste: true,
        parameterHints: {
          enabled: false
        },
        glyphMargin: false,
        hideCursorInOverviewRuler: true,
        quickSuggestions: false,
        suggest: {},
        occurrencesHighlight: false,
        overviewRulerBorder: false,
        scrollbar: { horizontal: "auto", vertical: "auto" },
        scrollBeyondLastLine: false,
        snippetSuggestions: "none",
        hover: { enabled: false }
      }}
    />
  );
};

export default CodeEditor;
