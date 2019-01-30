import { Widgets } from 'blessed';
import { Renderable } from './models/Renderable';

export class BoxRenderer {
    private renderables: Renderable[] = [];
    private width: number;
    private height: number;

    constructor(
        private screen: Widgets.Screen,
        private box: Widgets.BoxElement,
    ) {
        
    }

    public add(r: Renderable) {
        this.renderables.push(r);
    }

    public render(width: number, height: number) {
        let lanes: string[] = [];
        // Resetting the area
        for (let y = 0; y < height; y++) {
            lanes.push('.'.repeat(width));
        }

        this.renderables.forEach((r: Renderable) => {
            if (r.y >= height || r.y < 0) return;
            if (r.x >= width || r.x < 0) return;
            lanes[r.y] = this.addTextToString(lanes[r.y], r.x, r.text);
        })

        const content = lanes.join('\n');
        this.box.setContent(content);
        this.screen.render();
    }

    private addTextToString(source: string, index: number, text: string) {
        return source.substring(0, index) + text + source.substring(index + text.length);
    }
}