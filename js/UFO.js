'use strict';

import Entity from "./Entity.js";

export default class UFO extends Entity {

    static list = [];

    skin  = '../media/images/ufo.png';

    speedX = 2;
    speedY = 3;

    health = 100;

    static damage = 1;

    static w = 125;
    static h = 60;

    static destroy(index, ufo)
    {
        this.list.splice(index, 1);
        (new Audio('../media/sounds/explosion.mp3')).play();
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