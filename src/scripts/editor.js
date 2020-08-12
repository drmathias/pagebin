import Quill from "quill";

export default class Editor {
    constructor(notifier) {
        this.notifier = notifier;
        this.quill = new Quill('#editor', {
            debug: 'info',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'link', 'blockquote']
                ]
            },
            readOnly: false,
            theme: 'snow'
        });
        this.quill.root.innerHTML = "<h1>The Sky is the Limit</h1><p><br></p><p><img src=\"https://siasky.net/MABR5PZITLGyEOJnLxEKtHpsHssZJEtylIgxtlSfzb_snw\"></p><p><br></p><p>Create beautiful, shareable web pages in minutes. It's simple and it's free!</p><p><br></p><ol><li>Edit this page 📝</li><li>Select '<em>Publish</em>' 👉</li><li>Share the link! 📢</li></ol><p><br></p>"
    }

    GetContentAsHtml() {
        return this.quill.root.innerHTML;
    }

    OnUploadFile(uploadCallback) {
        this.quill.getModule('toolbar').addHandler('image', () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
                const file = input.files[0];
                if (/^image\//.test(file.type)) {
                    await this.notifier.asyncBlock(
                        uploadCallback(file).then(source => {
                            const range = this.quill.getSelection();
                            this.quill.insertEmbed(range.index, 'image', source);
                        }),
                        "Image has been uploaded",
                        "Uploading image");
                } else {
                    console.warn('Only images can be uploaded');
                }
            };
        });
    }
}