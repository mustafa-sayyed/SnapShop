import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function TextEditor() {
  const [value, setValue] = useState("Write your email here...");
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, false] }],
    [{ align: [] }],
    
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],

    ["clean"],
  ];

  return (
      <ReactQuill
        modules={{ toolbar: toolbarOptions }}
        theme="snow"
        value={value}
        onChange={setValue}
      />
  );
}

export default TextEditor;
