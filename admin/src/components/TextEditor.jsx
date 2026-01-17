import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function TextEditor({ value, onChange, readOnly = false }) {
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
        className={`mb-6 border-2 border-card rounded-md w-full ${readOnly ? "opacity-40 pointer-events-none" : ""}`}
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
  );
}

export default TextEditor;
