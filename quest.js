import { getAllQuests, save } from "./loader.js";
import _ from "./log.js";
import * as opt from "./setting.js";
import * as watch from './watcher.js';
import { existsSync, writeFileSync } from 'fs';

export let active_quest = {};
export let quest_file = '';
export let lastCurrent = 0;

export function setCurrentQuest(index) {
    let quests = getAllQuests();
    lastCurrent = index;
    let normal_current = index+1;
    _.log(`${normal_current}: normal_current\n${index}: index\n${quests.length} quests.length`);
    if (normal_current > quests.length) {
        console.log("You did it! Finished all quests! 10/10 Succses!");
        save();
        opt.rl.close();
        process.exit(0);
    }
    active_quest = quests[index]
    _.log("test: " + active_quest);
    quest_file = `./quests/${active_quest.symbol}.cjs`;

    opt.modifyPrompt(active_quest.symbol);
    if (!existsSync(quest_file)) {
        writeFileSync(quest_file, 
            `//${active_quest.desc}

function ${active_quest.func_name}(${active_quest.args}) {

}

module.exports = ${active_quest.func_name}`);
    }
    watch.setUpWatcher(quest_file);
}

export function getQuest() {
    return active_quest;
}

export function getlastcurrent() {
    return lastCurrent;
}
