import { Widgets } from "blessed";
import { Subject } from "rxjs";

export class InputHandler {
    public key: Subject<string>;

    constructor(
        private screen: Widgets.Screen,
    ) {
        this.key = new Subject<string>();
        this.screen.key(['down', 'up', 'left', 'right', 'c'], (cha: string, key: any) => {
            this.key.next(key.name);
        });
    }
}

