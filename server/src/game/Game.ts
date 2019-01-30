import { Player } from "./Player";
import { Socket, Server } from "socket.io";
import {
    CreateGamePackage,
    PlayerPackage,
    UpdateGamePackage,
    ChangeDirectionPackage,
} from '../../../shared/packages';
import {
    UPDATE_GAME,
    CHANGE_DIRECTION,
    JOIN_GAME
} from "../../../shared/eventIds";

export class Game {
    private players: Player[] = [];
    private maxPlayers: number = 2;
    public waitingForPlayers: boolean = true;

    public name: string;
    private roomId: string;

    public width: number = 10;
    public height: number = 5;

    constructor(
        private io: Server,
        private data: CreateGamePackage,
    ) {
        this.players = [];
        this.name = this.data.gameName;
        this.roomId = Math.random().toString(16);

        // starting loop
        this.loop();
    }

    private findPlayer(userName: string) {
        return this.players.find(p => p.userName === userName);
    }

    public addPlayer(socket: Socket, userName: string) {
        socket.join(this.roomId);
        const randX = Math.floor(Math.random() * 10);
        const randY = Math.floor(Math.random() * 5);
        const newPlayer = new Player(userName, randX, randY);
        this.players.push(newPlayer);
        if (this.players.length >= this.maxPlayers) {
            this.waitingForPlayers = false;
        }

        this.io.to(this.roomId).emit(JOIN_GAME, this.getUpdateData());

        socket.on(CHANGE_DIRECTION, (data: ChangeDirectionPackage) => {
            const player = this.findPlayer(data.userName);
            if (!player) return; // TODO: handle error
            player.changeDirection(data.direction);
        });
    }

    private getUpdateData(): UpdateGamePackage {
        return {
            game: {
                name: this.name,
                waitingForPlayers: this.waitingForPlayers,
                width: this.width,
                height: this.height,
            },
            players: this.players.map((p: Player): PlayerPackage => {
                return {
                    userName: p.userName,
                    x: p.x,
                    y: p.y,
                }
            }),
        }
    }

    private sendAll() { 
        this.io.to(this.roomId).emit(UPDATE_GAME, this.getUpdateData());
    }

    private loop() {
        if (!this.players) {
            return;
        };
        this.players.forEach(p => {
            p.update(this.width, this.height);
        })
        this.sendAll();
        setTimeout(() => this.loop(), 120);
    }
}