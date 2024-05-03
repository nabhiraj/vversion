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
exports.deleteDirectoriesExceptSync = exports.listFiles = exports.constructFileFromDiffArray = exports.addDiffFile = exports.createDiffFile = exports.getHash = exports.createJsonFile = exports.getJsonFromFile = exports.getFileNameFromBranch = exports.setCurrentDir = exports.getStartingDirectory = exports.currentDir = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const child_process_1 = require("child_process");
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
    if (exports.currentDir == null) {
        console.log('no version related information found');
        process.exit(0);
    }
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
function getHash(filePath) {
    const fileData = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5');
    hash.update(fileData);
    return hash.digest('hex');
}
exports.getHash = getHash;
function createDiffFile(initialFilePath, changedFilePath, targetFilePath) {
    let tempFileName = null;
    if (initialFilePath === null) {
        tempFileName = 'empty_old_file_782196.txt';
        createEmptyFile(tempFileName);
        initialFilePath = tempFileName;
    }
    let output;
    try {
        const command = `diff ${initialFilePath} ${changedFilePath}`;
        output = (0, child_process_1.execSync)(command, { encoding: 'utf-8' }); // Redirect stdout to pipe to avoid throwing errors
        fs.writeFileSync(targetFilePath, '');
    }
    catch (error) {
        if (error.status !== 1) { // 1 indicates differences, treat this as expected
            console.log('error in diff');
        }
        else {
            fs.writeFileSync(targetFilePath, error.stdout);
        }
    }
    finally {
        if (tempFileName !== null) {
            fs.unlinkSync(tempFileName);
        }
    }
}
exports.createDiffFile = createDiffFile;
function createEmptyFile(filePath) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    fs.writeFileSync(filePath, '');
}
function addDiffFile(filePath, diffFilePath) {
    if (!fs.existsSync(filePath)) {
        createEmptyFile(filePath);
    }
    const command = `patch ${filePath} ${diffFilePath}`;
    (0, child_process_1.execSync)(command);
}
exports.addDiffFile = addDiffFile;
function constructFileFromDiffArray(diffFileList, targetPath) {
    try {
        if (!fs.existsSync(targetPath)) {
            createEmptyFile(targetPath);
        }
        for (let i = 0; i < diffFileList.length; i++) {
            addDiffFile(targetPath, diffFileList[i]);
        }
        return true;
    }
    catch (e) {
        console.error('error occured while joing the dif files', e);
        return false;
    }
}
exports.constructFileFromDiffArray = constructFileFromDiffArray;
function listFiles(dir, exludeDir) {
    let files = [];
    const dirContents = fs.readdirSync(dir);
    dirContents.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
            if (item != exludeDir) {
                files = files.concat(listFiles(itemPath, exludeDir));
            }
        }
        else {
            files.push(itemPath);
        }
    });
    return files;
}
exports.listFiles = listFiles;
function deleteDirectoriesExceptSync(dirToKeep) {
    try {
        const files = fs.readdirSync('.');
        for (const file of files) {
            const stats = fs.statSync(file);
            if (stats.isDirectory() && file !== dirToKeep) {
                console.log('removing following direcotry', file);
                fs.rmSync(file, { recursive: true });
                console.log(`Deleted directory: ${file}`);
            }
        }
        console.log("All directories deleted except for the specified one.");
    }
    catch (error) {
        console.error("Error occurred while deleting directories:", error);
    }
}
exports.deleteDirectoriesExceptSync = deleteDirectoriesExceptSync;
