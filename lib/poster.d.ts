declare class Poster {
    public listeners: {
        [index: string]: (...args: any[]) => any;
    };
    public target: Window;
    public origin: string;
    constructor(target: Window);
    public post(channel: any, ...args: any[]): void;
    public listen(channel: string, callback: (...args: any[]) => any): void;
}
export = Poster;
