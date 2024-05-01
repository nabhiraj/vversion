"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommit = void 0;
const BranchManager_1 = require("./../BranchManager");
function createCommit() {
    let message = '';
    for (let i = 3; i < process.argv.length; i++) {
        message += process.argv[i];
    }
    let bm = new BranchManager_1.BranchManager();
    bm.createCommit(message);
}
exports.createCommit = createCommit;
