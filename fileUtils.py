import json
def getFileNameFromBranch(srcBranch):
    return './.vversion/'+srcBranch+'_branch.json'

def getJsonFromFile(file):
    try:
        with open(file, 'r') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
        return {}
    except json.JSONDecodeError:
        print(f"Error decoding JSON in file '{file_path}'.")
        return {}

def createJsonFile(filePath,data):
    with open(filePath, 'w') as file:
        json.dump(data, file, indent=4)
    return True





