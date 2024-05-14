import {KroniqClient} from "../kroniqClient";
import {CommandInteraction} from "discord.js";
import {Player} from "discord-player";
import {readdirSync} from "fs";


export interface Command {
    name: string;
    description: string;
    builder?: any;

    execute(interaction: CommandInteraction, player: Player): Promise<void>;
}

export async function deployCommands(client: KroniqClient) {
    client.commands = new Map();

    // Browse all the directories in the commands folder and load all the commands
    let count = 0;
    const dirsCommands = readdirSync("./src/commands").filter(dir => !dir.endsWith(".ts"));

    for (const dir of dirsCommands) {
        const filesDirs = readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith(".ts"));
        for (const file of filesDirs) {
            const command = require(`./${dir}/${file}`);
            const instance = new command[Object.keys(command)[0]]() as Command;
            client.commands.set(instance.name, instance);
            count++;
        }
    }

    console.log(`Loaded ${count} commands`);

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
        await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
    }
}