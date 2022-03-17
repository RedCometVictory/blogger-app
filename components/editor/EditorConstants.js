import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";

export const EditorConstants = {
  code: Code,
  delimiter: Delimiter,
  embed: Embed,
  header: Header,
  inlineCode: InlineCode,
  list: List,
  marker: Marker
};
export default EditorConstants;






// ***EDITORJS V1 example, integrate into V2
/*
// ++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++ CustomEditor.js  ++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++
import EditorJs from "react-editor-js";
import CheckList from "@editorjs/checklist";
import CodeBox from "@bomdi/codebox";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";
import Header from "@editorjs/header"

import API from "../api/image" // Your server url

const CustomEditor = ({data, imageArray, handleInstance}) => {
    const EDITOR_JS_TOOLS = {
      embed: Embed,
      header: Header,
      list: List,
      codeBox: CodeBox,
      linkTool: LinkTool,
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile(file) {
              let formData = new FormData();
              formData.append("images", file);
              // send image to server
              return API.imageUpload(formData).then((res) => {
                // get the uploaded image path, pushing image path to image array
                imageArray.push(res.data.data)
                return {
                  success: 1,
                  file: {
                    url: res.data.data
                  }
                }
              })
            }
          }
        }
      },
      quote: Quote,
      checklist: CheckList,
      delimiter: Delimiter,
      inlineCode: InlineCode,
      simpleImage: SimpleImage
    }
    // Editor.js This will show block editor in component
    // pass EDITOR_JS_TOOLS in tools props to configure tools with editor.js
    return <EditorJs instanceRef={(instance) => handleInstance(instance)}
      tools={EDITOR_JS_TOOLS} data={data}
      placeholder={`Write from here...`}/>
}
// Return the CustomEditor to use by other components.
export default CustomEditor;

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++ New .js  +++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++
import React, {Fragment, useState} from 'react';
import dynamic from "next/dynamic";
import {connect} from "react-redux";

let CustomEditor = dynamic(() => import('../../../components/CustomEditor'), {
    ssr: false
});

const New = () => {
  const [imageArray, setImageArray] = useState([]) // to keep track of uploaded image
  let [editorInstance, setEditorInstance] = useState({}) // to get the instance of editor.Js

  // remove image from imageArray
  function removeImage(img) {
    const array = imageArray.filter(image => image !== img)
      setImageArray(array)
  }

  const handleInstance = (instance) => {
    setEditorInstance(instance)
  }

  const saveArticle = async (e) => {
    e.preventDefault()
    // get the editor.js content and save it to server
    const savedData = await editorInstance.save();
    const data = {
      description: JSON.stringify(savedData),
    }

    // Clear all the unused images from server
    await clearEditorLeftoverImages()

    // Save article to server
    createArticle(data, files)
  }
  // This method will get the current images that are used by editor js,
  // and images that stored in imageArray. It will compare and call server request to 
  // remove unused imges
  const clearEditorLeftoverImages = async () => {
    // Get editorJs images
    const currentImages = []
    document.querySelectorAll('.image-tool__image-picture')
      .forEach((x) => currentImages.push(x.src.includes("/images/") && x.src))

    if (imageArray.length > currentImages.length) {
      // image deleted
      for (const img of imageArray) {
        if (!currentImages.includes(img)) {
          try {
            // delete image from backend
            await API.deleteImage({imagePath: img})
            // remove from array
            removeImage(img)
          } catch (err) {
            console.log(err.message)
          }
        }
      }
    }
  }
  return (
    <Fragment>
      <button onClick={saveArticle}>Save</button>
      {CustomEditor && <CustomEditor handleInstance={handleInstance} imageArray={imageArray}/>}
        
    </Fragment>
  );
}
export default connect(state => state)(New);

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++ Update.js  ++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++
import React, {Fragment, useEffect, useState} from 'react';
import dynamic from "next/dynamic";
import {connect} from "react-redux";
import {router} from "next/client";

let CustomEditor = dynamic(() => import('../../../components/CustomEditor'), {
    ssr: false
});

const Update = () => {
  const [imageArray, setImageArray] = useState([]) // to keep track of uploaded image
  let [editorInstance, setEditorInstance] = useState({}) //to get the instance of editor.Js
  const [editorData, setData] = useState(null) // to store editorjs data from server or other source and show it in editor.js

  useEffect(async () => {
    const {id} = router.query
    if (id) {
      // Get article from server or other source
      await getArticleDetails(id)
    }
  }, [])

  const getArticleDetails = async (id) => {
    const res = await ArticleAPI.getArticle(id)
    const resData = res.data.data

    // parse string json to JSON
    const editorData = JSON.parse(resData.description)

    for (const block of editorData.blocks) {
      if (block.type === 'image') {
        // Get the image path and save it in image array for later comparison
        addImages(block.data.file.url)
      }
    }
    setData(editorData)
  }

  // add image to imageArray
  function addImages(img) {
    imageArray.push(img)
  }

  // remove image from imageArray
  function removeImage(img) {
        const array = imageArray.filter(image => image !== img)
        setImageArray(array)
    }

    const handleInstance = (instance) => {
        setEditorInstance(instance)
    }

    const saveArticle = async (e) => {
      e.preventDefault()

      // get the editor.js content and save it to server
      const savedData = await editorInstance.save();

      const data = {
        description: JSON.stringify(savedData),
      }

      // Clear all the unused images from server
      await clearEditorLeftoverImages()

      // Save article to server
      createArticle(data)
    }

    // This method will get the current images that are used by editor js,
    // and images that stored in imageArray. It will compare and call server request to
    // remove unused image
    const clearEditorLeftoverImages = async () => {
      // Get editorJs images
      const currentImages = []
      document.querySelectorAll('.image-tool__image-picture')
        .forEach((x) => currentImages.push(x.src.includes("/images/") && x.src))

      if (imageArray.length > currentImages.length) {
        // image deleted
        for (const img of imageArray) {
          if (!currentImages.includes(img)) {
            try {
              // delete image from backend
              await API.deleteImage({imagePath: img})
              // remove from array
              removeImage(img)
            } catch (err) {
              console.log(err.message)
            }
          }
        }
      }
    }

    return (
      <Fragment>
        <button onClick={saveArticle}>Save</button>
        {CustomEditor && <CustomEditor handleInstance={handleInstance}
          data={editorData} // here we will pass the saved editorjs data to show in the editor
          imageArray={imageArray}/>}
      </Fragment>
  );
}
export default connect(state => state)(Update);
*/