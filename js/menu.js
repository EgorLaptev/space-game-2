'use strict';

import Game from './Game.js';

const menu = document.getElementById('pauseMenu'),
      resume    = document.getElementById('menu__resume'),
      store     = document.getElementById('menu__store'),
      settings  = document.getElementById('menu__settings');

const settingsMenu      = document.getElementById('settingsMenu'),
      storeMenu         = document.getElementById('storeMenu'),
      backgroundVolume  = document.getElementById('backgroundVolume');

const menuBack = document.querySelectorAll('.menu__back');

resume.addEventListener('click', evt => {
    Game.resume();
});

store.addEventListener('click', evt => {
    menu.style.display = 'none';
    storeMenu.style.display = 'grid';
});

settings.addEventListener('click', evt => {
    menu.style.display = 'none';
    settingsMenu.style.display = 'block';
});

backgroundVolume.addEventListener('input', evt => {
    Game.bgSound.volume = backgroundVolume.value;
});

menuBack.forEach( back => {
    back.addEventListener('click', evt => {
        back.parentNode.style.display = 'none';
        menu.style.display = 'block';
    });
});