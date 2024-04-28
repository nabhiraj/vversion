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
exports.addResource = void 0;
const StageManager_1 = require("./../StageManager");
const fileUtils_1 = require("./../fileUtils");
const path = __importStar(require("path"));
function addResource() {
    if (process.argv.length >= 4) {
        let filePath = process.argv[3];
        let absPath = path.resolve(filePath);
        (0, fileUtils_1.setCurrentDir)();
        filePath = path.relative(process.cwd(), absPath);
        let sm = new StageManager_1.StageManager();
        sm.initStage();
        sm.addFile(filePath);
    }
    else {
        console.log('problem with command giving format');
    }
}
exports.addResource = addResource;
