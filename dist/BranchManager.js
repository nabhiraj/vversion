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
class BranchManager {
    branchExist(branchName) {
        const branchFilePath = `${fileUtils_1.currentDir}/.vversion/${branchName}_branch.json`;
        return fs.existsSync(branchFilePath);
    }
    createBranch(targetBranch, srcBranch = 'main') {
        let data = { version: 0, commits: [] };
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
    getCurrentBranch() {
        return this.getCurrentBranchName();
    }
    getCurrentBranchName() {
        const data = (0, fileUtils_1.getJsonFromFile)('./.vversion/currentBranch.json');
        return data.currentBranchName;
    }
}
exports.BranchManager = BranchManager;
