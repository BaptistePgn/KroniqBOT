import {PingCommand} from "./utils/ping";
import {KroniqClient} from "../kroniqClient";
import {CommandInteraction} from "discord.js";
import {PlayCommand} from "./music/play";
import {Player} from "discord-player";

export interface Command {
    name: string;
    description: string;
    builder?: any;
    execute(interaction: CommandInteraction, player: Player): Promise<void>;
}

export async function deployCommands(client: KroniqClient) {
    client.commands = new Map();

    [new PingCommand(), new PlayCommand()].forEach((command) => {
        client.commands.set(command.name, command);
    });

    if (!client.application) return;

    client.application.commands.set(
        Array.from(client.commands.values()).map((command) => ({
            name: command.name,
            description: command.description,
            options: command.builder?.toJSON().options,
        }))
    ).then(r => console.log(r)).catch(console.error);
}

export async function handleCommand(client: KroniqClient, interaction: CommandInteraction) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client.player);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
}