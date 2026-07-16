export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('menuBackground', 'assets/space.png');
    }

    create() {
        const background = this.add.image(
            640,
            360,
            'menuBackground'
        );

        background.setDisplaySize(1280, 720);

        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x000000,
            0.45
        );

        this.add.rectangle(
            640,
            360,
            560,
            480,
            0x071426,
            0.88
        ).setStrokeStyle(
            3,
            0x4bc9ff,
            0.8
        );

        const title = this.add.text(
            640,
            190,
            'SPACE RUNNER',
            {
                fontFamily: 'Arial',
                fontSize: '64px',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#168dca',
                strokeThickness: 4,
                shadow: {
                    offsetX: 0,
                    offsetY: 6,
                    color: '#000000',
                    blur: 8,
                    fill: true
                }
            }
        );

        title.setOrigin(0.5);

        const subtitle = this.add.text(
            640,
            250,
            'Survive. Shoot. Score.',
            {
                fontFamily: 'Arial',
                fontSize: '22px',
                color: '#8adfff'
            }
        );

        subtitle.setOrigin(0.5);

        const startButton = this.createButton(
            640,
            330,
            'START GAME'
        );

        const controlsButton = this.createButton(
            640,
            420,
            'CONTROLS'
        );

        const leaderboardButton = this.createButton(
            640,
            510,
            'LEADERBOARD'
        );

        startButton.on('pointerdown', () => {
            this.scene.start('NameEntry');
        });

        controlsButton.on('pointerdown', () => {
            this.scene.start('Controls');
        });

        leaderboardButton.on('pointerdown', () => {
            this.scene.start('Leaderboard');
        });

        this.add.text(
            640,
            575,
            'Use your ship to destroy the enemy fleet',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#9baec4'
            }
        ).setOrigin(0.5);
    }

    createButton(x, y, text) {
        const button = this.add.container(x, y);

        const buttonBackground = this.add.rectangle(
            0,
            0,
            320,
            70,
            0x123b59,
            1
        );

        buttonBackground.setStrokeStyle(
            2,
            0x52d4ff,
            1
        );

        const buttonText = this.add.text(
            0,
            0,
            text,
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                fontStyle: 'bold',
                color: '#ffffff'
            }
        );

        buttonText.setOrigin(0.5);

        button.add([
            buttonBackground,
            buttonText
        ]);

        button.setSize(320, 70);

        button.setInteractive({
            useHandCursor: true
        });

        button.on('pointerover', () => {
            buttonBackground.setFillStyle(
                0x1c6d99,
                1
            );

            buttonBackground.setStrokeStyle(
                3,
                0xffffff,
                1
            );

            buttonText.setScale(1.05);

            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 120,
                ease: 'Power2'
            });
        });

        button.on('pointerout', () => {
            buttonBackground.setFillStyle(
                0x123b59,
                1
            );

            buttonBackground.setStrokeStyle(
                2,
                0x52d4ff,
                1
            );

            buttonText.setScale(1);

            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 120,
                ease: 'Power2'
            });
        });

        button.on('pointerdown', () => {
            button.setScale(0.97);
        });

        button.on('pointerup', () => {
            button.setScale(1.05);
        });

        return button;
    }
}