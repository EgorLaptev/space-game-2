'use strict';

import Entity from "./Entity.js";

export default class Blackhole extends Entity {

    static list = [];

    static skin = '../media/images/blackhole.png';

    static w = 125;
    static h = 125;

    static damage = 25;

    static speed = 2;

    constructor(x, y) {

        super();

        this.x = x;
        this.y = y;

        this.w = Blackhole.w;
        this.h = Blackhole.h;

        Blackhole.list.push(this);

    }

}