let logmode = 1;
const CLEAR = "\x1b[0m"

function setLogMode(mode)
{
    logmode = mode;
}

function log(text) 
{
    if (logmode != 2) return;
    console.log();
    console.log("\x1b[33m[LOG]: " + text + CLEAR);
}

function write(text)
{
    if (logmode != 2) return;
    console.log();
    console.log(text);
}

function error(text)
{
    if (logmode == 0) return;
    console.log();
    console.error("\x1b[31m[ERROR]: " + text + CLEAR);
}

function objtostr(obj) {
    if (typeof obj != 'object') return "Not An Object";
    return JSON.stringify(obj);
}

function formatValue(val) {
    try {
        return JSON.stringify(val);
    } catch {
        return String(val);
    }
}

function writeSingleTest(test, index = null) {
    const args = test.arg.map(formatValue).join(" | ");
    const expect = formatValue(test.expect);
    if (index != null) console.log(`\n--------------- Test: ${index}`);
    console.log(`Args:          ${args}`);
    console.log(`Expection:     ${expect}`);
}

function writeTestBucket(bucket) {
    let i = 0;
    for (const test of bucket) {
        writeSingleTest(test, i);
        i++;
    }
}

function info(questTitle, questDesc, questBucket) {
    console.log(`\x1b[1;33mTITLE: ${questTitle}\x1b[0m`);
    console.log(`\x1b[3;34mDescription: ${questDesc}\x1b[0m`);
    console.log("Test bucckets:");
    writeTestBucket(questBucket);
}

export default { objtostr, setLogMode, log, error, write, info, writeSingleTest };

