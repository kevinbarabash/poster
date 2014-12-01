declare class Poster {
    listeners: {
        [x: string]: (...args: any[]) => any;
    };
    target: any;
    origin: string;
    constructor(target: any, origin?: string);
    post(channel: any, ...args: any[]): void;
    listen(channel: string, callback: (...args: any[]) => any): void;
}
export = Poster;
