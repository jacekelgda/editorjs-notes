import mentionsService from "./mention-service.js";
import InlineMention from "./inline-mention.js";

const editor = new EditorJS({
  holder: "editorjs",
  placeholder: "Type your text here",
  inlineToolbar: ["bold", "italic", "link", "inlineMention"],
  tools: {
    inlineMention: InlineMention,
    list: {
      class: NestedList,
      inlineToolbar: true,
      config: {
        defaultStyle: "unordered",
      },
    },
  },
  autofocus: true,
  minHeight: 100,
  onReady: () => {
    mentionsService.init(editor);
  },
  onChange: () => {
    editor.save().then(async (outputData) => {
      console.log(outputData);
      await fetch("http://localhost:3002/block", {
        method: "POST",
        body: JSON.stringify(outputData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    });
  },
});
