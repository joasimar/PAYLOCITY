export default class Logger {
    static log(message) {
        console.log(`[LOG]: ${message}`);
    }

    static error(message) {
        console.error(`[ERROR]: ${message}`);
    }
}
