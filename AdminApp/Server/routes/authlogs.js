const express = require("express");
const router = express.Router()
const {getAuthLogs} = require("../crud/AuthLogs")


router.get("/authlogs", async(req,res)=>{
    try{

        const logs = await getAuthLogs()
        res.status(200).json({logs:logs})
    }
    catch(error){
        console.error("Error fetching auth logs:", error);
        res.status(500).json({error:"Internal Server Error"})
    }
})

module.exports = router