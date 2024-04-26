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
exports.createJsonFile = exports.getJsonFromFile = exports.getFileNameFromBranch = exports.setCurrentDir = exports.getStartingDirectory = exports.currentDir = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.currentDir = '';
function getStartingDirectory() {
    let currentDir = process.cwd();
    while (true) {
        if (fs.existsSync(path.join(currentDir, '.vversion'))) {
            return currentDir;
        }
        else {
            let parentDir = path.dirname(currentDir);
            if (parentDir === currentDir) { // Check if it's the root directory
                return null;
            }
            else {
                process.chdir(parentDir);
                currentDir = parentDir;
            }
        }
    }
}
exports.getStartingDirectory = getStartingDirectory;
function setCurrentDir() {
    exports.currentDir = getStartingDirectory();
}
exports.setCurrentDir = setCurrentDir;
function getFileNameFromBranch(srcBranch) {
    return `./.vversion/${srcBranch}_branch.json`;
}
exports.getFileNameFromBranch = getFileNameFromBranch;
function getJsonFromFile(file) {
    try {
        const data = fs.readFileSync(file, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`File '${file}' not found.`);
        }
        else {
            console.log(`Error decoding JSON in file '${file}'.`);
        }
        return {};
    }
}
exports.getJsonFromFile = getJsonFromFile;
function createJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
        return true;
    }
    catch (error) {
        console.log(`Error writing JSON file '${filePath}'.`);
        return false;
    }
}
exports.createJsonFile = createJsonFile;
