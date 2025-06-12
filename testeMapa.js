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

        for(var y=0; y < mapW; y++){

            for(var x=0; x < mapH; x++){

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