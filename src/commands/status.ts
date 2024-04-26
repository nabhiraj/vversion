import { StageManager } from "./../StageManager";
export function getStatus(){
    let sm = new StageManager();
    sm.loadStage();
    sm.findFilesWithDifference();
}