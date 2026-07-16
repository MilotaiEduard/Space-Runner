import { savePlayerScore } from '../scoreService.js';

export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.finalScore = data.score ?? 0;

        this.playerName =
            data.playerName ??
            this.registry.get('playerName') ??
            'Player';
    }

    preload() {
        this.load.image(
            'gameOverBackground',
            'assets/space.png'
        );
    }

    create() {
        const background = this.add.image(
            640,
            360,
            'gameOverBackground'
        );

        background.setDisplaySize(1280, 720);

        this.add.rectangle(
            640,
            540,
            1280,
            720,
            0x000000,
            0.65
        );

        this.add.rectangle(
            640,
            360,
            700,
            650,
            0x071426,
            0.92
        ).setStrokeStyle(
            3,
            0xff4d5a,
            0.9
        );

        this.add.text(
            640,
            150,
            'GAME OVER',
            {
                fontFamily: 'Arial',
                fontSize: '70px',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#b51f32',
                strokeThickness: 6,
                shadow: {
                    offsetX: 0,
                    offsetY: 6,
                    color: '#000000',
                    blur: 8,
                    fill: true
                }
            }
        ).setOrigin(0.5);

        this.add.text(
            640,
            270,
            this.playerName,
            {
                fontFamily: 'Arial',
                fontSize: '30px',
                fontStyle: 'bold',
                color: '#52d4ff'
            }
        ).setOrigin(0.5);

        this.add.text(
            640,
            325,
            `Final Score: ${this.finalScore}`,
            {
                fontFamily: 'Arial',
                fontSize: '34px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.saveStatusText = this.add.text(
            640,
            375,
            'Saving score...',
            {
                fontFamily: 'Arial',
                fontSize: '19px',
                color: '#a8bdcc'
            }
        ).setOrigin(0.5);

        const playAgainButton = this.createButton(
            640,
            455,
            'PLAY AGAIN'
        );

        playAgainButton.on('pointerdown', () => {
            this.scene.start('Start');
        });

        const leaderboardButton = this.createButton(
            640,
            535,
            'LEADERBOARD'
        );

        leaderboardButton.on('pointerdown', () => {
            this.scene.start('Leaderboard');
        });

        const menuButton = this.createButton(
            640,
            615,
            'MAIN MENU'
        );

        menuButton.on('pointerdown', () => {
            this.scene.start('Menu');
        });

        this.saveScore();
    }

    async saveScore() {
        try {
            await savePlayerScore(
                this.playerName,
                this.finalScore
            );

            if (!this.scene.isActive()) {
                return;
            }

            this.saveStatusText.setText(
                'Score saved successfully'
            );

            this.saveStatusText.setColor(
                '#73ff9a'
            );
        } catch (error) {
            console.error(
                'Score saving failed:',
                error
            );

            if (!this.scene.isActive()) {
                return;
            }

            this.saveStatusText.setText(
                'The score could not be saved'
            );

            this.saveStatusText.setColor(
                '#ff6374'
            );
        }
    }

    createButton(x, y, text) {
        const button = this.add.container(x, y);

        const buttonBackground = this.add.rectangle(
            0,
            0,
            300,
            60,
            0x123b59
        );

        buttonBackground.setStrokeStyle(
            2,
            0x52d4ff
        );

        const buttonText = this.add.text(
            0,
            0,
            text,
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        button.add([
            buttonBackground,
            buttonText
        ]);

        button.setSize(300, 60);

        button.setInteractive({
            useHandCursor: true
        });

        button.on('pointerover', () => {
            buttonBackground.setFillStyle(
                0x1c6d99
            );

            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 120
            });
        });

        button.on('pointerout', () => {
            buttonBackground.setFillStyle(
                0x123b59
            );

            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 120
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