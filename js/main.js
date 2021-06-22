'use strict';

import Game from "./Game.js";
import './menu.js';

Game.cnv = document.getElementById('gameField');
Game.ctx = Game.cnv.getContext('2d');

Game.cnv.width  = window.innerWidth;
Game.cnv.height = window.innerHeight;

let startScreen = document.getElementById('startScreen');

document.addEventListener('click', evt => {

    if(!Game.started) {
        startScreen.style.display = 'none';
        Game.start();
    }

});

window.addEventListener('resize', evt => {
    Game.cnv.width  = window.innerWidth;
    Game.cnv.height = window.innerHeight;
});