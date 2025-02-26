
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
    
        //Adiciona o personagem
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    }



/*JOGADOR*/
    // Criação do jogador e suas caracteristicas
    const player = {
        //posições
        x: 100,
        y: canvas.height * 0.8,
        //tamanho
        width: 100,
        height: 100,
        //atributos
        speed: 10,
        pulos: 2,
        //movimentação
        vx: 0,
        vy: 0,
        //imagem
        image: new Image()
    }
    //Adiciona a imagem ao jogador
    player.image.src = "../poggers.webp";

/*MECANICAS*/
    //PULO DUPLO
    function VerificarPulo(){
        //Se tiver passado 0.1 segundos e o player ainda tiver pulos
        if(Date.now() - tempoPulo > 300 && player.pulos > 0){
            player.pulos -= 1;
            console.log(`numero pulos ${player.pulos}`);
            return true;
        }

        //Primeiro pulo
        if (player.pulos == 2){
            player.pulos -= 1;
            console.log('bbbbbbbbbbbbbbbbbbbb');
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

            const gravidade = 0.5; //Velocidade da gravidade

            player.vx = 0; //Velocidade do personagem no eixo x
            player.vy += gravidade; //Velocidade do personagem no eixo y

            //Faz o personagem ir para frente
            if(keys["ArrowRight"] || keys["KeyD"]){
                player.vx = player.speed;
            }

            //Faz o personagem ir para trás
            if(keys["ArrowLeft"] || keys["KeyA"]){
                player.vx = -player.speed;
            }

            //Faz o personagem ir para cima
            if((keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) && VerificarPulo()){
                player.vy = -player.speed * 1.5;
                tempoPulo = Date.now();
            }

            //Verifica se faz mais que 0.3 segundos desde o pulo antes de cair
            if(Date.now() - tempoPulo > 300){
                player.vy = player.speed;
            }

            if(player.y == canvas.height * 0.8 && player.pulos < 2) player.pulos++;
            //Faz o personagem cair

            //Movimenta o personagem
            player.x += player.vx;
            player.y += player.vy;

            //Impede o personagem de sair da tela
            if(player.x < 0) player.x = 0; //Impede de sair pela esquerda
            if(player.x + player.width > canvas.width) player.x = canvas.width - player.width; //Impede de sair pela direita
            if(player.y < 0) player.y = 0; //Impede de sair por cima
            if(player.y > canvas.height * 0.8) player.y = canvas.height * 0.8; //Impede de cair

        }

/*LOOP PRINCIPAL*/
    /**
     * Atualiza a tela e mantém o loop
     */
    function gameLoop(){
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

//Inicia o loop
gameLoop();