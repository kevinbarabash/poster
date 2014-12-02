declare class Poster {
    listeners: {
        [x: string]: any[];
    };
    target: any;
    origin: string;
    constructor(target: any, origin?: string);
    post(channel: any, ...args: any[]): void;
    emit(channel: any, ...args: any[]): void;
    listen(channel: string, callback: (...args: any[]) => any): Poster;
    addListener(channel: string, callback: (...args: any[]) => any): Poster;
    on(channel: string, callback: (...args: any[]) => any): Poster;
    removeListener(channel: string, callback: (...args: any[]) => any): void;
}
export = Poster;
