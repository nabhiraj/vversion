#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileUtils_1 = require("./fileUtils");
const init_1 = require("./commands/init");
const status_1 = require("./commands/status");
const addResource_1 = require("./commands/addResource");
const createCommit_1 = require("./commands/createCommit");
const viewLogs_1 = require("./commands/viewLogs");
const revertCommit_1 = require("./commands/revertCommit");
if (process.argv.length >= 3) {
    let command = process.argv[2];
    if (command == 'init') {
        (0, init_1.applyInit)();
    }
    else if (command == 'status') {
        (0, fileUtils_1.setCurrentDir)();
        (0, status_1.getStatus)();
    }
    else if (command == 'add') {
        (0, addResource_1.addResource)();
    }
    else if (command == 'commit') {
        (0, fileUtils_1.setCurrentDir)();
        (0, createCommit_1.createCommit)();
    }
    else if (command == 'logs') {
        (0, fileUtils_1.setCurrentDir)();
        (0, viewLogs_1.viewLogs)();
    }
    else if (command == 'revert') {
        (0, fileUtils_1.setCurrentDir)();
        if (process.argv.length == 4 && !isNaN(parseInt(process.argv[3]))) {
            (0, revertCommit_1.revert)(parseInt(process.argv[3]));
        }
        else {
            console.log('issue with input format');
        }
    }
}
else {
    console.log('acha se argument daalo bhai....');
}
