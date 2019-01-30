import { GameObject } from "./GameObject";

export class Player implements GameObject {
    public text: string = '@';
    public x: number = 0;
    public y: number = 0;

    constructor(
        public id: string,
    ) { }
}