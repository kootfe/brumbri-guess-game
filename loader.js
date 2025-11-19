import fs from 'fs';
import log from './log.js';
import _ from 'lodash';

let user = { current: 0 };
let quests = [];

export function loadUser() {
    if (!fs.existsSync('./user.json')) {
        user.current = 0;
    } else {
        try {
            _.merge(user, JSON.parse(fs.readFileSync('./user.json', 'utf-8')));
        } catch {
            log.error("Courapted user data!");
            user.current = 0;
        }
    }
}

export function getAllQuests() {
    return quests;
}

export function setUser(newUser) {
    _.merge(user, newUser);
}


export function mergeQuest(newQuest) {
    _.merge(quests, newQuest);
}

export function getQuests() {
    return quests;
}

export function getUser() {
    return user;
}

export function getCurrent() {
    return user.current;
}

export function save() {
    let rawUser = JSON.stringify(user);
    fs.writeFileSync('./user.json', rawUser);
}

export function loadQuests() {
    let rawQuestions;
    if (!fs.existsSync('./questions.json')) { log.error("Cant find the questions.json!"); return; }

    try {
        rawQuestions = fs.readFileSync('./questions.json', 'utf-8');
    } catch {
        log.error("courapted questions.json!");
        return;
    }

    mergeQuest(JSON.parse(rawQuestions));
}
