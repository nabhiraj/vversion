"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = void 0;
const fileUtils_1 = require("./../fileUtils");
function getStatus() {
    //let sm = new StageManager();
    //sm.initStage();
    //let temp = sm.getFilesStatus();
    //console.log(temp);
    //now lets test the diff system
    //createDiffFile(null,'jump.txt','34.txt')
    (0, fileUtils_1.addDiffFile)('joker.txt', '34.txt');
}
exports.getStatus = getStatus;
