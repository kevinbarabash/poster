declare class Poster {
    listeners: {
        [x: string]: (...args: any[]) => any;
    };
    target: Window;
    origin: string;
    constructor(target: Window, origin?: string);
    post(channel: any, ...args: any[]): void;
    listen(channel: string, callback: (...args: any[]) => any): void;
}
export = Poster;
