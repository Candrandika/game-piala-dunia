// get html element
var game = document.getElementById("game");
var ctx = game.getContext('2d');
var home = document.getElementById("home");
var v_timer = document.getElementById("timer");
var team_image = document.getElementById("team-image");
var pause = document.getElementById('pause');
var paused = document.getElementById('paused');
var end = document.getElementById('end');
var end_text = document.getElementById('end-text');
var v_score = document.getElementById('score');
var v_loading = document.getElementById('loading');
game.width = 500;
game.height = 700;

var isPlay = false;
var point_sfx = new Audio('./assets/sfx/point.wav');
var over_sfx = new Audio('./assets/sfx/over.wav');

document.addEventListener('mousemove', mouse);
// document.addEventListener('mousedown', main);
// document.addEventListener('keydown', main);

var loadTime;
var load;
var timer;
var play;
var maxPlayTime = 300;
var playTime = maxPlayTime;
var minute = countMinute(playTime);
var second = countSecond(playTime);
var pScore = 0;
var cScore = 0;
var ps = 10; //speed of the puck
var xs = 0;
var ys = 0;

// variable for store data on pause
var pPlayerX;
var pPlayerY;
var pComputerX;
var pComputerY;
var pPuckX;
var pPuckY;

// Object for the puck
var puck = {
    x: game.width/2,
    y: game.height/2,
    r: 20,
    sa: 0,
    ea: Math.PI*2,
    c: 'transparent',
    fc: 'orange',
    lw: 3
};
// Object for the player
var player = {
    team: '',
    x: game.width/2,
    y: game.height/2+300,
    r: 25,
    sa: 0,
    ea: Math.PI*2,
    c: 'transparent',
    fc: 'lime',
    lw: 3
};
// Object for the computer
var computer = {
    team: '',
    x: game.width/2,
    y: game.height/2-300,
    r: 25,
    sa: 0,
    ea: Math.PI*2,
    c: 'transparent',
    fc: 'red',
    lw: 3
};

// select
var select = document.getElementById('my-team');
var teams = ["argentina", "australia", "belgium", "brazil", "cameroon", "canada", "costarica", "croatia", "denmark", "ecuador", "england", "france", "germany", "ghana", "iran", "japan", "mexico", "morocco", "netherlands", "poland", "portugal", "qatar", "saudi_arabia", "senegal", "serbia", "south_korea", "spain", "switzerland", "tunisia", "united_states", "uruguay", "wales"];
var team;
var comp;
select.onchange = function() {
    player.team = select.value;
    if(select.value) {
        team_image.src = 'assets/team/'+select.value+'.png';
    } else {
        team_image.src = 'assets/team/team.png';
    }
    computer.team = teams[randTeam()];
    // console.log(player.team, teams[computer.team)
}

function randTeam() {
    var rand = Math.floor(Math.random() * teams.length);
    if(teams[rand] == player.team) return randTeam();
    else return rand;
}

function init(){
    if(select.value) {
        //set display
        game.style.display = 'block';
        home.style.display = 'none';
        pause.className = '';
        setup()
    } else {
        alert('Please select team before play!')
    }
}

// main(); //run the main function
function setup()
{
    background();
    //ball
    var ball = document.getElementById('ball');
    drawRoundImage(ball, puck.x, puck.y, puck.r);
    //comp
    var comp = document.getElementById(computer.team);
    drawRoundImage(comp, computer.x, computer.y, computer.r);
    //comp
    var playe = document.getElementById(player.team);
    drawRoundImage(playe, player.x, player.y, player.r);

    loading();
}

function loading() {
    isPlay = false;
    v_loading.className = "";
    loadTime = 3;
    v_loading.innerHTML = loadTime;
    load = setInterval(countLoad, 999);
}

function countLoad() {
    loadTime--;
    v_loading.innerHTML = loadTime;
    if (loadTime <= 0) {
        isPlay = true;
        v_loading.className = "disabled";
        clearInterval(load);
        main();
    }
}

function main()
{
    v_timer.innerHTML = 'Timer    '+minute+':'+second;
    timer = setInterval(countDown, 999)
    play = setInterval(update, 5);
}

function countDown() {
    playTime--;
    minute = countMinute(playTime);
    second = countSecond(playTime);
    v_timer.innerHTML = 'Timer    '+minute+':'+second;
    if(playTime <= 0) {
        endGame();
    }
}

function update()
{
    background();
    //ball
    var ball = document.getElementById('ball');
    drawRoundImage(ball, puck.x, puck.y, puck.r);
    //comp
    var comp = document.getElementById(computer.team);
    drawRoundImage(comp, computer.x, computer.y, computer.r);
    //comp
    var playe = document.getElementById(player.team);
    drawRoundImage(playe, player.x, player.y, player.r);
    logic();
}

// Drawing function
function background()
{
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, game.width, game.height);
    drawRectangles(game.width/2-75, 5, 150, 60, 'white', 3)
    drawRectangles(game.width/2-125, 5, 250, 130, 'white', 3)
    drawRectangles(game.width/2-75, game.height-65, 150, 60, 'white', 3)
    drawRectangles(game.width/2-125, game.height-135, 250, 130, 'white', 3)
    drawLines(0, game.height/2, 500, game.height/2, 'white', 5);
    drawLines(0, game.height/2, 0, 0, 'white', 10);
    drawLines(0, 0, 200, 0, 'white', 10);
    drawLines(game.width, game.height/2, game.width, 0, 'white', 10);
    drawLines(game.width, 0, 300, 0, 'white', 10);
    drawLines(0, game.height/2, 0, game.height, 'white', 10);
    drawLines(0, game.height, 200, game.height, 'white', 10);
    drawLines(game.width, game.height/2, game.width, game.height, 'white', 10);
    drawLines(game.width, game.height, 300, game.height, 'white', 10);
    drawCircles(game.width/2, game.height/2, 50, 0, Math.PI*2, 'white', 'transparent', 3);
    // dot
    drawCircles(game.width/2, game.height/2, 3, 0, Math.PI*2, 'white', 'white', 3); 
    drawCircles(game.width/2, game.height/7, 3, 0, Math.PI*2, 'white', 'white', 3); 
    drawCircles(game.width/2, game.height - game.height/7, 3, 0, Math.PI*2, 'white', 'white', 3); 

    drawCircles(game.width/2, 135, 50, 0, Math.PI, 'white', 'transparent', 3); 
    drawCircles(game.width/2, game.height-135, 50, Math.PI, 0, 'white', 'transparent', 3);
    drawCircles(0, 0, 25, 0, Math.PI*2, 'white', 'transparent', 3);
    drawCircles(game.width, 0, 25, 0, Math.PI*2, 'white', 'transparent', 3);
    drawCircles(0, game.height, 25, 0, Math.PI*2, 'white', 'transparent', 3);
    drawCircles(game.width, game.height, 25, 0, Math.PI*2, 'white', 'transparent', 3);
    drawRectangles(game.width/2-50, -45, 100, 50, 'white', 3);
    drawRectangles(game.width/2-50, game.height-5, 100, 50, 'white', 3);
    drawScore(pScore, 10, game.height/2+50, 'white');
    drawScore(cScore, 10, game.height/2-15, 'white');
}

function drawLines(x, y, xt, yt, color, lwidth) // start x, start y, end x, end y, color, line width
{
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xt, yt);
    ctx.strokeStyle = color;
    ctx.lineWidth = lwidth;
    ctx.stroke();
    ctx.closePath();
}

function drawCircles(x, y, radius, sAngle, eAngle, color, fcolor, lwidth) // start x, start y, radius, start angle, end angle, border color, fill color, line width
{
    ctx.beginPath();
    ctx.arc(x, y, radius, sAngle, eAngle);
    ctx.strokeStyle = color;
    ctx.fillStyle = fcolor;
    ctx.lineWidth = lwidth;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function drawRectangles(x, y, w, h, color, lwidth) // start x, start y, width, height, color, line width
{
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lwidth;
    ctx.strokeRect(x, y, w, h);
    ctx.closePath();
}

function drawScore(text, x, y, color)
{
    ctx.font = '50px sans-serif';
    ctx.strokeStyle = color;
    ctx.strokeText(text, x, y);
}

function drawRectImage(img, x, y, width, height)
{
    ctx.drawImage(img, x, y, width, height)
}

function drawRoundImage(img, x, y, radius)
{
    ctx.save()
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fill();
    ctx.clip();
    ctx.drawImage(img, x-radius, y-radius, 2*radius, 2*radius)
    ctx.restore();
}

function drawText(text, x, y, color)
{
    ctx.font = '50px sans-serif';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

//controller
function mouse(e)
{
    var mouse_x = e.clientX - (game.offsetLeft);
    var mouse_y = e.clientY - (game.offsetTop);

    if(mouse_x > 30 && mouse_x < game.width-30) {
        player.x = mouse_x;
    } else if(mouse_x <= 30) {
        player.x = 30
    } else if(mouse_x >= game.width-30) {
        player.x = game.width-30
    }
    if(mouse_y > game.height/2+30 && mouse_y < game.height-30) {
        player.y = mouse_y;
    } else if(mouse_y <= game.height/2+30) {
        player.y = game.height/2+30;
    } else if(mouse_y >= game.height-30) {
        player.y = game.height-30
    }
}

//calculation
function logic()
{
    // WALL LOGIC
    // center
    var centerX = game.width/2;
    var centerY = game.height/2;
    // left wall
    if((puck.x + xs) < (puck.r + 10)) {
        if(puck.x < -10) {
            return resetOnGoal(centerX, centerY);
        }
        var bounce_sfx = new Audio('./assets/sfx/bonce.mp3');
        bounce_sfx.play();
        xs *= -1;
    }
    // right wall
    if((puck.x + xs) > (game.width - puck.r + 10)) {
        if(puck.x > game.width+10) {
            return resetOnGoal(centerX, centerY);
        }
        var bounce_sfx = new Audio('./assets/sfx/bonce.mp3');
        bounce_sfx.play();
        xs *= -1;
    }
    // top wall
    if((puck.y + ys) < (puck.r - 10)) {
        if(puck.y < -10) {
            return resetOnGoal(centerX, centerY)
        }
        var bounce_sfx = new Audio('./assets/sfx/bonce.mp3');
        bounce_sfx.play();
        ys *= -1;
    }
    // bottom wall
    if((puck.y + ys) > (game.height - puck.r + 10)) {
        if(puck.y > game.height+10) {
            return resetOnGoal(centerX, centerY);
        }
        var bounce_sfx = new Audio('./assets/sfx/bonce.mp3');
        bounce_sfx.play();
        ys *= -1;
    }

    // GOAL LOGIC
    var goalX = (game.width-100)/2;
    if(puck.x > goalX && puck.x < goalX + 100) {
        if(puck.y < 30) {
            point_sfx.play();
            pScore++;
            px = game.width/2;
            py = game.height/2 - 30;
            resetOnGoal(px, py);
        }
        if(puck.y > game.height-30) {
            over_sfx.play();
            cScore++;
            px = game.width/2;
            py = game.height/2 + 30;
            resetOnGoal(px, py);
        }
    }

    // COMPUTER AUTO
    if(puck.y <= game.height/2) {
        if(puck.y - 20 > computer.y) {
            computer.y += 1.5;
        } else if(puck.y + 20 < computer.y) {
            computer.y -= 1.5;
        }
        if(puck.x - 20 > computer.x) {
            computer.x += 1.5;
        } else if(puck.x + 20 < computer.x) {
            computer.x -= 1.5;
        }
    } else if(puck.y > game.height/2) {
        if(computer.x < puck.x) {
            computer.x += 1.5;
        } else if(computer.x > puck.x) {
            computer.x -= 1.5;
        }
        if(computer.y < 50) {
            computer.y += 2;
        } else if(computer.y > 50) {
            computer.y -= 2;
        }
    }


    // PLAYER / COMPUTER BOUNCE LOGIC
    var computerDistance = calculateDistance(computer.x, computer.y, puck.x, puck.y);
    var playerDistance = calculateDistance(player.x, player.y, puck.x, puck.y);

    if(computerDistance < 45) {
        var compTempX = puck.x - computer.x;
        var compTempY = puck.y - computer.y;
        compTempX/=45;
        compTempY/=45;
        xs = compTempX*ps;
        ys = compTempY*ps;
        var bounce_sfx = new Audio('./assets/sfx/bonce.mp3');
        bounce_sfx.play();
    }
    if(playerDistance < 45) {
        var playerTempX = puck.x - player.x;
        var playerTempY = puck.y - player.y;
        playerTempX/=45;
        playerTempY/=45;
        xs = playerTempX*ps;
        ys = playerTempY*ps;
        var bounce_sfx = new Audio('./assets/sfx/bonce.mp3');
        bounce_sfx.play();
    }
    
    puck.x += xs;
    puck.y += ys;

    xs *= 0.99;
    ys *= 0.99;

    // store data for pause
    pPlayerX = player.x;
    pPlayerY = player.y;
    pComputerX = computer.x;
    pComputerX = computer.x;
    pPuckY = puck.y;
    pPuckY = puck.y;
}

function calculateDistance(mx, my, px, py)
{
    //a^2 + b^2 = c^2
    var sqx = Math.pow((px-mx), 2);
    var sqy = Math.pow((py-my), 2);
    var sqrt = Math.sqrt(sqx+sqy);
    return sqrt;
}

function resetOnGoal(px, py)
{
    puck.x = px;
    puck.y = py;
    xs = 0;
    ys = 0;
    player.x = game.width/2;
    player.y = game.height/2+300;
    computer.x = game.width/2;
    computer.y = game.height/2-300;
}
function onPause() {
    pause.className = 'disabled';
    paused.className = '';
    player.x = pPlayerX;
    player.y = pPlayerY;
    computer.x = pComputerX;
    computer.x = pComputerX;
    puck.y = pPuckY;
    puck.y = pPuckY;
    clearInterval(timer);
    clearInterval(play);
}
function resumePause() {
    pause.className = '';
    paused.className = 'disabled';
    loading()
}
function restartPause() {
    pause.className = '';
    paused.className = 'disabled';
    // reset score
    pScore = 0;
    cScore = 0;
    // reset position
    puck.x = game.width/2;
    puck.y = game.height/2;
    player.x = game.width/2;
    player.y = game.height/2+300;
    computer.x= game.width/2;
    computer.y = game.height/2-300;
    xs = 0;
    ys = 0;
    // reset timer
    playTime = maxPlayTime;
    minute = countMinute(playTime);
    second = countSecond(playTime);
    v_timer.innerHTML = 'Timer    '+minute+':'+second;
    setup()
}

function endGame() {
    v_score.innerHTML = pScore+' : '+cScore;
    end.className = '';
    pause.className = 'disabled';
    
    clearInterval(timer);
    clearInterval(play);
    if(pScore < cScore) {
        end_text.innerHTML = 'You Lose!'
    } else if(pScore == cScore) {
        end_text.innerHTML = 'Draw!'
    } else {
        end_text.innerHTML = 'You Win!'
    }
    // reset score
    pScore = 0;
    cScore = 0;
    // reset position
    puck.x = game.width/2;
    puck.y = game.height/2;
    player.x = game.width/2;
    player.y = game.height/2+300;
    computer.x= game.width/2;
    computer.y = game.height/2-300;
    // reset timer
    playTime = maxPlayTime;
}
function outGame() {
    v_timer.innerHTML = 'Enjoy the game!';
    end.className = 'disabled';
    game.style.display = 'none';
    home.style.display = 'flex';
}

function countMinute(t) {
    var min = Math.floor(t / 60);
    if(min < 10) {
        return '0'+min;
    } else {
        return min;
    }
}

function countSecond(t) {
    var sec = t % 60;
    if(sec < 10) {
        return '0'+sec;
    } else {
        return sec;
    }
}