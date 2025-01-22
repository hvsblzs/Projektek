//Globális változók
let n;
const table = document.querySelector('#gameContainer');
let timeInterval;

function init(){
    document.querySelector('#nameInput').addEventListener('input', inputCheck);
    document.querySelector('#start').addEventListener('click', startGameAndTimer);
    document.querySelector('#description').addEventListener('click', descShow);
    document.querySelector('#exitDescBtn').addEventListener('click', descHide);
    document.querySelector('#gameContainer').addEventListener('click', placeTrack);
    document.querySelector('#exitGame').addEventListener('click', exitGame);
    document.querySelector('#exitWinBtn').addEventListener('click', exitGameWon);
}

function inputCheck(e){
    const userName = document.querySelector('#nameInput');
    const strtBtn = document.querySelector('#start');
    
    strtBtn.disabled = userName.value === '';
    document.querySelector('#gameName').innerHTML = userName.value;
}

function startGameAndTimer(e){
    const menu = document.querySelector('.menuContainer');
    menu.classList.add('hidden');

    const gameBoard = document.querySelector('.gameScreenContainer');
    gameBoard.classList.remove('hidden');


    //Timer
    let startTime;

    startTime = Date.now();
    timeInterval = setInterval(() => {
        const timePassed = Date.now() - startTime;
        const snds = Math.floor(timePassed / 1000);
        const mnts = Math.floor(snds / 60);
        const displaySnds = snds % 60;

        document.querySelector('#elapsedTime').textContent = String(mnts).padStart(2, '0') + ":" + String(displaySnds).padStart(2, '0');
    }, 1000);


    //Játéktér kirajzolása
    n = parseInt(document.querySelector('#diffSelect').value);
    let gameMatrix;

    if(n === 5){
        gameMatrix = easyLevels[Math.floor(Math.random() * easyLevels.length)];
    }else if(n === 7){
        gameMatrix = hardLevels[Math.floor(Math.random() * hardLevels.length)];
    }

    for(let i = 0; i < n; i++){
        let row = table.insertRow();
        for (let j = 0; j < n; j++) {
            let cell = row.insertCell();
            switch(gameMatrix[i][j]){
                case 1:
                    cell.classList.add('empty');
                    break;
                case 2:
                    cell.classList.add('oasis');
                    break;
                case 3:
                    cell.classList.add('hor_bridge');
                    break;
                case 4:
                    cell.classList.add('ver_bridge');
                    break;
                case 5:
                    cell.classList.add('mnt_left_down');
                    break;
                case 6:
                    cell.classList.add('mnt_left_up');
                    break;
                case 7:
                    cell.classList.add('mnt_right_down');
                    break;
                case 8:
                    cell.classList.add('mnt_right_up');
                    break;
            }
            cell.setAttribute("currTrack", '-1');
            cell.classList.add('noTrack');
        }
    }
}

function descShow(e){
    const menu = document.querySelector('.menuContainer');
    const desc = document.querySelector('.descText');

    menu.classList.add('hidden');
    desc.classList.remove('hidden');
}

function descHide(e){
    const menu = document.querySelector('.menuContainer');
    const desc = document.querySelector('.descText');

    menu.classList.remove('hidden');
    desc.classList.add('hidden');
}

function placeTrack(e){
    const tile = e.target;
    const tileName = e.target.className.split(' ')[0];
    const validTracks = tiles.filter(e => e.name === tileName)[0].validTracks;
    const trackAttr = parseInt(tile.getAttribute("currTrack"));

    if(trackAttr === -1 || trackAttr === validTracks.length - 1){
        tile.setAttribute("currTrack", '0');
        tile.classList.remove('noTrack');
        tile.classList.remove(validTracks[trackAttr]);
        tile.classList.add(validTracks[0]);
    }else{
        tile.classList.remove(validTracks[trackAttr]);
        tile.setAttribute("currTrack", trackAttr + 1);
        tile.classList.add(validTracks[trackAttr + 1]);
    }
    checkWin();
}

function exitGame() {
    const gameBoard = document.querySelector('.gameScreenContainer');
    const menu = document.querySelector('.menuContainer');
    const table = document.querySelector('#gameContainer');

    gameBoard.classList.add('hidden');
    menu.classList.remove('hidden');
    
    table.innerHTML = '';

    clearInterval(timeInterval);
    document.querySelector('#elapsedTime').textContent = '00:00';
}

function exitGameWon() {
    const winScreen = document.querySelector('.winScreenContainer');
    const menu = document.querySelector('.menuContainer');
    const table = document.querySelector('#gameContainer');

    winScreen.classList.add('hidden');
    menu.classList.remove('hidden');
    
    table.innerHTML = '';

    clearInterval(timeInterval);
    document.querySelector('#elapsedTime').textContent = '00:00';
}

function checkWin(){
    for(let i = 0; i < n; i++){
        for(let j = 0; j < n; j++){
            let cell = table.rows[i].cells[j];
            let name = cell.className.split(' ')[0];
            let track = cell.className.split(' ')[1];
            if(!validTile(track, name, i, j)){
                return false;
            }
        }
    }
    const winScreen = document.querySelector('.winScreenContainer');
    const gameScreen = document.querySelector('.gameScreenContainer');
    const congratsText = document.querySelector('#congratsText');
    const userName = document.querySelector('#nameInput').value;
    const finalTime = document.querySelector('#elapsedTime').textContent;

    congratsText.textContent = `gratulálok ${userName}! nyertél!`;
    document.querySelector('#winTime').textContent = finalTime;
    winScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    leaderBoard();
}

function leaderBoard(){
    const userName = document.querySelector('#nameInput').value;
    const leaderBoard = document.querySelector('#leaderBoard');
    const difficulty = document.querySelector('#diffSelect').value;
    let diffText = difficulty === '5' ? 'Könnyű' : 'Nehéz';

    leaderBoard.innerHTML += `<li>${userName} - ${document.querySelector('#winTime').textContent} - ${diffText}</li>`;
    

    let leaderboardItems = Array.from(leaderBoard.querySelectorAll('li'));
    leaderboardItems.sort((a, b) => {
        let timeA = a.textContent.split(' - ')[1];
        let timeB = b.textContent.split(' - ')[1];
        return timeA.localeCompare(timeB);
    });
    leaderBoard.innerHTML = '';
    leaderboardItems.forEach(item => leaderBoard.appendChild(item));
}

function validTile(track, name, i, j) {
    if(name === 'oasis'){
        return true;
    }
    if(track === 'noTrack'){
        return false;
    }
    switch(track){
        case 'straight_horizontal': case 'hor_bridge_rail':
            return connectRight(i, j - 1) && connectLeft(i, j + 1);

        case 'straight_vertical': case 'ver_bridge_rail':
            return connectUp(i + 1, j) && connectDown(i - 1, j);

        case 'curve_right_down': case 'mnt_right_down_rail':
            return connectLeft(i, j + 1) && connectUp(i + 1, j);

        case 'curve_right_up': case 'mnt_right_up_rail':
            return connectLeft(i, j + 1) && connectDown(i - 1, j);

        case 'curve_left_down': case 'mnt_left_down_rail':
            return connectRight(i, j - 1) && connectUp(i + 1, j);

        case 'curve_left_up': case 'mnt_left_up_rail':
            return connectRight(i, j - 1) && connectDown(i - 1, j);
    }
}

function connectRight(i, j){
    if(i >= n || i < 0 || j >= n || j < 0){
        return false;
    }
    let cell = table.rows[i].cells[j];
    let trackName = cell.className.split(' ')[1];
    if(trackName === 'noTrack'){
        return false;
    }
    if(trackName === 'straight_horizontal' || trackName === 'hor_bridge_rail' || trackName === 'curve_right_down' || trackName === 'curve_right_up' || trackName === 'mnt_right_down_rail' || trackName === 'mnt_right_up_rail'){
        return true;
    }
    return false;
}

function connectLeft(i, j){
    if(i >= n || i < 0 || j >= n || j < 0){
        return false;
    }
    let cell = table.rows[i].cells[j];
    let trackName = cell.className.split(' ')[1];
    if(trackName === 'noTrack'){
        return false;
    }
    if(trackName === 'straight_horizontal' || trackName === 'hor_bridge_rail' || trackName === 'curve_left_down' || trackName === 'curve_left_up' || trackName === 'mnt_left_down_rail' || trackName === 'mnt_left_up_rail'){
        return true;
    }
    return false;
}

function connectUp(i, j){
    if(i >= n || i < 0 || j >= n || j < 0){
        return false;
    }
    let cell = table.rows[i].cells[j];
    let trackName = cell.className.split(' ')[1];
    if(trackName === 'noTrack'){
        return false;
    }
    if(trackName === 'straight_vertical' || trackName === 'ver_bridge_rail' || trackName === 'curve_left_up' || trackName === 'curve_right_up' || trackName === 'mnt_left_up_rail' || trackName === 'mnt_right_up_rail'){
        return true;
    }
    return false;
}

function connectDown(i, j){
    if(i >= n || i < 0 || j >= n || j < 0){
        return false;
    }
    let cell = table.rows[i].cells[j];
    let trackName = cell.className.split(' ')[1];
    if(trackName === 'noTrack'){
        return false;
    }
    if(trackName === 'straight_vertical' || trackName === 'ver_bridge_rail' || trackName === 'curve_left_down' || trackName === 'curve_right_down' || trackName === 'mnt_left_down_rail' || trackName === 'mnt_right_down_rail'){
        return true;
    }
    return false;
}

window.onload = init;

import { tiles } from './tiles.js';
import { easyLevels } from './easyLevels.js';
import { hardLevels } from './hardLevels.js';

/* 
1 - empty
2 - oasis
3 - horizontal bridge
4 - vertical bridge
5 - left-down mountain
6 - left-up mountain
7 - right-down mountain
8 - right-up mountain
*/