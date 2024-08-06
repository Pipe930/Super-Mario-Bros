import { createAnimations } from "./animations.js"

const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#849cd8',
    parent: 'game',
    scene: { 
        preload, // se ejecuta para precargar recursos
        create, // se ejecuta cuando el juego comienza
        update // se ejecuta en cada frame
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

new Phaser.Game(config)

function preload() {
    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    )

    this.load.spritesheet(
        'mario',
        'assets/entities/mario.png',
        {
            frameWidth: 18,
            frameHeight: 16,
            endFrame: 6
        }
    )

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )

    this.load.audio(
        'gameover',
        'assets/sound/music/gameover.mp3'
    )

    this.load.audio(
        'soundtrack',
        'assets/sound/music/overworld/hurry-up-theme.mp3'
    )

    this.load.audio(
        'jump',
        'assets/sound/effects/jump.mp3'
    )
}

function create() {

    this.add.image(100, 50, 'cloud1')
    .setOrigin(0, 0)
    .setScale(0.15)

    this.floor = this.physics.add.staticGroup()

    this.floor.create(0, config.height - 32, 'floorbricks')
    .setOrigin(0, 0)
    .refreshBody()

    this.floor.create(200, config.height - 32, 'floorbricks')
    .setOrigin(0, 0)
    .refreshBody()

    this.mario = this.physics.add.sprite(50, 100, 'mario')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(500)

    this.physics.world.setBounds(0, 0, 2000, config.height)
    this.physics.add.collider(this.mario, this.floor)

    this.cameras.main.startFollow(this.mario)
    this.cameras.main.setBounds(0, 0, 2000, config.height)

    createAnimations(this)

    this.keys = this.input.keyboard.createCursorKeys()

    //this.sound.add('soundtrack', {volume: 0.2}).play()
}

function update() {

    if(this.mario.isDead) return

    if(this.keys.left.isDown) {

        this.mario.anims.play('mario-walk', true)
        this.mario.x -= 2
        this.mario.flipX = true

    } else if(this.keys.right.isDown) {

        this.mario.anims.play('mario-walk', true)
        this.mario.x += 2
        this.mario.flipX = false

    } else {
        this.mario.anims.play('mario-idle', true)
    }

    if(this.keys.up.isDown && this.mario.body.touching.down){

        this.sound.add('jump', {volume: 0.05}).play()
        this.mario.anims.play('mario-jump', true)
        this.mario.setVelocityY(-300)
    }

    if(this.mario.y >= config.height){

        this.mario.isDead = true
        this.mario.anims.play('mario-dead', true)
        this.mario.setCollideWorldBounds(false)
        this.sound.add('gameover', {volume: 0.2}).play()

        setTimeout(() => {
            this.mario.setVelocityY(-350)
        }, 100)

        setTimeout(() => {
            this.scene.restart()
        }, 3000)
    }
}

