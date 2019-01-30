import { Server } from "http";
import IO, { Socket } from 'socket.io';
import {
    MATCHMAKE,
    CREATE_GAME,
    PLAYER_CONNECTED_TO_GAME,
    JOIN_GAME,
    GAME_CREATED,
    GET_GAMES,
} from '../../shared/eventIds';
import {
    CreateGamePackage, JoinGamePackage, GamesPackage, GamePackage,
} from '../../shared/packages';
import { Game } from "./game/Game";
import { Player } from "./game/Player";

export class Hub {
    private io: IO.Server;
    private games: Game[] = [];

    constructor(
        private http: Server,
    ) {
        this.io = IO(this.http);
        this.io.on('connection', (socket: Socket) => {
            console.log('new connection');
            socket.on(CREATE_GAME, (data: CreateGamePackage, callback: Function) => {
                const newGame = new Game(this.io, data);
                newGame.addPlayer(socket, data.userName);
                this.games.push(newGame);
            });

            socket.on(JOIN_GAME, (data: JoinGamePackage) => {
                const game = this.findGameWithName(data.gameName);
                if (game && game.waitingForPlayers) {
                    game.addPlayer(socket, data.userName);
                }
            });

            socket.on(GET_GAMES, (callback) => {
                const data: GamesPackage = {
                    games: this.games.reduce((games: GamePackage[], game: Game) => {
                        return [
                            ...games,
                            {
                                name: game.name,
                                waitingForPlayers: game.waitingForPlayers,
                                width: game.width,
                                height: game.height,
                            },
                        ]
                    }, []),
                };
                callback(data);
            });
        });

        
    }

    private findGameWithName(name: string) {
        return this.games.find((game) => {
            return game.name === name;
        })
    }
}