import log from './log.js';
import { setUpWatcher } from './watcher.js';
import * as opt from "./setting.js"
import { setCurrentQuest,  } from "./quest.js"
import * as loader from './loader.js';

let buck = `{"test_bucket": [
            { "arg": [[1, 2, 3, 4, 5, 6]], "expect": 12 },
            { "arg": [[10, 11, 13, 14]], "expect": 24 },
            { "arg": [[0, 1, 2]], "expect": 2 }
        ]}`;
let bu = JSON.parse(buck);

process.argv.splice(2).forEach(val => {
    switch (val) {
        case '--banana':
            log.setLogMode(2);
            break;;
        case '--force-off':
            log.setLogMode(0);
            break;;
    }

})


loader.loadUser();
loader.loadQuests();
opt.setRl();
setCurrentQuest(loader.getCurrent());
log.log(`User: ${JSON.stringify(loader.getUser())}`);
