import blessed, {
    Widgets,
} from 'blessed';
import { Game } from './game/Game';

import io from 'socket.io-client';

const socket = io('http://localhost:3000');

let game;
socket.on('connect', function(){
    game = new Game(screen, socket);
    game.start();
});

const screen: Widgets.Screen = blessed.screen({
    smartCSR: true,
});

screen.title = 'my window title';

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});


