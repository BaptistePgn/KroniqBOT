import {KroniqClient} from "./kroniqClient";
import * as process from "process";
import * as dotenv from "dotenv";
import {Command, deployCommands, handleCommand} from "./commands";


// extend the Client class to include a commands property
declare module "discord.js" {
    interface Client {
        commands: Map<string, Command>;
    }
}

dotenv.config();

const client = new KroniqClient();

client.once("ready", async () => {
    console.log("Ready");
    await deployCommands(client);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    await handleCommand(interaction);
});

client.login(process.env.TOKEN)
    .then(() => {
        console.log("Logged in");
    })
    .catch((error) => {
        console.error("Error logging in", error);
    });

export default client;