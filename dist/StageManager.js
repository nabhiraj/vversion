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
exports.StageManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fileUtils_1 = require("./fileUtils");
const BranchManager_1 = require("./BranchManager");
class StageManager {
    constructor() {
        this.statePath = './.vversion/state.json';
    }
    listFiles(dir, exludeDir) {
        let files = [];
        const dirContents = fs.readdirSync(dir);
        dirContents.forEach(item => {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            if (stat.isDirectory()) {
                if (item != exludeDir) {
                    files = files.concat(this.listFiles(itemPath, exludeDir));
                }
            }
            else {
                files.push(itemPath);
            }
        });
        return files;
    }
    initStage() {
        if (fs.existsSync(this.statePath)) {
            this.state = (0, fileUtils_1.getJsonFromFile)(this.statePath);
        }
        else {
            this.state = {};
            let bm = new BranchManager_1.BranchManager();
            let branchInfo = bm.getBranchInfo();
            if (branchInfo.commits.length > 0) {
                this.state = branchInfo.commits[branchInfo.commits.length - 1].files;
                for (let key in this.state) {
                    this.state[key].stageDiff = [];
                }
            }
            (0, fileUtils_1.createJsonFile)(this.statePath, this.state);
        }
    }
    flushState() {
        (0, fileUtils_1.createJsonFile)(this.statePath, this.state);
    }
    getFilesStatus() {
        let allFiles = this.listFiles('.', '.vversion');
        let filesChanges = [];
        let filesNotChanged = [];
        let filesDeleted = [];
        for (let i = 0; i < allFiles.length; i++) {
            let file = allFiles[i];
            if (!this.state[file] || (this.state[file] && this.state[file].lastHash != (0, fileUtils_1.getHash)(file))) {
                filesChanges.push(file);
            }
            else {
                filesNotChanged.push(file);
            }
        }
        for (let key in this.state) {
            if (!allFiles.includes(key)) {
                filesDeleted.push(key);
            }
        }
        return { 'changed': filesChanges, 'nochange': filesNotChanged, 'deleted': filesDeleted };
    }
    addFile(filePath) {
        if (fs.existsSync(filePath)) {
            let newHash = (0, fileUtils_1.getHash)(filePath);
            if (this.state[filePath] && this.state[filePath].lastHash == newHash)
                return false;
            let bm = new BranchManager_1.BranchManager();
            let diffFileName = bm.getNextDiffFileName();
            if (!this.state[filePath]) {
                (0, fileUtils_1.createDiffFile)(null, filePath, './.vversion/' + diffFileName);
                this.state[filePath] = { "lastHash": newHash, "diffs": [], "stageDiff": [diffFileName] };
            }
            else {
                let diffArr = JSON.parse(JSON.stringify(this.state[filePath].diffs));
                let previousDiffFileName = this.state[filePath].stageDiff[0];
                console.log('the diffArr is ', diffArr);
                (0, fileUtils_1.constructFileFromDiffArray)(diffArr, './.vversion/temp988');
                (0, fileUtils_1.createDiffFile)('./.vversion/temp988', filePath, './.vversion/' + diffFileName);
                this.state[filePath].lastHash = newHash;
                this.state[filePath].stageDiff = [diffFileName];
                fs.unlinkSync('./.vversion/temp988');
                fs.unlinkSync('./.vversion/' + previousDiffFileName);
            }
            this.flushState();
        }
        else {
            return false;
        }
    }
}
exports.StageManager = StageManager;
