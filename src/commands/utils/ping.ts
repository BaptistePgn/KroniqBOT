import {CommandInteraction} from "discord.js";
import {Command} from "../index";


export class PingCommand implements Command {
    name = "ping";
    description = "Replies with Pong!";

    async execute(interaction: CommandInteraction) {
        await interaction.reply("Pong!");
    }
}