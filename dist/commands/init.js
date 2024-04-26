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
exports.applyInit = void 0;
const BranchManager_1 = require("./../BranchManager");
const fileUtils_1 = require("./../fileUtils");
const fs = __importStar(require("fs"));
function applyInit() {
    let bm = new BranchManager_1.BranchManager();
    if (!fs.existsSync('./.vversion')) {
        fs.mkdirSync('.vversion');
    }
    (0, fileUtils_1.setCurrentDir)();
    if (fileUtils_1.currentDir == null) {
        process.exit();
    }
    if (!bm.branchExist('main')) {
        bm.createBranch('main', null);
        bm.setCurrentBranch('main');
    }
    return true;
}
exports.applyInit = applyInit;
