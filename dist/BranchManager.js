"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchManager = void 0;
const fs = __importStar(require("fs"));
const fileUtils_1 = require("./fileUtils");
const StageManager_1 = require("./StageManager");
class BranchManager {
    branchExist(branchName) {
        const branchFilePath = `${fileUtils_1.currentDir}/.vversion/${branchName}_branch.json`;
        return fs.existsSync(branchFilePath);
    }
    createBranch(targetBranch, srcBranch = 'main') {
        let data = { IndexCounter: 0, commits: [] };
        if (srcBranch !== null) {
            const srcBranchFile = (0, fileUtils_1.getFileNameFromBranch)(srcBranch);
            data = (0, fileUtils_1.getJsonFromFile)(srcBranchFile);
        }
        const targetBranchFile = (0, fileUtils_1.getFileNameFromBranch)(targetBranch);
        return (0, fileUtils_1.createJsonFile)(targetBranchFile, data);
    }
    setCurrentBranch(branch) {
        const data = { currentBranchName: branch };
        (0, fileUtils_1.createJsonFile)('./.vversion/currentBranch.json', data);
    }
    getCurrentBranchName() {
        const data = (0, fileUtils_1.getJsonFromFile)('./.vversion/currentBranch.json');
        return data.currentBranchName;
    }
    getBranchInfo() {
        return (0, fileUtils_1.getJsonFromFile)((0, fileUtils_1.getFileNameFromBranch)(this.getCurrentBranchName()));
    }
    setBranchInfo(data) {
        (0, fileUtils_1.createJsonFile)((0, fileUtils_1.getFileNameFromBranch)(this.getCurrentBranchName()), data);
    }
    getNextIndex() {
        let data = this.getBranchInfo();
        let count = data.IndexCounter;
        data.IndexCounter++;
        this.setBranchInfo(data);
        return count;
    }
    getNextDiffFileName() {
        let index = this.getNextIndex();
        return this.getCurrentBranchName() + '_diff_' + index;
    }
    getNextCommitHash(state, branchInfo) {
        let data = '';
        for (let key in state) {
            data += state[key].lastHash;
        }
        if (branchInfo.commits && branchInfo.commits.length > 0) {
            data += branchInfo.commits[branchInfo.commits.length - 1].commitVersion;
        }
        return (0, fileUtils_1.getHashFromData)(data);
    }
    createCommit(commitMessage = 'default commit message') {
        let sm = new StageManager_1.StageManager();
        sm.initStage();
        if (!sm.isChanged()) {
            console.log('no change staged which can be commited');
            return false;
        }
        let state = sm.getStateCopy();
        for (let key in state) {
            if (state[key].stageDiff.length > 0) {
                state[key].diffs.push(state[key].stageDiff[0]);
            }
            delete state[key].stageDiff;
        }
        let branchInfo = this.getBranchInfo();
        let lastCommit = {
            "commitVersion": this.getNextCommitHash(sm, branchInfo),
            "commitMessage": commitMessage,
            "files": state
        };
        branchInfo.commits.push(lastCommit);
        this.setBranchInfo(branchInfo);
        let newState = branchInfo.commits[branchInfo.commits.length - 1].files;
        for (let key in newState) {
            newState[key].stageDiff = [];
        }
        sm.setState(newState);
        sm.flushState();
        return true;
    }
}
exports.BranchManager = BranchManager;
