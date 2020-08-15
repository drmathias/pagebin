import { SkynetClient } from 'skynet-js';
import Editor from './editor';

const skynet = new SkynetClient('https://siasky.net');
const editor = new Editor();

function MutualPromise(promise) {
  let running = false;
  const execute = async () => {
    let response = null;
    if (!running) {
      running = true;
      response = await promise();
      running = false;
    }
    return response;
  };
  return execute;
}

const templatePage = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
        integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous">
    <script async defer src="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js"
        integrity="sha384-g7c+Jr9ZivxKLnZTDUhnkOnsh30B4H0rpLUpJ4jAIKs4fnJI+sEnkvrMWph2EDg4"
        crossorigin="anonymous"></script>
    <style type="text/css">
      body {
        margin: 0;
      }
  
      .container {
        display: flex;
        flex-direction: column;
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

const uploadDocument = new MutualPromise(async () => {
  const template = new DOMParser().parseFromString(templatePage, 'text/html');
  template.getElementById('editor').firstElementChild.innerHTML = editor.GetContentAsHtml();
  const completePage = `<!DOCTYPE html>\n${template.documentElement.outerHTML}`;

  const file = new File([completePage], 'fileName', { type: 'text/html' });

  const response = await skynet.upload(file);
  return `https://siasky.net/${response.skylink}`;
});

document.getElementById('publish').onclick = async () => {
  const documentLocation = await uploadDocument();
  if (documentLocation) { window.location.href = documentLocation; }
};
