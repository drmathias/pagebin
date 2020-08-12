import Notifications from "awesome-notifications";

export default class Notifier {
    constructor() {
        this.awn = new Notifications({
            icons: { enabled: false },
            position: "top-right",
            labels: {
                async: "Processing"
            }
        });
    }

    async async(promise, successMessage, processingMessage) {
        return this.awn.async(promise, successMessage, "", processingMessage);
    }

    async asyncBlock(promise, successMessage, processingMessage) {
        return this.awn.asyncBlock(promise, successMessage, "", processingMessage);
    }
}