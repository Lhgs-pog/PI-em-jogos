
//
const canvas = document.getElementById("tela-jogo");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const player = {
    x: 100,
    y: canvas.height * 0.8 -10,
    width: 100,
    height: 100,
    speed: 5,
    vx: 0,
    image: new Image()
}
player.image.src = "../poggers.webp";

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function update(){

    player.vx = 0;

    if(keys["ArrowRight"] || keys["KeyD"]){
        player.vx = player.speed;
    }

    if(keys["ArrowLeft"] || keys["KeyA"]){
        player.vx = -player.speed;
    }

    player.x += player.vx;

    if(player.x < 0) player.x = 0;
    if(player.x + player.width > canvas.width) player.x = canvas.width - player.width;

}

function draw(){

    ctx.clearRect(0,0 , canvas.width, canvas.height);

    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();