import {PingCommand} from "./utils/ping";
import {KroniqClient} from "../kroniqClient";
import {CommandInteraction} from "discord.js";

export interface Command {
    name: string;
    description: string;
    execute(interaction: CommandInteraction): Promise<void>;
}

export async function deployCommands(client: KroniqClient) {
    client.commands = new Map();

    [new PingCommand()].forEach((command) => {
        client.commands.set(command.name, command);
    });

    if (!client.application) return;

    client.application.commands.set(
        Array.from(client.commands.values()).map((command) => ({
            name: command.name,
            description: command.description,
        }))
    ).then(r => console.log(r)).catch(console.error);
}

export async function handleCommand(interaction: CommandInteraction) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.warn(`No command found for ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
}