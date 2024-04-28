import { StageManager } from "./../StageManager";
export function getStatus(){
    let sm = new StageManager();
    sm.initStage();
    let temp = sm.getFilesStatus();
    console.log('file which are changed',temp.changed);
    console.log('files which are deleted',temp.deleted);
}