import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const AdsEditor = ({initialContent, onEditorChange }) => {

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    onEditorChange(data);
  };
  return (
    <CKEditor
      
      editor={ClassicEditor}
      config={{
        
        toolbar: [
          "heading",
          "|",
          "fontSize",
          "fontFamily",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "highlight",
          "|",
          "alignment",
          "|",
          "numberedList",
          "bulletedList",
          "|",
          "indent",
          "outdent",
          "|",
          "todoList",
          "link",
          "blockQuote",
          "insertTable",
          "|",
          "undo",
          "redo",
        ],
      }}
      data={initialContent}
      
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log("Editor is ready to use!", editor);
      }}
      onChange={handleEditorChange}
      onBlur={(event, editor) => {
        console.log("Blur.", editor);
      }}
      onFocus={(event, editor) => {
        console.log("Focus.", editor);
      }}
    />
  );
};


export default AdsEditor;