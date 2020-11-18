"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require('process');
const BeaconsBenchmarkBuilder_1 = require("./BeaconsBenchmarkBuilder");
let builder = new BeaconsBenchmarkBuilder_1.BeaconsBenchmarkBuilder();
let type = process.env['BENCHMARK_TYPE'] || 'performance';
switch (type) {
    case 'performance':
        console.log('Testing beacons for performance');
        builder.forPerformanceTesting();
        break;
    case 'reliability':
        console.log('Testing beacons for reliability');
        builder.forReliabilityTesting();
        break;
    case 'scalability':
        console.log('Testing beacons for scalability');
        builder.forScalabilityTesting();
        break;
    default:
        builder.forPerformanceTesting();
        break;
}
let runner = builder.create();
runner.run((err) => {
    if (err)
        console.error(err);
});
// Log uncaught exceptions
process.on('uncaughtException', (ex) => {
    console.error(ex);
    console.error("Process is terminated");
    process.exit(1);
});
// Gracefully shutdown
process.on('exit', function () {
    runner.stop();
    //console.log("Goodbye!");
});
//# sourceMappingURL=run.js.map