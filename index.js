/* cyism

a discord bot.

liciensed under M.I.T 

created by @cyliim

*/

// define needed discord.js

const Discord = require("discord.js");
const client = new Discord.Client();

// define other packages

const db = require("quick.db");
var uuid = require('uuid');
const uuidv4 = require('uuid/v4');

// for cmd handler  

const fs = require("fs").promises;
const path = require("path");

client.commands = new Map();

// define config file

const { token, prefix } = require("./config.json");

// cmd handler

(async function registerCommands(dir = "commands") {

    // read dir/file

    let files = await fs.readdir(path.join(__dirname, dir));
    console.log(files)

    // loop thru each file

    for (let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if (stat.isDirectory()) // if file is a directory, recurive call recurDir
            registerCommands(path.join(dir, file));
        else {
            // check if file is a .js file
            if (file.endsWith(".js"));
            let cmdName = file.substring(0, file.indexOf(".js"));
            let cmdModule = require(path.join(__dirname, dir, file));
            let { aliases } = cmdModule;
            client.commands.set(cmdName, cmdModule);
            if (aliases.length !== 0) {
                aliases.forEach(alias => client.commands.set(alias, cmdModule))
            }

        }
    }

})();

// event handler

(async function registerEvents(dir = "events") {

    // read dir/file

    let files = await fs.readdir(path.join(__dirname, dir));
    // loop thru each file

    for (let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if (stat.isDirectory()) // if file is a directory, recurive call recurDir
            registerEvents(path.join(dir, file));
        else {
            // check if file is a .js file
            if (file.endsWith(".js"));
            let eventName = file.substring(0, file.indexOf(".js"));
            let eventModule = require(path.join(__dirname, dir, file));
            client.on(eventName, eventModule.bind(null, client));
        }
    }

})();

client.login(token);