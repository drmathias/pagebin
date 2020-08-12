import { SkynetClient } from "skynet-js";
import Notifier from "./notifier"
import Editor from "./editor";

const notifier = new Notifier();

const skynet = new SkynetClient("https://siasky.net");

const editor = new Editor(notifier);
editor.OnUploadFile(async file => {
  return skynet.upload(file)
    .then(response => {
      console.debug(`Uploaded image at ${response.skylink}`)
      return `https://siasky.net/${response.skylink}`;
    });
});

const templatePage = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css">
  <style type="text/css">
    body {
      margin: 0;
    }

    .container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    #editor {
      max-width: 36rem;
      width: 100%;
      margin: 0 auto;
      flex: 1;
      border: 0;
    }
  </style>
</head>

<body>
    <div class="container">
        <div id="editor" class="ql-container ql-snow">
            <div class="ql-editor">
            </div>
        </div>
    </div>
</body>

</html>`;

let uploading = false;

async function uploadDocument() {
  uploading = true;

  let template = new DOMParser().parseFromString(templatePage, "text/html");
  template.getElementById("editor").firstElementChild.innerHTML = editor.GetContentAsHtml();

  const file = new File([template.documentElement.outerHTML], "fileName", { type: "text/html" });

  const response = await skynet.upload(file)
  console.debug(response.skylink);
  window.location.href = `https://siasky.net/${response.skylink}`;
}

document.getElementById("publish").onclick = async () => {
  if (!uploading) {
    await notifier.async(
      uploadDocument().then(() => uploading = false),
      "Redirecting you to your pagebin",
      "Uploading your document");
  }
};
