var express = require("express");
var router = express.Router();
var {registerFace} = require("../util/rekognition")



router.post("/register", async (req,res)=>{

	try{

                const {firstName, lastName, identifier, imgUrls }= req.body
                console.log(imgUrls[0])
   
                const imgBytes = imgUrls.map((img) => {
                        const base64 = img.replace(/^data:image\/\w+;base64,/, "");
                        const buf = Buffer.from(base64, "base64");
                        console.log("Decoded buffer length:", buf.length);
                        return buf;
                });
                const student_id = identifier
                console.log(imgBytes[0])
                console.log(student_id)
                const response = await registerFace(imgBytes[0],student_id)
                
                res.status(200).json({message:"This should register a student's face"});		

	}catch(error){
         console.error("AWS Error name:", error.name);
        console.error("AWS Error message:", error.message);
        console.error("AWS Error details:", error);
        console.log(error)
                res.status(500).json({error:error})
		
	}
	

})



router.post("/identify",(req,res)=>{
        try{
           const {firstName, lastName, identifier, imgUrls }= req.body
           console.log({firstName, lastName, identifier, imgUrls })
           res.status(200).json({message: "This should try to identify a face"})
           

        }catch(error){
                res.status(500).json({error:error})
        }
})


module.exports = router




