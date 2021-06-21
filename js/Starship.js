'use strict';

import Entity from "./Entity.js";

export default class Starship extends Entity {

    static x = 0;
    static y = 0;

    static points = 0;

    static damage = 5;
    static speed  = 5;

    static health = 100;

    static skin = '../media/images/starship.png';
    static laserColor = 'red';

    static attacking = false;

    static attack()
    {

        if(this.attacking) return false;

        let laserSound = new Audio('../media/sounds/laser.mp3');
        laserSound.volume = 1;
        laserSound.play();

        this.attacking = true;

        setTimeout(()=>this.attacking=false, 250);

    }

}