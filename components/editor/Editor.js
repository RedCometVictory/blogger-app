import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
const EditorJs = dynamic(() => import("react-editor-js"), { ssr: false});

const Editor = ({data, handleInstance, updateValue, isLoading, setIsLoading, onSave, onDeleteHandler}) => {
  // const ReactEditorJS = createReactEditorJS();
  let editorInstance;

  const [editorTools, setEditorTools] = useState();
  const [blogUpdate, isBlogUpdate] = useState(updateValue);

  let receivedBlogText = data ? data : "";
  if (typeof(receivedBlogText) === 'string') {
    if (receivedBlogText.length > 0) {
      receivedBlogText = JSON.parse(receivedBlogText);
    }
  };

  const onSaveHandler = async (editorInstance) => {
    try {
      const blogText = await editorInstance.save();
      // props.onSave(blogText)
      onSave(blogText)
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => toast.error(error.msg));
      }
    }
  };
  let editorComponent;
  if (!editorTools) {
    editorComponent = <div>Editor loading...</div>
  } else {
    editorComponent = (
      <EditorJs
        // instanceRef={(instance) => (editorInstance = instance)}
        instanceRef={(instance) => handleInstance(instance)}
        // tools={editorTools}
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

  // {blogUpdate ? 'Update' : 'Submit'}
  return (
    <section className="editor__component">
      {editorComponent}
      {/* <div className="editor__btns-container">
        <div className="save">
          <button className="btn btn-secondary" onClick={() => onSaveHandler(editorInstance)}>
            {isLoading ? "Submitted" : blogUpdate ? 'Update' : 'Submit'}
          </button>
        </div>
        <div className="delete">
          {blogUpdate ? (
            <button className="btn btn-secondary" onClick={() => onDeleteHandler()}>Delete</button>
          ) : (
            <></>
          )}
        </div>
      </div> */}
    </section>
  )
};  
export default Editor;


























// import { useState } from 'react';
// import dynamic from 'next/dynamic';
// // import { Editor } from "react-draft-wysiwyg";
// const Editor = dynamic(() => import("react-draft-wysiwyg").then(({ Editor }) => Editor), { ssr: false });
// import { EditorState } from "draft-js";
// import DOMPurify from "isomorphic-dompurify";
// // import { convertToHTML } from 'draft-convert';
// import { convertToRaw } from "draft-js";
// // const EditorState = dynamic(() => import("draft-js"), { ssr: false });
// // const DOMPurify = dynamic(() => import("dompurify"), { ssr: true });
// // const DOMPurify = dynamic(() => import("dompurify").then(({ DOMPurify }) => DOMPurify), { ssr: true });
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// // npm i @editorjs/editorjs @editorjs/delimiter @editorjs/embed @editorjs/header @editorjs/list @editorjs/marker @editorjs/paragraph @editorjs/code @editorjs/inline-code



// const EditorComponent = () => {
//   const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

//   const  [convertedContent, setConvertedContent] = useState(null);

//   const handleEditorChange = (state) => {
//     setEditorState(state);
//     convertContentToHTML();
//   }

//   const convertContentToHTML = () => {
//     // let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
//     let currentContentAsHTML = convertToRaw(editorState.getCurrentContent());
//     setConvertedContent(currentContentAsHTML);
//   }

//   const createMarkup = (html) => {
//     return  {
//       __html: DOMPurify.sanitize(html)
//     }
//   }

//   // all options ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
//   return (
//     <section className='editor'>
//       <header className="editor__header">
//         Rich Text Editor Example
//       </header>
//       <Editor
//         editorState={editorState}
//         toolbarClassName="editor__toolbar"
//         wrapperClassName="editor__wrapper"
//         editorClassName="editor__editor"
//         onEditorStateChange={handleEditorChange}
//         pl
//         toolbar={{
//           // colorPicker: { component: ColorPic },
//           // options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
//           options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'embedded', 'emoji', 'remove', 'history']
//         }}
//       />
//       <div className="editor__preview" dangerouslySetInnerHTML={createMarkup(convertedContent)}></div>
//     </section>
//   );
// };
// export default EditorComponent;