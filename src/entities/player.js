export class Player{
    constructor(canvas) {
         //tamanho
         this.width = 50
         this.height = 50
         //posições
         this.x = 100
         this.y = canvas.height - 50
         //atributos
         this.hp = 100
         this.speed = 10
         this.pulos = 2
         //Status
         this.state = "ground"
         this.looking = "left"
         //movimentação
         this.vx = 0
         this.vy = 0
         //imagem
         this.image = new Image()
         //Adiciona a imagem ao jogador
         this.image.src = "imagens/poggers.webp";
     }
     
     /**
      * Limpa a tela e desenha o personagem de acordo com onde ele tá olhando
      */
     draw(ctx){
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
     * Controla a lógica de movimentação do player
     */
    update(gravidade, keys){
        player.vx = 0; //Velocidade do personagem no eixo x
        tempoPulo = 0; // Controle de spawn de pulo

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
}