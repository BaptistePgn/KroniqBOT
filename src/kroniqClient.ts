import {Client, IntentsBitField} from "discord.js";
import {Command} from "./commands";
import {Player} from "discord-player";

export class KroniqClient extends Client {
    commands: Map<string, Command>;
    player: Player;

    constructor() {
        super({intents: new IntentsBitField(3276799)});
        this.commands = new Map();
        this.player = new Player(this, {
            ytdlOptions: {
                filter: "audioonly",
                quality: "highestaudio",
                highWaterMark: 1 << 25
            }
        });
        this.player.extractors.loadDefault().then(r => console.log(r)).catch(console.error);
    }
}