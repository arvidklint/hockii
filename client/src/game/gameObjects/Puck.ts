import { Renderable } from "../models/Renderable";

export class Ball implements Renderable {
    public text: string = 'o';

    constructor(
        public x: number,
        public y: number,
    ) {}
}