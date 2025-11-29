const AuthLog = require('../db/models/AuthLog');



const createAuthLog = async (logData) =>{
    try{
        const authlog = new AuthLog(logData);
        await authlog.save();
    }catch(error){
        console.error("Error creating auth log:", error);
    }   
}

const getAuthLogs = async () => {

    try {
        const logs = await AuthLog.find().sort({ timestamp: -1 });
        return logs;
    }catch(error){
        console.error("Error retrieving auth logs:", error);
        return null;
    }
}
module.exports = {createAuthLog,getAuthLogs}