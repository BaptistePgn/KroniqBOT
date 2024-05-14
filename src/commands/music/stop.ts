import {Command} from "../index";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Player} from "discord-player";

export class StopCommand implements Command {
    name = "stop";
    description = "Stop the music and clear the queue"
    builder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async execute(interaction: CommandInteraction, player: Player) {
        const queue = player.queues.get(interaction.guildId!);
        if (!queue || !queue.isPlaying()) {
            await interaction.reply({content: "❌ | No music is being played!"});
            return;
        }

        queue.delete();
        await interaction.reply({content: "⏹️ | Stopped!"});
    }
}

