import {Command} from "../index";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Player} from "discord-player";

export class PauseCommand implements Command {
    name = "pause";
    description = "Pause the music"
    builder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async execute(interaction: CommandInteraction, player: Player) {
        const queue = player.queues.get(interaction.guildId!);
        if (!queue || !queue.isPlaying()) {
            await interaction.reply({content: "❌ | No music is being played!"});
            return;
        }
        if (queue!.node.isPaused()) {
            await interaction.reply({content: "❌ | The music is already paused!"});
            return;
        }

        const success = queue!.node.setPaused(true);
        await interaction.reply({content: success ? "⏸️ | Paused!" : "❌ | Something went wrong!"});
    }
}

