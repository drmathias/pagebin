import Quill from "quill";

export default class Editor {
    constructor() {
        this.quill = new Quill('#editor', {
            debug: 'info',
            modules: {
                formula: true,
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
                    ['link', 'image', 'formula']
                ]
            },
            formats: [
                'bold', 'code', 'italic', 'link', 'strike', 'script', 'underline',
                'blockquote', 'header', 'indent', 'list', 'align', 'code-block',
                'formula', 'image', 'video'
            ],
            readOnly: false,
            theme: 'snow'
        });
        //default theme
        this.LoadTemplate("<h1>The Sky is the Limit</h1><p><br></p><p><img src=\"https://siasky.net/MABR5PZITLGyEOJnLxEKtHpsHssZJEtylIgxtlSfzb_snw\"></p><p><br></p><p>Create beautiful, shareable web pages in minutes. It's simple and it's free!</p><p><br></p><ol><li>Edit this page 📝</li><li>Select '<em>Publish</em>' 👉</li><li>Share the link! 📢</li></ol><p><br></p>");
    }

    GetContentAsHtml() {
        return this.quill.root.innerHTML;
    }

    LoadTemplate(template) {
        console.debug(`Loading template: ${template}`);
        this.quill.root.innerHTML = template;
    }
}