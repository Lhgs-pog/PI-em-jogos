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

    let listaDeInimigos = [];

    function criarNovoInimigo() {
        const novoInimigo = new Enemy(300, 6, 0);
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
    atackP.image.src="imagens/claw.png"

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
        class Enemy {

            constructor(hp,speed,pulos){
                //Tamanho
                this.width=50
                this.height=50
                //Posição
                this.x= canvas.width - 50
                this.y= canvas.height - 50
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
                //Aparência
                this.image = new Image()
                this.image.src = "imagens/not_poggers.jpg";
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

            /**
             * Coloca os inimigos dentro da fase
             */
            drawEnemy(){
                ctx.save()

                if(this.tookDamage){
                    ctx.filter = "brightness(150%)"
                }
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                ctx.restore()
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

        }

        setInterval(criarNovoInimigo, 5000);

/*LOOP PRINCIPAL*/
    /**
     * Atualiza a tela e mantém o loop
     */
    function gameLoop(){
        update();
        
        //Pecorre todos os inimigos da lista
        for (const enemy of listaDeInimigos) {
            enemy.AiMove();
        }
        
        draw();
        for (const enemy of listaDeInimigos) {
            enemy.drawEnemy();
        }
        drawEstructure();
        drawPlayerAtack();

        removerInimigosMortos();

        requestAnimationFrame(gameLoop);
    }
//Inicia o loop
gameLoop();