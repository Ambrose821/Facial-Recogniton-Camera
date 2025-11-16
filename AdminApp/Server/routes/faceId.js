var express = require("express");
var router = express.Router();



router.post("/register", (req,res)=>{

	try{
		req.status(200).json({message:"This should regiser a students face"});		

	}catch(error){
	
		req.status(500).json({error:error})
		
	}
	

})



router.post("/identify",(req,res)=>{
        try{
           req.status(200).json({message: "This should try to identify a face"})
        }catch(error){
                req.status(500).json({error:error})
        }
})


module.exports = router




