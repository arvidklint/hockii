import blessed, { Widgets } from "blessed";
import { BoxRenderer } from "./BoxRenderer";
import loop from './loop'
import { InputHandler } from "./InputHandler";
import { Player } from "./gameObjects/Player";
import {
    PlayerPackage, CreateGamePackage, GamesPackage, JoinGamePackage, UpdateGamePackage, ChangeDirectionPackage,
} from '../../../shared/packages';
import {
    CREATE_GAME, PLAYER_CONNECTED_TO_GAME, GET_GAMES, JOIN_GAME, UPDATE_GAME, CHANGE_DIRECTION,
} from '../../../shared/eventIds';
import { Direction } from "../../../shared/Enums";

export class Game {
    private rink: Widgets.BoxElement;
    private renderer: BoxRenderer;
    private input: InputHandler;
    private player: Player;
    private opponents: Player[] = [];
    private name: string;
    private width: number = 0;
    private height: number = 0;

    private running: boolean = false;
    constructor(
        private screen: Widgets.Screen,
        private socket: SocketIOClient.Socket,
    ) {
        this.name = Math.random().toString(4);
        this.rink = blessed.box({
            top: 'center',
            left: 'center',
            width: 'shrink',
            height: 'shrink',
            content: '',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'blue',
                border: {
                    fg: '#f0f0f0'
                },
            }
        });

        screen.append(this.rink);

        this.renderer = new BoxRenderer(this.screen, this.rink);

        // Player
        this.player = new Player(Math.random().toString(4));
        this.renderer.add(this.player);

        this.input = new InputHandler(this.screen);
        this.input.key.subscribe((name: string) => {
            this.handleInput(name);
        })

        this.socket.on(JOIN_GAME, (data: UpdateGamePackage) => {
            this.updateGame(data);
            this.renderer.render(this.width, this.height);
        });

        this.socket.on(UPDATE_GAME, (data: UpdateGamePackage) => {
            // Update game
            this.updateGame(data);
            this.renderer.render(this.width, this.height);
        })

        // TODO
        // Checking for games
        this.socket.emit(GET_GAMES, (data: GamesPackage) => {
            if (!data.games) return;
            data.games.forEach(game => {
                if (game.waitingForPlayers) {
                    const joinGamePackage: JoinGamePackage = {
                        userName: this.player.id,
                        gameName: game.name,
                    };
                    this.socket.emit(JOIN_GAME, joinGamePackage);
                }
            })
        });
    }

    private updateGame(data: UpdateGamePackage) {
        const newGame = data.game;
        if (newGame) {
            this.width = newGame.width;
            this.height = newGame.height;
            this.name = newGame.name;
        }
        const newPlayers = data.players;
        if (newPlayers) {
            // check for the 
            newPlayers.forEach(p => {
                if (p.userName === this.player.id) {
                    this.updatePlayer(this.player, p);
                } else {
                    const player = this.findPlayer(p.userName)
                    if (player) {
                        this.updatePlayer(player, p);
                    } else {
                        const opp = new Player(p.userName);
                        opp.x = p.x;
                        opp.y = p.y;
                        this.opponents.push(opp);
                        this.renderer.add(opp);
                    }
                }
            })
        }
    }

    private updatePlayer(player: Player, newPlayer: PlayerPackage) {
        player.x = newPlayer.x;
        player.y = newPlayer.y;
    }

    private findPlayer(userName: string) {
        if (this.player.id === userName) {
            return this.player;
        }
        return this.opponents.find(opp => opp.id === userName);
    }

    public start() {
        
    }

    private handleInput(name: string) {
        switch (name) {
            case 'c': {
                const data: CreateGamePackage = {
                    userName: this.player.id,
                    gameName: this.name,
                }
                this.socket.emit(CREATE_GAME, data);
                break;
            }
            case 'down': {
                const data: ChangeDirectionPackage = {
                    userName: this.player.id,
                    direction: Direction.Down,
                }
                this.socket.emit(CHANGE_DIRECTION, data);
                break;
            }
            case 'up': {
                const data: ChangeDirectionPackage = {
                    userName: this.player.id,
                    direction: Direction.Up,
                }
                this.socket.emit(CHANGE_DIRECTION, data);
                break;
            }
            case 'left': {
                const data: ChangeDirectionPackage = {
                    userName: this.player.id,
                    direction: Direction.Left,
                }
                this.socket.emit(CHANGE_DIRECTION, data);
                break;
            }
            case 'right': {
                const data: ChangeDirectionPackage = {
                    userName: this.player.id,
                    direction: Direction.Right,
                }
                this.socket.emit(CHANGE_DIRECTION, data);
                break;
            }
        }
    }
}