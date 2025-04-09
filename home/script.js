/*TELA DE JOGO*/
    // Criação da tela e contexto
    const canvas = document.getElementById("tela-jogo");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    /**
     * Limpa a tela antes de colocar o personagem na nova posição
     */
    function draw(){
        //Limpa a tela
        ctx.clearRect(0,0 , canvas.width, canvas.height);

        //Salva estado atual do contexto
        ctx.save();

        //Controla a direção que o player olha
        if (player.looking === "right") {
            // Translada para a posição correta para desenhar a imagem invertida
            ctx.translate(player.x + player.width, player.y);
            // Inverte o eixo x
            ctx.scale(-1, 1);
            // Desenha a imagem a partir da origem (0,0)
            ctx.drawImage(player.image, 0, 0, player.width, player.height);
        } else {
            // Desenha a imagem normalmente para a direita
            ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
        }

        //Retorna para o contexto salvo após fazer essass alterações
        ctx.restore();
    }

    /**
     * Coloca as estruturas dentro da fase
     */
    function drawEstructure(){
        ctx.drawImage(plataforma.image, plataforma.x, plataforma.y, plataforma.width, plataforma.height);
    }

    /**
     * Coloca os inimigos dentro da fase
     */
    function drawEnemy(){
        ctx.save()

        if(enemy.tookDamage){
            ctx.filter = "brightness(150%)"
        }
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.restore()
    }

    /**
     * Coloca os projeteis dentro da fase
     */
    function drawProjectile(){

    }

    function drawPlayerAtack(){

        if(!atackP.active) return
        
         //Salva estado atual do contexto
         ctx.save();

         //Controla a direção que o player olha
         if (player.looking === "right") {
            ctx.drawImage(atackP.image, atackP.x, atackP.y, atackP.width, atackP.height);
        } else {
            // Desenha a imagem normalmente para a direita
            ctx.drawImage(atackP.image, atackP.x, atackP.y, atackP.width, atackP.height);
        }
 
         //Retorna para o contexto salvo após fazer essass alterações
         ctx.restore();
    }
    
/*ATACKES*/
    const atackP = {
        //Atributos
        damage: 100,
        //Tamanho
        height: 150,
        width: 150,
        //Posição
        x: 0,
        y: 0,
        //Estado
        active: false,
        duration: 100,
        //Imagem
        image: new Image()
    }
    atackP.image.src="imagens/atackPlayer.png"

    function playerAtack(){
        //Impede de spawn de ataque
        if(Date.now() - tempoAtk < 500) return
        tempoAtk = Date.now()

        //Determina a posição do atack
        if(player.looking = "right"){
            atackP.x = player.x + player.width
        }else{
            atackP.x = player.x - atackP.width
        }
        atackP.y = player.y + (player.height/2 - atackP.height/2)//Determina altura
        atackP.active = true

        //Verifica colisão e diminui o hp do inimigo
        if(checarColisao(atackP, enemy)){
            enemy.tookDamage = true
            enemy.hp -= atackP.damage
            if(enemy.hp <= 0) enemy.dead = true

            setTimeout( () => {
                enemy.tookDamage = false
            }, 200)
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
    /*JOGADOR*/
    // Criação do jogador e suas caracteristicas
        const player = {
            //tamanho
            width: 50,
            height: 50,
            //posições
            x: 100,
            y: canvas.height - 50,
            //atributos
            hp: 100,
            speed: 10,
            pulos: 2,
            //Status
            state: "ground",
            looking: "left",
            //movimentação
            vx: 0,
            vy: 0,
            //imagem
            image: new Image()
        }
        //Adiciona a imagem ao jogador
        player.image.src = "imagens/poggers.webp";


        /*INIMIGOS*/
        const enemy = {
            //Tamanho
            width: 50,
            height: 50,
            //Posições
            x: canvas.width - 50,
            y: canvas.height - 50,
            //Atributos
            hp: 500,
            speed: 6,
            pulos: 0,
            //Status
            state: "ground",
            looking: "right",
            dead: false,
            tookDamage: false,
            //Movimentação
            vx: 0,
            vy: 0,
            //Imagem
            image: new Image()
        };
        enemy.image.src = "imagens/not_poggers.jpg";
        
/*INTELIGÊNCIA ARTIFICIAL*/
    /*Movimentação*/
    function AiMove(gravidade){

        //Reset e gravidade
        enemy.vx = 0
        enemy.vy += gravidade

        //Direita
        if(player.x > enemy.x)
            enemy.vx = enemy.speed

        //Esquerda
        if(player.x < enemy.x)
            enemy.vx = -enemy.speed

        //Pulo
        if((player.y < enemy.y && enemy.y - player.y < enemy.height) && // Só entre umas altura específica
        (enemy.x - player.x <= 30 || enemy.x - player.x <= -30) && //Pula só perto, problema
        enemy.state == "ground") //Evita pulo infinito
        {
            enemy.vy = -enemy.speed * 2
            enemy.state = "air"
            console.log("atv")
        }

        //Alteração plano cartesiano
        enemy.x += enemy.vx
        enemy.y += enemy.vy

        //Colisões
        if(enemy.x < 0) enemy.x = 0; //Impede de sair pela esquerda
        if(enemy.x + enemy.width > canvas.width) enemy.x = canvas.width - enemy.width; //Impede de sair pela direita
        if(enemy.y < 0) enemy.y = 0; //Impede de sair por cima
        if(enemy.y > canvas.height - enemy.height){
            enemy.y = canvas.height - enemy.height
            enemy.state = "ground"
        } //Impede de cair

        //console.log(`ex ${enemy.x}  ; ey ${enemy.y}  ; px ${player.x} ; py ${player.y}`)
    }

/*MAPA*/

    function drawMapa(){

        const tileW = 50
        const tileH = 50

        const mapW = 500
        const mapH = 500

        var currentSeconds =0, frameCount =0, framesLastSeconds =0

        var gameMap =[
            0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
            0 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 0 ,
            0 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 0 ,
            0 , 1 , 0 , 0 , 0 , 1 , 1 , 1 , 0 ,
            0 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 0 ,
            0 , 1 , 1 , 1 , 1 , 1 , 1 , 0 , 0 ,
            0 , 0 , 1 , 1 , 1 , 1 , 0 , 0 , 0 ,
            0 , 0 , 0 , 1 , 1 , 1 , 1 , 1 , 0 ,
            0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
        ]

        var sec = Math.floor(Date.now / 1000) //Usado para manter o rastro do framerate

        if(sec!=currentSeconds) {
            currentSeconds = sec
            framesLastSeconds = frameCount
            frameCount = 1
        } else {
            frameCount++
        }

        for(var y; y < mapW; y++){

            for(var x; x < mapH; x++){

                switch(gameMap[((y*mapW) + x )]){
                    case 0:
                        ctx.fillStyle = "#999999"
                        break;
                    default:
                        ctx.fillStyle = "#eeeeee"
                }

                ctx.fillRect(x*tileW, y*tileH, tileW, tileH)
            }
        }
        ctx.fillStyle = "#ff0000"
        ctx.fillText("FPS: " + framesLastSeconds, 10, 20)

        requestAnimationFrame(drawMApa)
    }


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

    /**
     * Verifica se o player está emcima de alguma plataforma ou do chão
     */
    function VerificarChao(){

        //Controle de status
        let nochao = false;

        //Verifica se o player está no chão
        if(player.y >= canvas.height - player.height && player.pulos < 2){
            player.pulos = 2;
            player.state = "ground";
            nochao = true;
        }
        
        //Simplificar a condição
        const estaNaLargura =
        //Se ele está dentro da esquerda
         player.x + player.width > plataforma.x &&
         //Se ele está dentro da direita
          player.x < plataforma.x + plataforma.width;


        const estaNoTopo =
        //Se está em cima da plataforma 
        player.y + player.height >= plataforma.y && 
        //Se passou um pouquinho do topo da plataforma
        player.y + player.height <= plataforma.y + 10; // Pequena margem de erro e 10px

         //Passa por cada plataforma dentro de plataformas
         plataformas.forEach(plataforma => {
            //Verifica se o player está emcima de uma plataforma
            if (estaNaLargura && estaNoTopo && player.vy >= 0) {
                player.pulos = 2;
                player.state = "ground";
                player.y = plataforma.y - player.height;
                player.vy = 0;
                nochao = true
            }
         });

        //Muda o status do player
        if(nochao == false)player.state = "air";

        return

    }

/*MECANICAS*/
    //PULO DUPLO
    function VerificarPulo(){
        //Se tiver passado 0.5 segundos e o player ainda tiver pulos
        if(Date.now() - tempoPulo > 300 && player.pulos > 0){
            player.pulos -= 1;
            return true;
        }

        //Primeiro pulo
        if (player.pulos == 2){
            player.pulos -= 1;
            return true;
        }

        //Sem pulos restantes
        return false;
    }



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

    /* Movimentação */

        /*
        * Atualiza a posiçõa do usuário de acordo com as teclas presionadas
        */
        function update(){

            const gravidade = 0.96; //Velocidade da gravidade

            
            player.vx = 0; //Velocidade do personagem no eixo x

            if(player.state === "air"){
                player.vy += gravidade; //Aplica gravidade gradualmente
            } else {
                player.vy = 0;//Remove velocidade se o player estiver no chão
            }

            //Faz o personagem ir para frente
            if(keys["ArrowRight"] || keys["KeyD"]){
                player.vx = player.speed;
                if(player.looking == "left"){
                    player.looking = "right";
                    
                }
            }

            //Faz o personagem ir para trás
            if(keys["ArrowLeft"] || keys["KeyA"]){
                player.vx = -player.speed;
                if(player.looking == "right"){
                    player.looking = "left";
                }
            }

            //Faz o personagem ir para cima
            if((keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) && VerificarPulo()){
                player.vy = -player.speed * 1.5;
                tempoPulo = Date.now();
                player.state = "air";
            }

            //Verifica se faz mais que 0.3 segundos desde o pulo antes de cair
            if(Date.now() - tempoPulo > 300 && player.state === "air"){
                player.vy = player.speed;
            }

            //Reseta os pulos e muda o status do player
            VerificarChao();

            if(keys["KeyF"]){
                playerAtack()
            }
            
            //Movimenta o personagem
            player.x += player.vx;
            player.y += player.vy;

            
            //Impede o personagem de sair da tela
            if(player.x < 0) player.x = 0; //Impede de sair pela esquerda
            if(player.x + player.width > canvas.width) player.x = canvas.width - player.width; //Impede de sair pela direita
            if(player.y < 0) player.y = 0; //Impede de sair por cima
            if(player.y > canvas.height - player.height) player.y = canvas.height - player.height; //Impede de cair

            AiMove(gravidade)

        }

/*LOOP PRINCIPAL*/
    /**
     * Atualiza a tela e mantém o loop
     */
    function gameLoop(){
        update();
        draw();
        if (enemy.hp >= 0){
           drawEnemy();
        } else if(!enemy.dead){
            enemy.dead = true
        }
        console.log(enemy.hp)
        drawEstructure();
        drawProjectile();
        drawPlayerAtack();
        requestAnimationFrame(gameLoop);
    }

//Inicia o loop
gameLoop();