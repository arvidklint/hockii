import { Direction } from '../../../shared/Enums';

export class Player {
    public direction: Direction;
    constructor(
        public userName: string,
        public x: number,
        public y: number,
    ) {
        this.direction = Direction.None;
    }

    public changeDirection(direction: Direction) {
        this.direction = direction;
    }

    public update(width: number, height: number) {
        switch (this.direction) {
            case Direction.Down:
                this.down(height - 1);
                break;
            case Direction.Up:
                this.up(0);
                break;
            case Direction.Left:
                this.left(0);
                break;
            case Direction.Right:
                this.right(width - 1);
                break;
        }
    }

    private down(max: number) {
        this.y++;
        if (this.y > max) this.y = max;
    }

    private up(min: number) {
        this.y--;
        if (this.y < min) this.y = min;
    }

    private left(min: number) {
        this.x--;
        if (this.x < min) this.x = min;
    }

    private right(max: number) {
        this.x++;
        if (this.x > max) this.x = max;
    }
}