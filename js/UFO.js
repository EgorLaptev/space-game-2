'use strict';

import Entity from "./Entity.js";
import Game from "./Game.js";

export default class UFO extends Entity {

    static list = [];

    skin  = '../media/images/enemies/ufo.png';

    speedX = 2;
    speedY = 3;

    health = 100;

    static damage = 1;

    static w = 125;
    static h = 60;

    static destroy(index)
    {
        this.list.splice(index, 1);
        (new Audio(Game.explosionSound)).play();
    }

    constructor(x, y) {

        super();

        this.x = x;
        this.y = y;

        this.w = UFO.w;
        this.h = UFO.h;

        UFO.list.push(this);

    }

}