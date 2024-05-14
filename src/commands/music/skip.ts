import {Command} from "../index";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Player} from "discord-player";

export class SkipCommand implements Command {
    name = "skip";
    description = "Skip the current song";
    builder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async execute(interaction: CommandInteraction, player: Player) {
        const queue = player.queues.get(interaction.guildId!);

        if (!queue || !queue.isPlaying()) {
            await interaction.reply({content: "❌ | No music is being played!"});
            return;
        }

        if (queue!.tracks.size < 1) {
            await interaction.reply({content: "❌ | There are no songs in the queue to skip!"});
            return;
        }

        const success = queue!.node.skip();
        await interaction.reply({content: success ? "⏭️ | Skipped!" : "❌ | Something went wrong!"});
    }
}

