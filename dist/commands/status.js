"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = void 0;
const StageManager_1 = require("./../StageManager");
function getStatus() {
    let sm = new StageManager_1.StageManager();
    sm.initStage();
    let temp = sm.getFilesStatus();
    console.log('file which are changed', temp.changed);
    console.log('files which are deleted', temp.deleted);
}
exports.getStatus = getStatus;
