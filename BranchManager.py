import commanData # contains the path from where we are executing all the things root of the src folder inside this there will be a directory called .vversion
import os
import fileUtils

#we need to create a file util file which this branchManager will use.
class BranchManager:

    def branchExist(self,branchName):
        print('the value of common data is ',commanData.currentDir)
        if os.path.exists(os.path.join(commanData.currentDir+'/.vversion', branchName+'_branch.json')):
            return True
        else:
            return False

    def createBranch(self,targetBranch,srcBranch='main'):
        data = {"version":0,"commits":[]}
        if srcBranch != None:
            data = fileUtils.getJsonFromFile(fileUtils.getFileNameFromBranch(srcBranch))
        fileUtils.createJsonFile(fileUtils.getFileNameFromBranch(targetBranch),data)
        return True

    def setCurrentBranch(self,branch):
        data = {"currentBranchName":branch}
        fileUtils.createJsonFile('./.vversion/currentBranch.json',data)

    def getCurrentBranch(self):
        return fileUtils.getCurrentBranchName()
    
    def getCurrentBranchName(self):
        data = fileUtils.getJsonFromFile('./.vversion/currentBranch.json')
        return data['currentBranchName']
        

            

