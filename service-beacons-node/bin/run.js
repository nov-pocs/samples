let BeaconsProcess = require('../obj/src/container/BeaconsProcess').BeaconsProcess;

try {
    let proc = new BeaconsProcess();
    proc._configPath = "./config/config.yml";
    proc.run(process.argv);
} catch (ex) {
    console.error(ex);
}