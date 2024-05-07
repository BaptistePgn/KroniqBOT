import {Client, IntentsBitField} from "discord.js";
import {Command} from "./commands";

export class KroniqClient  extends Client {
    commands: Map<string, Command>;

    constructor() {
        super({ intents: new IntentsBitField(3276799) });
        this.commands = new Map();
    }
}