'use strict';

import random from "./random.js";
import collision from "./collision.js";

import Starship from "./Starship.js";
import UFO from "./UFO.js";
import Blackhole from "./Blackhole.js";

export default class Game {

    static cnv = null;
    static ctx = null;

    static started = false;
    static paused  = false;

    static bgSound = new Audio('../media/sounds/bg.mp3');
    static bgImage = {
        src: '../media/images/bg.jpg',
        y: 0,
        speed: 2
    };

    static UFOs = [];
    static pressedKeys = [];

    static start()
    {

        if( this.started ) return false;

        this.started = true;

        this.bgSound.loop = true;
        this.bgSound.volume = .25;
        this.bgSound.play();

        Starship.x = this.cnv.width/2 - Starship.w/2;
        Starship.y = this.cnv.height - Starship.h - 50;

        setInterval( ()=> {
            this.generateUFOs(random(0, 3));
        }, 1500);

        setInterval( ()=> {
           this.generateBlackholes(1);
        },  7500);

        this.control();
        this.loop();

    }

    static loop()
    {

        if( !Game.paused && Game.started ) {

            Game.movement();
            Game.collisions();

            if( Starship.health <= 0) Game.end();

        }

        Game.render();

        requestAnimationFrame(Game.loop);

    }

    static render()
    {

        // Background
        let bgImage = new Image();
        bgImage.src = this.bgImage.src;
        this.ctx.drawImage(bgImage, 0, this.bgImage.y, this.cnv.width, this.cnv.height);
        this.ctx.drawImage(bgImage, 0, this.bgImage.y - this.cnv.height, this.cnv.width, this.cnv.height);

        // Player starship
        let starshipImage = new Image();
        starshipImage.src = Starship.skin;
        this.ctx.drawImage(starshipImage, Starship.x, Starship.y, Starship.w, Starship.h);

        // Laser
        if(Starship.attacking) {
            this.ctx.fillStyle = Starship.laserColor;
            this.ctx.fillRect(Starship.x+Starship.w/2-1, 0, 3, Starship.y+1 );
        }

        // UFOs
        let UFOsImage = new Image();

        UFO.list.forEach( ufo => {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(ufo.x, ufo.y - 20, ufo.health, 3);
            UFOsImage.src = ufo.skin;
            this.ctx.drawImage(UFOsImage, ufo.x, ufo.y, ufo.w, ufo.h);
        })

        // Blackholes
        let blackholeImage = new Image();
        blackholeImage.src = Blackhole.skin;

        Blackhole.list.forEach( blackhole => {
            this.ctx.drawImage(blackholeImage, blackhole.x, blackhole.y, Blackhole.w, Blackhole.h);
        });

        // Health
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(this.cnv.width-225, this.cnv.height-30, 200, 15);
        this.ctx.fillStyle = '#F00';
        this.ctx.fillRect(this.cnv.width-225, this.cnv.height-30, Starship.health*2, 15);

        // Points
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'normal 18px PressStart2P';
        this.ctx.fillText(`Points: ${Starship.points}`, 50, this.cnv.height-15);

    }

    static control()
    {

        document.addEventListener('keydown', evt => {

            if( !this.started ) return false;

            if(
                evt.keyCode === 65 ||   // Left
                evt.keyCode === 83 ||   // Down
                evt.keyCode === 68 ||   // Right
                evt.keyCode === 87      // Top
            ) this.pressedKeys[evt.keyCode] = true;

            if (evt.keyCode === 27) (Game.paused) ? Game.resume() : Game.pause(); // Esc

            if (evt.keyCode === 32 && !this.paused) Starship.attack() // Space

        });

        document.addEventListener('keyup', evt => {

            if(
                evt.keyCode === 65 ||   // Left
                evt.keyCode === 83 ||   // Down
                evt.keyCode === 68 ||   // Right
                evt.keyCode === 87      // Top
            ) this.pressedKeys[evt.keyCode] = false;

        });

    }

    static movement()
    {

        this.bgImage.speed = 2;

        // Player
        if(this.pressedKeys[65] && Starship.x > 0) Starship.x -= Starship.speed;  // Left
        if(this.pressedKeys[68] && Starship.x < this.cnv.width - Starship.w)  Starship.x += Starship.speed;  // Right
        if(this.pressedKeys[83] && Starship.y < this.cnv.height - Starship.h) Starship.y += Starship.speed; // Down
        if(this.pressedKeys[87] && Starship.y > 0) { // Top
            Starship.y -= Starship.speed;
            this.bgImage.speed = 4;
        }

        // Background
        if(this.bgImage.y >= this.cnv.height) this.bgImage.y = 0;
        this.bgImage.y += this.bgImage.speed;

        // UFOs
        UFO.list.forEach( (ufo, i) => {
           ufo.y += ufo.speedY;
           ufo.x += ufo.speedX;

           if(ufo.x <= 0 || ufo.x + ufo.w >= this.cnv.width) ufo.speedX = -ufo.speedX;

           if(ufo.y >= this.cnv.height) UFO.list.splice(i, 1);

        });

        // Blackholes
        Blackhole.list.forEach( (blackhole, i) => {
            blackhole.y += Blackhole.speed;
            if(blackhole.y >= this.cnv.height) Blackhole.list.splice(i, 1);
        })


    }

    static collisions()
    {

        UFO.list.forEach( (ufo, i) => {

            // With starship
            if(collision(Starship, ufo)) {

                Starship.health -= UFO.damage;

                if(Starship.health <= 25) Starship.skin = '../media/images/starship_h25.png';
                else if(Starship.health <= 75) Starship.skin = '../media/images/starship_h75.png';

            }

            // With laser
            if(
                Starship.attacking &&
                ufo.x < Starship.x+Starship.w/2 &&
                ufo.x + ufo.w > Starship.x+Starship.w/2
            ) {
                if(ufo.health <= 0) {
                    Starship.points++;
                    UFO.destroy(i, ufo);
                } else ufo.health -= Starship.damage;
            }

        });

        Blackhole.list.forEach( blackhole => {
            if(collision(Starship, blackhole)) Starship.health -= Blackhole.damage;

            UFO.list.forEach( (ufo, i) => {
                if(collision(blackhole, ufo)) {
                    (new Audio('../media/sounds/explosion.mp3')).play();
                    UFO.list.splice(i, 1);
                }
            })

        });

    }

    static generateUFOs(count)
    {

        for (let i=0;i<count;i++)
            new UFO(
                random(0, this.cnv.width-UFO.w),
                -UFO.h-100-random(0, 250)
            );

    }

    static generateBlackholes(count)
    {

        for (let i=0;i<count;i++)
            new Blackhole(
                random(25, this.cnv.width-Blackhole.w-25),
                -Blackhole.h-100-random(0, 250)
            );

    }

    static pause()
    {

        let pauseScreen = document.getElementById('pauseScreen');

        this.paused = true;
        this.bgSound.pause();

        pauseScreen.style.display = 'flex';

    }

    static resume()
    {

        let pauseScreen = document.getElementById('pauseScreen');

        this.paused = false;
        this.bgSound.play();

        pauseScreen.style.display = 'none';

    }

    static end()
    {

        if ( !this.started ) return false;

        Starship.skin = '../media/images/explosion.png';
        Starship.health = 0;
        Starship.w = 200;
        Starship.h = 200;

        this.started = false;

        (new Audio('../media/sounds/explosion.mp3')).play();
        setTimeout(()=>window.location.reload(), 1500);

    }

}