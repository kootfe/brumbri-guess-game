import chokidar from "chokidar";
import { getQuest, getlastcurrent, setCurrentQuest } from './quest.js';
import log from './log.js'
import { createRequire } from 'module';
import dash from "lodash";

const require = createRequire(import.meta.url);
export let watcher;

export function setUpWatcher(file) {
    if (watcher) watcher.close().then(() => {
        log.log("Old watcher closed");
    });
    startWatcher(file);

}

export function startWatcher(file) {
    watcher = chokidar.watch(file, {
        peristent: true,
        ignoreInitial: false,
    });

    watcher
        .on('change', file => {
            delete require.cache[require.resolve(`./${file}`)];
            let new_module = require(`./${file}`);

            let passed=0;
            let i=0;
            let quest = getQuest();
            for (const test of quest.test_bucket) {
                let didPass = false;
                let res = new_module(...test.arg);
                if (dash.isEqual(res, test.expect)) { passed++; didPass = true; }
                console.log(`---- Test: ${i} ----`);
                log.writeSingleTest(test);
                console.log(`Got:       ${res}`);
                console.log(`Did Pass:  ${didPass}`);
                i++;
            }
            console.log(`Passed ${passed}/${quest.test_bucket.length} tests;`);
            if (passed >=quest.test_bucket.length) {
                setCurrentQuest(getlastcurrent() + 1);
            }
            log.log(`File modified: ${file}`);
        });

    log.log(`Watching ${file}`);
}
