const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");

const { startsWith, getURL, getVideoID } = require("./helpers.js");
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

const Discord_Token = process.env.DISCORD_TOKEN;

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

client.on("messageCreate", (message) => {
  console.log(message.content);
  if (message.author.bot) return; // Ignore messages from bots

  const searchString = "hello"; // The string you're looking for
  if (message.content.toLowerCase().includes(searchString)) {
    message.channel.send("sent from a docker container fo the bot!");
  }

  if (startsWith(message.content, "!download")) {
    // make this a functino to call when a user plays a video
    message.channel.send("Downloading audio");
    const videoUrl = getURL(message.content);
    const videoID = getVideoID(videoUrl);
    console.log(videoID);
    const output = `${videoID}.mp3`; // Output file name

    const stream = ytdl(videoUrl, { quality: "highestaudio" });
    const audio = ffmpeg(stream)
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("error", (err) => {
        console.error("An error occurred:", err);
      })
      .on("end", () => {
        message.channel.send("Audio downloaded and converted to MP3!");
        console.log("Audio downloaded and converted to MP3!");
      });

    audio.pipe(fs.createWriteStream(output));
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

  if (startsWith(message.content, "!play")) {
    const videoUrl = getURL(message.content); // get the url of the video
    console.log("videoUrl->", videoUrl);
    const connection = getVoiceConnection(message.guild.id);
    if (connection) {
      const stream = ytdl(videoUrl, {
        quality: "highestaudio",
        filter: "audioonly",
      });
      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);

      message.channel.send("Playing audio!");
    } else {
      message.channel.send("I need to be in a voice channel to play audio!");
    }
  }
});

client.login(Discord_Token);
