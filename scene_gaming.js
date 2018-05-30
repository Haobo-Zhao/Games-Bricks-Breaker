var scene_gaming = function(game) {
    var scene = {}

    var paddle = Paddle(game.images)
    var ball = Ball(game.images)
    var bricks = loadLevel(game.images, 1)

    var fpsRange = document.getElementById("id-fps")
    fpsRange.oninput = function() {
        window.fps = Number(fpsRange.value)
        fpsShow.innerHTML = "&nbsp&nbspfps: " + window.fps
    }

    var fpsShow = document.getElementById('id-span')
    fpsShow.innerHTML = "&nbsp&nbsp fps: " + window.fps

    var score = document.getElementById("id-score")
    score.innerHTML = "分数: " + window.score

    var textarea = document.getElementById("id-textarea")

    game.registerAction('a', function() {
        paddle.moveLeft()
    })

    game.registerAction('d', function() {
        paddle.moveRight()
    })

    // 暂时不需要上下移动的功能
    // game.registerAction('w', function() {
        // paddle.moveUp()
    // })

    // game.registerAction('s', function() {
        // paddle.moveDown()
    // })

    // 如果这个时间触发，就动球，否则就不动球。
    // 相当于用这个时间检测一个pause的功能
    game.registerAction(' ', function() {
        ball.move()
    })

    // 判断按下的是不是数字的一个巧招
    window.addEventListener('keydown', function(event) {
        if ('123456789'.includes(event.key)) {
            bricks = loadLevel(game.images, Number(event.key))
        }
    })

    // 三个函数联合起来，实现球的拖拽的功能
    window.addEventListener('mousedown', function(event) {
        // 在球的区域里面才能够拖这个球
        if (event.offsetX >= ball.x && event.offsetX <= ball.x + ball.width) {
            if (event.offsetY >= ball.y && event.offsetY <= ball.y + ball.height) {
                game.moving = true
            }
        }
        game.initialX = event.offsetX
        game.initialY = event.offsetY
    })
    // 在暂停的情况下才允许移动球，当然也可以可以随便改
    window.addEventListener('mousemove', function(event) {
        if ((game.moving == true) && (game.keydowns[' '] == false)) {
            var currentX = event.offsetX
            var currentY = event.offsetY
            ball.x += currentX - game.initialX
            ball.y += currentY - game.initialY
            // 注意，如果用笨办法，就是算位移，
            // 移动一次球之后，要把原点重新定位到这个位置来，方便下一次移动计算位移
            game.initialX = currentX
            game.initialY = currentY
        }
    })
    //鼠标不再点了，抬起来了，就不再移动球了
    window.addEventListener('mouseup', function(event) {
        game.moving = false
    })

    // 这里不用考虑图片载入的问题
    // 没载入，同样画出来，只不过是一片空白，对画布没影响
    // 已经载入了，那就可以画了，就可以看到
    // game.draw = function() {
    //     game.context.clearRect(0, 0, game.canvas.width, game.canvas.height)
    //     game.context.drawImage(paddle.image, paddle.x, paddle.y)
    // }

    scene.collide = function() {
        // 判断球和板子是不是相碰了
        // 上下相碰，先不考虑左右两边,只改变球的Y方向的速度speedY
        // 球严格在挡板两端的长度以内
        if ((ball.x + ball.width > paddle.x && ball.x < paddle.x + paddle.width)
            && (ball.y + ball.height > paddle.y && ball.y < paddle.y + paddle.height)) {
            ball.speedY *= -1
            log('Current direction of ball: ' + (ball.speedX > 0 ? 'right' : 'left')  
            + ' ' + (ball.speedY > 0 ? 'down' : 'up'))
        }

        // 球和砖块碰撞没有
        for (var i = 0; i < bricks.length; i++) {
            var b = bricks[i]
            b.collide(ball)
        }
    }



    // 定义draw的含义，在setTimeout里面会不停地调用这个重新定义过的函数
    scene.draw = function() {
        // 如果球的下端面碰到下面的屏幕，游戏就结束
        if (ball.y + ball.height >= canvasHeight) {
            // 存一个状态，说游戏结束了
            window.gameover = true
            var gameover = scene_gameover(game)
            game.run_with_scene(gameover)
        }
        // 画挡板
        game.drawImage(paddle)

        // 画球
        game.drawImage(ball)
        
        // 画砖块
        for (var i = 0; i < bricks.length; i++) {
            var b = bricks[i]
            if (b.alive) {
                game.drawImage(b)
            }
        }

        if (game.keydowns[' '] == false) {
            game.context.font = "50px Arial"
            game.context.fillText("Paused",canvasWidth / 2, canvasHeight / 2)
        }

        score.innerHTML = "分数: " + window.score
    }


    // 把现在的球的移动方向写在textarea里面
    log('Current direction of ball: ' + (ball.speedX > 0 ? 'right' : 'left')  
    + ' ' + (ball.speedY > 0 ? 'down' : 'up'))
    
    
    // 都定义好之后，开始跑程序了
    // 不需要了，新版本在game.run_with_scene(scene)函数里面跑了
    // game.runLoop()

    return scene
}