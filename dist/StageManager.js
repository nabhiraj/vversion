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
class StageManager {
    constructor() {
        this.statePath = './.vversion/state.json';
    }
    //stageDirPath:string = './.vversion/stage';
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
            console.log('ths state something looks like this', this.state);
        }
        else {
            this.state = {}; //we should get it from the privious commit
            //fs.mkdirSync(this.stageDirPath, { recursive: true });
            (0, fileUtils_1.createJsonFile)(this.statePath, this.state);
        }
    }
    getFilesStatus() {
        let allFiles = this.listFiles('.', '.vversion');
        //now we need to calculate the hash of these files.ls
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
        //now we need to find the files which we are about to delete.
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
            if (!this.state[filePath]) {
                //its a new file
            }
            else {
                //its a change in the old file
            }
        }
        else {
            return false;
        }
    }
}
exports.StageManager = StageManager;
