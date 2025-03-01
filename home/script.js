
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

    function drawEstructure(){

    }

    function drawEnemy(){

    }

    function drawProjectile(){
        
    }


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
    player.image.src = "../poggers.webp";

/*MAPA*/
    /*Plataformas*/
        //plataforma1
        const plataforma = {
            x: 100,
            y: 100,
            width: 150,
            height: 100
        }

        const plataformas = [
            plataforma
        ]

    /**
     * Verifica se o player está emcima de alguma plataforma ou do chão
     */
    function VerificarChao(){

        //Verifica se o player está no chão
        if(player.y == canvas.height - player.height && player.pulos < 2){
            player.pulos++;
            player.state = "ground";
        }

        //Passa por cada plataforma dentro de plataformas
        plataformas.forEach(plataforma => {
            //Verifica se o player está emcima de uma plataforma
            if( player.y == plataforma.y && plataforma.x <= player.x <= plataforma.x + plataforma.width){
                player.pulos++;
                player.state = "ground";
                player.y = plataforma.height - player.height; //Impede ele de cair
            }
        });
        
        player.state = "air";
        return

    }

/*MECANICAS*/
    //PULO DUPLO
    function VerificarPulo(){
        //Se tiver passado 0.1 segundos e o player ainda tiver pulos
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
            player.vy += gravidade; //Velocidade do personagem no eixo y

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
            if(Date.now() - tempoPulo > 300){
                player.vy = player.speed;
            }

            //Reseta os pulos e muda o status do player
            VerificarChao();

            //Movimenta o personagem
            player.x += player.vx;
            player.y += player.vy;

            //Impede o personagem de sair da tela
            if(player.x < 0) player.x = 0; //Impede de sair pela esquerda
            if(player.x + player.width > canvas.width) player.x = canvas.width - player.width; //Impede de sair pela direita
            if(player.y < 0) player.y = 0; //Impede de sair por cima
            if(player.y > canvas.height - player.height) player.y = canvas.height - player.height; //Impede de cair

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