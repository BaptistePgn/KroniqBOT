import {Command} from "../index";
import {CommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import {Player, QueueRepeatMode} from "discord-player";

export class PlayCommand implements Command {
    name = "play";
    description = "Play a song";
    builder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option => option.setName("song").setDescription("The song to play").setRequired(true));

    async execute(interaction: CommandInteraction, player: Player) {
        try {
            const query = interaction.options.get("song")?.value as string;
            const member = interaction.member as GuildMember;
            const voiceChannel = member.voice.channel;

            if (!voiceChannel) {
                await interaction.reply("❌ | You must be in a voice channel to use this command");
                return;
            }

            // Search for the song
            const results = await player.search(query, {
                requestedBy: interaction.user,
            });

            // If no results are found, reply with a message
            if (!results || results.tracks.length === 0) {
                await interaction.reply("❌ | No results found");
                return;
            }

            const track = results.tracks[0];
            const guildId = interaction.guildId;

            if (!guildId) {
                await interaction.reply("❌ | This command can only be used in a server");
                return;
            }

            let queue = player.queues.get(guildId);
            if (!queue) {
                queue = player.queues.create(guildId, {
                    metadata: interaction.channel,
                    repeatMode: QueueRepeatMode.OFF,
                });
            }

            // Save the channel where the interaction was created
            queue.metadata = interaction.channel;

            // Connect to the voice channel if not already connected
            if (!queue.connection) {
                await queue.connect(voiceChannel);
            }

            queue.addTrack(track);

            if (!queue.isPlaying()) {
                await queue.node.play();
            }


            await interaction.reply(`🎶 | Enqueued **${track.title}** in position **#${queue.tracks.size + 1}**`);
        } catch (error) {
            console.error("Error executing play command:", error);
            await interaction.reply("❌ | An error occurred while executing the command");
        }
    }
}