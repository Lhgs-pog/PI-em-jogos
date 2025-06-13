/*TELA DE JOGO*/
    // Criação da tela e contexto
    const canvas = document.getElementById("tela-jogo");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;


    function clear(){
        ctx.clearRect(0,0, canvas.width, canvas.height)
    }

    /**
     * Coloca as estruturas dentro da fase
     */
    function drawEstructure(){
        ctx.save()
        ctx.fillRect(plataforma.x, plataforma.y, plataforma.width, plataforma.height)
        ctx.restore()
    }

    const fundo = new Image()
    fundo.src = "imagens/fundo.jpeg"

    function drawBackground(){
        ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height)
    }

    function drawPlayerAtack(){

        if(!atackP.active) return
        
         //Salva estado atual do contexto
         ctx.save();

         //Controla a direção que o player olha
         if (player.looking === "left") {
            ctx.translate(atackP.x + atackP.width, atackP.y)
            ctx.scale(-1,1)
            ctx.drawImage(atackP.image, 0, 0, atackP.width, atackP.height);
        } else {
            // Desenha a imagem normalmente para a direita
            ctx.drawImage(atackP.image, atackP.x, atackP.y, atackP.width, atackP.height);
        }
 
         //Retorna para o contexto salvo após fazer essass alterações
         ctx.restore();
    }

    function drawPlayerHealthBar() {

        ctx.save()
        // Fundo da barra de vida (vermelho)
        ctx.fillStyle = 'red';
        ctx.fillRect(20, 20, 300, 30); // Posição x, y, Largura, Altura

        // Barra de vida atual (verde)
        const healthBarWidth = (player.hp / player.maxHp) * 300;
        ctx.fillStyle = 'green';
        ctx.fillRect(20, 20, healthBarWidth, 30);
        
        // Contorno da barra
        ctx.strokeStyle = 'black';
        ctx.strokeRect(20, 20, 300, 30);

        // Texto da vida
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`HP: ${player.hp} / 100`, 25, 43);

        ctx.restore()
    }

    let listaDeInimigos = [];

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    function criarNovoInimigo() {

        let number = getRandomInt(1,4)

        let hp, speed, tipo;

        switch(number){
            case 1: //ram
                tipo = "ram"
                hp = 100
                speed = 5
                break;
            case 2: //hd
                tipo = "hd"
                hp = 500
                speed = 2
                break;
            case 3: //fan
                tipo = "fan"
                hp = 300
                speed = 3
                break;
        }
        const novoInimigo = new Enemy({
            tipo: tipo,
            hp: hp,
            speed: speed,
            pulos: 0,
            sprites: enemySprites
        });
        listaDeInimigos.push(novoInimigo);
        console.log("inimigo criado")
    }

    function removerInimigosMortos() {
        listaDeInimigos = listaDeInimigos.filter(inimigo => inimigo.hp > 0);
    }
    
/*ATACKES*/
    const atackP = {
        //Atributos
        damage: 100,
        //Tamanho
        height: 200,
        width: 200,
        //Posição
        x: 0,
        y: 0,
        //Estado
        active: false,
        duration: 100,
        //Imagem
        image: new Image()
    }
    atackP.image.src="imagens/atack-espada.png"

    function playerAtack(){
        //Impede de spawn de ataque
        if(Date.now() - tempoAtk < 500) return
        tempoAtk = Date.now()

        //Determina a posição do atack
        if(player.looking === "right"){
            atackP.x = player.x + player.width
        }else{
            atackP.x = player.x - atackP.width
        }
        atackP.y = player.y + (player.height/2 - atackP.height/2)//Determina altura
        atackP.active = true

        //Verifica se cada ataque acertou os inimigos
        for (const inimigo of listaDeInimigos) {
        if (checarColisao(atackP, inimigo)) {
            inimigo.tookDamage = true;
            inimigo.hp -= atackP.damage;

            // O timeout para o efeito de dano deve ser aplicado ao inimigo específico
            setTimeout(() => {
                inimigo.tookDamage = false;
            }, 200);
        }
    }

        //Permite o ataque ser precionado novamente
        setTimeout( () => {
            atackP.active = false
        }, atackP.duration)
    }

    /**
     * Verifica se o inimigo está dentro do ataque
     */
    function checarColisao(rect1, rect2){
        return (
            rect1.x < rect2.x + rect2.width && //Entre a esquerda
            rect1.x + rect1.width > rect2.x && //Entre a direita
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y 
        );
    }
    
/*ENTIDADES*/
    /*SPRITE*/
        class Sprite{
            
            constructor({ x, y, imageSrc, scale = 1, framesMax = 1, sprites }) {
                this.x = x;
                this.y = y;
                this.scale = scale;
                this.framesMax = framesMax;
                this.sprites = sprites; // Objeto com todas as animações
        
                this.image = new Image();
                this.image.src = imageSrc;
        
                // Propriedades internas de controle de animação
                this.framesCurrent = 0; // O quadro atual da animação
                this.framesElapsed = 0; // Quadros do jogo que se passaram
                this.framesHold = 7;    // A cada quantos quadros do jogo a animação muda (velocidade)
                this.width = 0;
                this.height = 0;
        
                // Quando a imagem carregar, definimos a largura e altura do sprite
                this.image.onload = () => {
                    this.spriteWidth = this.image.width / this.framesMax;
                    this.spriteHeight = this.image.height; 
                    this.width = this.spriteWidth * this.scale;
                    this.height = this.spriteHeight * this.scale;
                };
        
                // Define a animação inicial
                for (const sprite in this.sprites) {
                    this.sprites[sprite].image = new Image();
                    this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
                }
            }

            // Método para desenhar o sprite na tela
            draw() {
                if (!this.image.complete) return; // Não desenha se a imagem não carregou

                const sx = this.framesCurrent * this.spriteWidth;
                // A linha Y é determinada pela animação atual, que define a imagem
                // Não precisamos mais de frameY aqui porque cada animação tem sua própria imagem/spritesheet
                const sy = 0;

                ctx.drawImage(
                    this.image,
                    sx,
                    sy,
                    this.spriteWidth,
                    this.spriteHeight,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            }

            // Método para avançar os frames da animação
            updateAnimation() {
                this.framesElapsed++;

                if (this.framesElapsed % this.framesHold === 0) {
                    if (this.framesCurrent < this.framesMax - 1) {
                        this.framesCurrent++;
                    } else {
                        this.framesCurrent = 0;
                    }
                }
            }

            update(){
                this.draw()
                this.updateAnimation()
            }

            
        }

    /*JOGADOR*/
    // Criação do jogador e suas caracteristicas

        class Player extends Sprite{
            
            constructor({hp,speed,pulos, sprites}){

                super({
                    x: 100,
                    y: canvas.height - 50,
                    imageSrc: sprites.idle.imageSrc,
                    scale: 1.0,
                    framesMax: sprites.idle.framesMax,
                    sprites
                })

                this.image.width=50
                this.image.height=50

                this.isInvincible = false
                this.invincibilityDuration = 1500

                this.hp=hp
                this.speed=speed
                this.pulos= pulos
                this.state="ground"
                this.looking="left"
                this.vx = 0
                this.vy - 0
            }

            playerAtack(){
                //Impede de spawn de ataque
                if(Date.now() - tempoAtk < 500) return
                tempoAtk = Date.now()
        
                //Determina a posição do atack
                if(this.looking === "right"){
                    atackP.x = this.x + this.width
                }else{
                    atackP.x = this.x - atackP.width
                }
                atackP.y = this.y + (this.height/2 - atackP.height/2)//Determina altura
                atackP.active = true
        
                //Verifica se cada ataque acertou os inimigos
                for (const inimigo of listaDeInimigos) {
                if (checarColisao(atackP, inimigo)) {
                    inimigo.tookDamage = true;
                    inimigo.hp -= atackP.damage;
        
                    // O timeout para o efeito de dano deve ser aplicado ao inimigo específico
                    setTimeout(() => {
                        inimigo.tookDamage = false;
                    }, 200);
                }
            }
        
                //Permite o ataque ser precionado novamente
                setTimeout( () => {
                    atackP.active = false
                }, atackP.duration)
            }

            VerificarChao(){

                //Controle de status
                let nochao = false;
        
                //Verifica se o player está no chão
                if(this.y >= canvas.height - this.height && this.pulos < 2){
                    this.pulos = 2;
                    this.state = "ground";
                    nochao = true;
                }
                
                //Simplificar a condição
                const estaNaLargura =
                //Se ele está dentro da esquerda
                this.x + this.width > plataforma.x &&
                 //Se ele está dentro da direita
                 this.x < plataforma.x + plataforma.width;
        
        
                const estaNoTopo =
                //Se está em cima da plataforma 
                this.y + this.height >= plataforma.y && 
                //Se passou um pouquinho do topo da plataforma
                this.y + this.height <= plataforma.y + 10; // Pequena margem de erro e 10px
        
                 //Passa por cada plataforma dentro de plataformas
                 plataformas.forEach(plataforma => {
                    //Verifica se o player está emcima de uma plataforma
                    if (estaNaLargura && estaNoTopo && this.vy >= 0) {
                        this.pulos = 2;
                        this.state = "ground";
                        this.y = plataforma.y - this.height;
                        this.vy = 0;
                        nochao = true
                    }
                 });
        
                //Muda o status do player
                if(nochao == false)this.state = "air";
        
                return
        
            }

            VerificarPulo(){
                //Se tiver passado 0.5 segundos e o player ainda tiver pulos
                if(Date.now() - tempoPulo > 300 && this.pulos > 0){
                    this.pulos -= 1;
                    return true;
                }
        
                //Primeiro pulo
                if (this.pulos == 2){
                    this.pulos -= 1;
                    return true;
                }
        
                //Sem pulos restantes
                return false;
            }

            update(){
                const gravidade = 0.96; //Velocidade da gravidade

            
                this.vx = 0; //Velocidade do personagem no eixo x

                if(this.state === "air"){
                    this.vy += gravidade; //Aplica gravidade gradualmente
                } else {
                    this.vy = 0;//Remove velocidade se o player estiver no chão
                }

                //Faz o personagem ir para frente
                if(keys["ArrowRight"] || keys["KeyD"]){
                    this.vx = this.speed;
                    if(this.looking == "left"){
                        this.looking = "right";
                        
                    }
                }

                //Faz o personagem ir para trás
                if(keys["ArrowLeft"] || keys["KeyA"]){
                    this.vx = -this.speed;
                    if(this.looking == "right"){
                        this.looking = "left";
                    }
                }

                //Faz o personagem ir para cima
                if((keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) && this.VerificarPulo()){
                    this.vy = -this.speed * 1.5;
                    tempoPulo = Date.now();
                    this.state = "air";
                }

                //Verifica se faz mais que 0.3 segundos desde o pulo antes de cair
                if(Date.now() - tempoPulo > 300 && this.state === "air"){
                    this.vy = this.speed;
                }

                //Reseta os pulos e muda o status do player
                this.VerificarChao();

                if(keys["KeyF"]){
                    this.playerAtack()
                }
                
                //Movimenta o personagem
                this.x += this.vx;
                this.y += this.vy;

                
                //Impede o personagem de sair da tela
                if(this.x < 0) this.x = 0; //Impede de sair pela esquerda
                if(this.x + this.width > canvas.width) this.x = canvas.width - this.width; //Impede de sair pela direita
                if(this.y < 0) this.y = 0; //Impede de sair por cima
                if(this.y > canvas.height - this.height) this.y = canvas.height - this.height; //Impede de cair
                
                if (this.vx !== 0) {
                    this.switchSprite('run');
                } else {
                    this.switchSprite('idle');
                }

                super.update()

            }

            switchSprite(spriteName) {
                if (this.image === this.sprites[spriteName].image) return; // Já está na animação correta
        
                this.image = this.sprites[spriteName].image;
                this.framesMax = this.sprites[spriteName].framesMax;
                this.framesCurrent = 0; // Reinicia a animação
            }

            takeDamage() {
                // Se o jogador estiver invencível, não faz nada
                if (this.isInvincible) return;

                // Reduz a vida
                this.hp -= 10;
                
                // Garante que a vida não fique negativa
                if (this.hp < 0) {
                    this.hp = 0;
                }

                // Se a vida chegou a zero, fim de jogo
                if (this.hp === 0) {
                    this.handleDeath();
                } else {
                    // Ativa a invencibilidade
                    this.isInvincible = true;
                    // O jogador pisca ou muda de cor para mostrar que está invencível (opcional)
                    
                    // Desativa a invencibilidade após um tempo
                    setTimeout(() => {
                        this.isInvincible = false;
                    }, this.invincibilityDuration);
                }
            }
            
            handleDeath() {
                console.log("FIM DE JOGO");
                isGameOver = true; // (vamos criar essa variável global)
                showGameOverScreen();
            }

        }

        /*INIMIGOS*/
        class Enemy extends Sprite{

            constructor({tipo,hp,speed,pulos, sprites}){

                super({
                    x: canvas.width - 50,
                    y: canvas.height - 50,
                    imageSrc: sprites[tipo].imageSrc,
                    scale: 1.0,
                    framesMax: sprites[tipo].framesMax,
                    sprites
                });

                //Tipo
                this.tipo=tipo
                //Atributos
                this.hp=hp
                this.speed=speed
                this.pulos=pulos
                //Status
                this.state="ground"
                this.looking="right"
                this.dead=false
                this.tookDamage=false
                //Movimentação
                this.vx=0
                this.vy=0

            }

            AiMove(){
    
                const gravidade = 0.96;

                //Reset e gravidade
                this.vx = 0
                this.vy += gravidade
    
                //Direita
                if(player.x > this.x)
                    this.vx = this.speed
    
                //Esquerda
                if(player.x < this.x)
                    this.vx = - this.speed
    
                //Pulo
                if((player.y < this.y && this.y - player.y < this.height) && // Só entre umas altura específica
                (this.x - player.x <= 30 || this.x - player.x <= -30) && //Pula só perto, problema
                this.state == "ground") //Evita pulo infinito
                {
                    this.vy = - this.speed * 2
                    this.state = "air"
                    console.log("atv")
                }
    
                //Alteração plano cartesiano
                this.x += this.vx
                this.y += this.vy
    
                //Colisões
                if(this.x < 0) this.x = 0; //Impede de sair pela esquerda
                if(this.x + this.width > canvas.width) this.x = canvas.width - this.width; //Impede de sair pela direita
                if(this.y < 0) this.y = 0; //Impede de sair por cima
                if(this.y > canvas.height - this.height){
                    this.y = canvas.height - this.height
                    this.state = "ground"
                } //Impede de cair
    
            }

            update(player) {
                this.AiMove(player);
                super.update();
            }
        
            // O método switchSprite pode ser copiado do Player ou colocado na classe Sprite base
            switchSprite(spriteName) {
                if (this.image === this.sprites[spriteName].image) return;
                this.image = this.sprites[spriteName].image;
                this.framesMax = this.sprites[spriteName].framesMax;
                this.framesCurrent = 0;
            }

        }  

/*MAPA*/

    


    /*Plataformas*/
    const plataformas = [];

        //plataforma1
        const plataforma = {
            //Posição
            x: 100,
            y: canvas.height - 100,
            //Tamanho
            width: 300,
            height: 25,
            //Imagem
            image: new Image()
        };
        plataforma.image.src = "imagens/tijolo.jpg";

    //Adiciona as plataformas em plataformas
    plataformas.push(plataforma);


/*CONTROLE DE EVENTOS*/
    //Lista de teclas que estão sendo presionadass
    const keys = {};

    //Pulo e gravidade
    let tempoPulo = 0;
    let tempoAtk = 0;

    //Salva como verdadeira a tecla presionada
    document.addEventListener("keydown", (e) => {
        keys[e.code] = true;
    });

    //Salva como falsa a tecla que não está sendo presionada
    document.addEventListener("keyup", (e) => {
        keys[e.code] = false;
    });

    
    setInterval(criarNovoInimigo, 5000);

    function showGameOverScreen() {
        // Desenha um fundo preto semi-transparente
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Escreve a mensagem de Fim de Jogo
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('FIM DE JOGO', canvas.width / 2, canvas.height / 2);
    }

/*LOOP PRINCIPAL*/

    // Defina as animações para o player
    const playerSprites = {
        idle: {
            imageSrc: 'imagens/theo.png',
            framesMax: 6
        },
        run: {
            imageSrc: 'imagens/theo.png',
            framesMax: 6
        },
        jump: {
            imageSrc: 'imagens/poggers.webp',
            framesMax: 1
        }
    };

    const enemySprites = {
        hd: {
            imageSrc: 'imagens/hd.jpeg',
            framesMax: 6,
        },
        ram: {
            imageSrc: 'imagens/ram.jpeg',
            framesMax: 12,
        },
        fan: {
            imageSrc: 'imagens/fan.jpeg',
            framesMax: 7,
        },

    }

    let isGameOver = false;
    let lastTime =0
    const player = new Player({
        hp: 100,
        speed: 10,
        pulos: 2,
        sprites: playerSprites
    })

    /**
     * Atualiza a tela e mantém o loop
     */
    function gameLoop(timeStamp){

        if (isGameOver) {
            showGameOverScreen();
            return; 
        }

        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp

        clear()
        
        //Pecorre todos os inimigos da lista
        for (const enemy of listaDeInimigos) {
            enemy.AiMove();
        }
        
        drawBackground()
        player.update();
        for (const enemy of listaDeInimigos) {
            enemy.update(player);
            if (checarColisao(player, enemy)) {
                player.takeDamage(); 
            }
        }
        drawEstructure();
        drawPlayerAtack();
        drawPlayerHealthBar();

        removerInimigosMortos();

        requestAnimationFrame(gameLoop);
    }

console.log(`Altura: ${canvas.height}`)
console.log(`Largura: ${canvas.width}`)

//Inicia o loop
gameLoop();