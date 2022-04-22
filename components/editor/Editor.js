import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const EditorJs = dynamic(() => import("react-editor-js"), { ssr: false});

const Editor = ({data, handleInstance, updateValue, isLoading, setIsLoading, onSave, onDeleteHandler}) => {
  const [editorTools, setEditorTools] = useState();

  let receivedBlogText = data ? data : "";
  if (typeof(receivedBlogText) === 'string') {
    if (receivedBlogText.length > 0) {
      receivedBlogText = JSON.parse(receivedBlogText);
    }
  };
  let editorComponent;
  if (!editorTools) {
    editorComponent = <div>Editor loading...</div>
  } else {
    editorComponent = (
      <EditorJs
        instanceRef={(instance) => handleInstance(instance)}
        tools={editorTools}
        data={receivedBlogText}
        placeholder={`Write something fun!`}
      />
    )
  }

  useEffect(() => {
    const importConstants = async () => {
      const tools = (await import('./EditorConstants')).default;
      setEditorTools(tools);
    };
    importConstants();
  }, []);

  return (
    <section className="editor__component">
      {editorComponent}
    </section>
  )
};  
export default Editor;