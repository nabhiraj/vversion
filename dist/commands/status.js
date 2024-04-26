"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = void 0;
const StageManager_1 = require("./../StageManager");
function getStatus() {
    let sm = new StageManager_1.StageManager();
    sm.loadStage();
    sm.findFilesWithDifference();
}
exports.getStatus = getStatus;
