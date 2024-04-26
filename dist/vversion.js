#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileUtils_1 = require("./fileUtils");
const init_1 = require("./commands/init");
const status_1 = require("./commands/status");
if (process.argv.length >= 3) {
    let command = process.argv[2];
    if (command != 'init') {
        (0, fileUtils_1.setCurrentDir)();
        if (fileUtils_1.currentDir == null) {
            console.log('no version related information found');
            process.exit(0);
        }
    }
    //now one by one we will write the code to execute the commands which we are supporting for the vversion software.
    if (command == 'init') {
        (0, init_1.applyInit)();
    }
    else if (command == 'status') {
        (0, status_1.getStatus)();
    }
}
else {
    console.log('acha se argument daalo bhai....');
}
