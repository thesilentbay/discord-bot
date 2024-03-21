// import Discord from "discord.js";

// const client = new Discord.Client();

const fs = require("fs");
const ytdl = require("ytdl-core");
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} = require("@discordjs/voice");

// ytdl("https://www.youtube.com/watch?v=fCJRI_1BbYk").pipe( // script to download a video as a mp3 file
//   fs.createWriteStream("video.mp3")
// );

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log("Bot is online!");
});

const Discord_Token = process.env.DISCORD_TOKEN;

client.on("messageCreate", (message) => {
  console.log(message.content);
  if (message.author.bot) return; // Ignore messages from bots

  const searchString = "hello"; // The string you're looking for
  if (message.content.toLowerCase().includes(searchString)) {
    message.channel.send("sent!");
  }

  // Command to join the voice channel
  if (message.content === "!join") {
    const voiceChannel = message.member.voice.channel;
    if (voiceChannel) {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      message.channel.send("Joined the voice channel!");
    } else {
      message.channel.send("You need to be in a voice channel first!");
    }
  }

  if (message.content === "!leave") {
    const connection = getVoiceConnection(message.guild.id);
    if (connection) {
      connection.destroy();
      message.channel.send("Left the voice channel!");
    } else {
      message.channel.send("I am not in a voice channel!");
    }
  }

  //   if (message.content === "!play") { // for later
  //     const connection = getVoiceConnection(message.guild.id);
  //     if (connection) {
  //       const player = createAudioPlayer();
  //       const resource = createAudioResource("./video.mp3"); // Replace with the path to your audio file
  //       player.play(resource);
  //       connection.subscribe(player);
  //       message.channel.send("Playing audio!");
  //     } else {
  //       message.channel.send("I need to be in a voice channel to play audio!");
  //     }
  //   }
});

client.login(Discord_Token);
