
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
        x: 100,
        y: canvas.height * 0.8 -10,
        width: 100,
        height: 100,
        speed: 5,
        vx: 0,
        image: new Image()
    }
    //Adiciona a imagem ao jogador
    player.image.src = "../poggers.webp";



/*CONTROLE DE EVENTOS*/
    //Lista de teclas que estão sendo presionadass
    const keys = {};

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

            player.vx = 0; //Velocidade do personagem no eixo x

            //Faz o personagem ir para frente
            if(keys["ArrowRight"] || keys["KeyD"]){
                player.vx = player.speed;
            }

            //Faz om personagem ir para trás
            if(keys["ArrowLeft"] || keys["KeyA"]){
                player.vx = -player.speed;
            }

            //Movimenta o personagem
            player.x += player.vx;

            //Impede o personagem de sair da tela
            if(player.x < 0) player.x = 0; //Impede de sair pela esquerda
            if(player.x + player.width > canvas.width) player.x = canvas.width - player.width; //Impede de sair pela direitaa

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