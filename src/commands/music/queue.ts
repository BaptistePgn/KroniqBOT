import {Command} from "../index";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Player} from "discord-player";

export class QueueCommand implements Command {
    name = "queue";
    description = "Show the queue";
    builder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async execute(interaction: CommandInteraction, player: Player) {
        const queue = player.queues.get(interaction.guildId!);
        if (!queue || !queue.isPlaying()) {
            await interaction.reply({content: "❌ | No music is being played!"});
            return;
        }

        const tracks = queue.tracks.map((track, i) => {
            return `${i + 1}. [${track.title}](${track.url})`;
        }).join("\n");

        await interaction.reply({
            content: `📜 | **Queue**:\n${tracks}`,
            allowedMentions: {repliedUser: false}
        });
    }
}

