#!/usr/bin/env node 
const fs = require('fs');
const chokidar = require('chokidar');
const readline = require('readline');

let quest, quest_file;
let watcher;

let rawQuestion = fs.readFileSync("./questions.json", 'utf-8')
let questions;

try {
    questions = JSON.parse(rawQuestion);
} catch {
    console.error("Invalid");
    process.exit(0);
}

let userData;
if (fs.existsSync("./user.json")) {
    try {
        userData = JSON.parse(fs.readFileSync('./user.json', 'utf-8'));
    } catch {
        console.error("Corrupted user, reset");
    }
}

let current = 0;

try {
    current = userData.current;
} catch {console.log("User dont exist");}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "\x1b[31mkftcode>\x1b[0m ",
});

const setCurrentQuest = (index) => {
    current = index;
    let current_index_normal = current+1;
    if (current_index_normal > questions.length) {
        console.log("Congrations! You finished evry exisiting quest!")
        save();
        rl.close();
        process.exit(0);
    }
    quest = questions[current];
    quest_file = `kftcode_${quest.symbol}.js`;
    if (!fs.existsSync(quest_file)) {
        fs.writeFileSync(quest_file, 
            `// ${quest.desc}\n\nfunction ${quest.func_name}(${quest.args}) {\n\n}\n\n\nmodule.exports = ${quest.func_name};`);
        console.log(`Craeted ${quest_file}`);
    }
    setWatcher();
}
setCurrentQuest(current);

function setWatcher() {
    if (watcher) watcher.close();

    watcher = chokidar.watch(quest_file).on("change", async () => {
        try {
            delete require.cache[require.resolve(`./${quest_file}`)];
            const userFunc = require(`./${quest_file}`);

            let passed = 0;
            let test = 0;
            console.log("Test starts");
            for (const t of quest.test_bucket) {
                let didPass = false;
                const res = userFunc(...t.arg);
                if (controlIfSame(res, t.expect)) { passed++; didPass = true;}
                console.log("----- Test: " + test + " -----");
                writeSingleBucket(t);
                console.log(`Got:        ${res}\nDidPass?:   ${didPass}`);
                console.log("----- " +  test + " -----");
                test++;
            }
            console.log("Test ends");
            console.log(`Passed ${passed}/${quest.test_bucket.length} tests`);
            if (passed == quest.test_bucket.length) {
                console.log("Finished the test!")
                current++;
                save()
                setCurrentQuest(current);
            }
        } catch (err) {
            console.error(`Error in user code: ${err.message}`);
        }
    });
}




function save() {
    let jsonString = `{ "current": ${current} }`;
    fs.writeFileSync("./user.json", jsonString);
}


function formatValie(v) {
    try {
        return JSON.stringify(v); 
    } catch {
        return String(v);
    }
}

function writeSingleBucket(buckel, index = null) {
    const args = buckel.arg.map(formatValie).join(" | ");
    const expect = formatValie(buckel.expect);
    if (index !== null) console.log(`\n--- Bucket ${index} ---`);
    console.log(`Args:       ${args}`);
    console.log(`Expected:   ${expect}`);
}

function writeTextBucket(bucket) {
    let i =0;
    for (const b of bucket) {
        writeSingleBucket(b, i);
        i++;
    }
}

function info() {
    console.log(`Title: ${quest.title}\nDescription: ${quest.desc}`);
    console.log("Test buckets!:");
    writeTextBucket(quest.test_bucket);
}

rl.prompt();
rl.on('line', (line) => {
    const cmd = line.trim().toLowerCase();
    switch(cmd) {
        case "hint": {
            console.log(quest.hint);
            break;;
        }
        case "save": {
            save();
            break;;
        }
        case "exit": {
            rl.close();
            process.exit(0);
            break;;
        }
        case "info": {
            info();
            break;;
        }
    }
    rl.prompt();
});

function controlIfSame(x, y) {
    if (typeof(x) != typeof(y)) return false;
    else if (typeof(x) == "object") {
        let jx = JSON.stringify(x);
        let jy = JSON.stringify(y);
        return jx == jy;
    } else { return x == y; }
}
