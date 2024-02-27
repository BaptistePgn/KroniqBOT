import {Client, IntentsBitField} from "discord.js";
import * as process from "process";
import * as dotenv from "dotenv";

const client = new Client({ intents: new IntentsBitField(3276799) });
dotenv.config();


client.login(process.env.TOKEN)
    .then(() => {
        console.log('Logged in');
    })
    .catch((error) => {
        console.error('Error logging in', error);
    });

client.on("ready", async () => {

    await client.application?.commands.set([
        {
            name: "ping",
            description: "Replies with Pong!"
        },
        {
            name: "tg",
            description: "Replies with Tg!"
        }
    ]);
    console.log("Ready");
});

client.on("interactionCreate", (interaction) => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping")
        interaction.reply("Pong!");

    if (interaction.commandName === "tg")
        interaction.reply("Tg " + interaction.user.username);
});