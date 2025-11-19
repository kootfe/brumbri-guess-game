import readline from "readline";
import log from "./log.js";
import { active_quest, quest_file, setCurrentQuest } from "./quest.js";

export let rl;

export function setRl() {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "\x1b[31mkftcode>\x1b[0m"
    });

    rl.prompt();
    rl.on('line', (line) => {
        const cmd_raw = line.trim().toLowerCase().split(' ');
        const cmd = cmd_raw[0];
        const args = cmd_raw.slice(1);
        switch (cmd) {
            case 'info':
                log.info(active_quest.title, active_quest.desc, active_quest.test_bucket);
                break;;
            case 'exit':
                rl.close();
                process.exit(0);
                break;;
            case 'open':
                let pr = parseInt(args[0], 10);
                if (isNaN(pr)) break;
                setCurrentQuest(pr);
                break;;
        }
        rl.prompt();
    });
}

export function modifyPrompt(quest) {
    rl.setPrompt(`\x1b[31mkftcode ${quest}>\x1b[0m`);
    rl.prompt();
}

