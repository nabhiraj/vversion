"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutBranch = void 0;
const BranchManager_1 = require("../BranchManager");
const revertCommit_1 = require("./revertCommit");
const StageManager_1 = require("../StageManager");
function checkoutBranch(targetBranch, srcBranch) {
    let bm = new BranchManager_1.BranchManager();
    let currentBranch = bm.getCurrentBranchName();
    if (currentBranch === targetBranch) {
        console.log('already on the same branch.');
        return;
    }
    if (!bm.branchExist(targetBranch)) {
        console.log('creating the new branch');
        bm.createBranch(targetBranch, srcBranch);
    }
    console.log('switching to the new branch');
    bm.setCurrentBranch(targetBranch);
    let branchInfo = bm.getBranchInfo();
    let lastCommitId = branchInfo.commits[branchInfo.commits.length - 1].commitVersion;
    (0, revertCommit_1.revert)(lastCommitId);
    let sm = new StageManager_1.StageManager();
    sm.initStage();
    sm.resetStage();
}
exports.checkoutBranch = checkoutBranch;
