const path = require('path')
const fs = require('fs')
const commandsDir = path.join(__dirname, '../command')
const commands = new Map();
const menuByLabel = new Map()
const log = require("./log.js")

const loadFile = (filePath) => {
    try {
        if(filePath.endsWith('.js')) {
            const file = require(filePath);
            const name = file.name.toLowerCase().replace(/\s/g, "");
            if (!commands.has(name)) {
                commands.set(name, file)
            } else {
                log.error(`duplication name ${name}.`)
            }
        }
        return false
    } catch (e) { 
        log.error(e)
    }
}

const exploreFolder = (dir) => {
    fs.readdirSync(dir).forEach(dirOrFile => {
        const dirOrFilePath = path.join(dir, dirOrFile);
        if (fs.statSync(dirOrFilePath).isDirectory()) {
            exploreFolder(dirOrFilePath);
        } else {
            loadFile(dirOrFilePath);
        }
    });
}

const loadCommands = async() => {
    exploreFolder(commandsDir)
    commands.forEach(val => {
        let label = val.menu?.label
        if(label){
            if(!menuByLabel.has(label)){
                menuByLabel.set(label, [])
            }
            menuByLabel.get(label).push({
                cmd : val.cmd,
                example : val.menu.example
            })
        }
    })
    log.info(`Loaded ${commands.size} commands.`)
}

module.exports = {
    loadCommands,
    commands,
    menuByLabel
}