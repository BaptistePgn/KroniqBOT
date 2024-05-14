import {KroniqClient} from "./kroniqClient";
import * as process from "process";
import * as dotenv from "dotenv";
import {deployCommands, handleCommand} from "./commands";

dotenv.config();

const client = new KroniqClient();

client.once("ready", async () => {
    console.log("Ready");
    await deployCommands(client);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    await handleCommand(client, interaction);
});

client.login(process.env.TOKEN)
    .then(() => {
        console.log("Logged in");
    })
    .catch((error) => {
        console.error("Error logging in", error);
    });
