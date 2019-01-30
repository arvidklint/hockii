import { Direction } from './Enums';

export interface PlayerPackage {
    userName: string,
    x: number,
    y: number,
}

export interface CreateGamePackage {
    userName: string,
    gameName: string,
}

export interface JoinGamePackage {
    userName: string,
    gameName: string,
}

export interface ChangeDirectionPackage {
    userName: string,
    direction: Direction,
}

export interface GamePackage {
    name: string,
    waitingForPlayers: boolean,
    width: number,
    height: number,
}

export interface GamesPackage {
    games: GamePackage[]
}

export interface UpdateGamePackage {
    game: GamePackage,
    players: PlayerPackage[],
}