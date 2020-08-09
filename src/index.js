import { SkynetClient } from "skynet-js";
import Quill from "quill";
import Notifications from "awesome-notifications";

const notifier = new Notifications({
    icons: { enabled: false },
    position: "top-right",
    labels: {
        async: "Processing"
    }
});

const skynet = new SkynetClient("https://siasky.net");

const editor = new Quill('#editor', {
    debug: 'info',
    modules: {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'link', 'blockquote']
        ]
    },
    placeholder: 'Start writing here...',
    readOnly: false,
    theme: 'bubble'
});

// default content
editor.root.innerHTML = "<h1>The Sky is the Limit</h1><p><br></p><p><img src=\"https://siasky.net/MABR5PZITLGyEOJnLxEKtHpsHssZJEtylIgxtlSfzb_snw\"></p><p><br></p><p>Create beautiful documents and share them with the world. It's simple and it's free!</p><p><br></p><ol><li>Edit this page 📝</li><li>Select '<em>Publish</em>' 👉</li><li>Share the link! 📢</li></ol><p><br></p>"

editor.getModule('toolbar').addHandler('image', () => {
    selectLocalImage();
});

function selectLocalImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
        const file = input.files[0];
        if (/^image\//.test(file.type)) {
            notifier
                .asyncBlock(skynet.upload(file)
                    .then(response => {
                        const range = editor.getSelection();
                        editor.insertEmbed(range.index, 'image', `https://siasky.net/${response.skylink}`);
                    }),
                    "Image has been uploaded",
                    "",
                    "Uploading image");

        } else {
            console.warn('Only images can be uploaded');
        }
    };
}

const templatePage = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//cdn.quilljs.com/1.0.0/quill.bubble.css">
  <style type="text/css">
    body {
      margin: 0;
    }

    #editor {
      margin: 1rem auto;
      width: 100%;
      max-width: 36rem;
      height: fit-content;
    }
  </style>
</head>

<body>
  <div id="editor" class="ql-container ql-bubble">
    <div class="ql-editor">
    </div>
  </div>
</body>

</html>`;

let uploading = false;

async function uploadDocument() {
    uploading = true;

    let template = new DOMParser().parseFromString(templatePage, "text/html");
    template.getElementById("editor").firstElementChild.innerHTML = editor.root.innerHTML;

    const file = new File([template.documentElement.outerHTML], "fileName", { type: "text/html" });

    const response = await skynet.upload(file)
    console.debug(response.skylink);
    window.location.href = `https://siasky.net/${response.skylink}`;
}

document.getElementById("publish").onclick = () => {
    if (!uploading) {
        notifier.async(
            uploadDocument().then(() => uploading = false),
            "",
            "",
            "Uploading your document");
    }
};