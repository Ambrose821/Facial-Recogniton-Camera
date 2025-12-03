var express = require("express");
var router = express.Router();
var {registerFace,runFaceId} = require("../util/rekognition")
var {createAuthLog} = require("../crud/AuthLogs")



router.post("/setCameraIP", (req,res)=>{
        const {cameraIP} = req.body
        req.app.locals.cameraIP = cameraIP
        console.log("Camera IP set to:", req.app.locals.cameraIP)
        res.status(200).json({message:"Camera IP set successfully"})
})

router .get("/getCameraIP",(req,res)=>{
        const cameraIP = req.app.locals.cameraIP
        if(!cameraIP){
                res.status(500).json({error:"Camera IP not set. Keep trying..."})
        }else{
                res.status(200).json({cameraIP:cameraIP})
        }

})
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
        

                console.log(response)
                
                res.status(200).json({message:"This should register a student's face"});		

	}catch(error){
         console.error("AWS Error name:", error.name);
        console.error("AWS Error message:", error.message);
        console.error("AWS Error details:", error);
        console.log(error)
                res.status(500).json({error:error})
		
	}
	

})



router.post("/identify",async (req,res)=>{
        try{
           const {img}= req.body
           console.log(typeof img)
           const cleanImage = img.replace(/^data:image\/\w+;base64,/,"")
           const bytes = Buffer.from(cleanImage,"base64")

           const response = await runFaceId(bytes)
           const FaceMatches = response.FaceMatches
           if( FaceMatches && FaceMatches.length > 0){
                const bestMatch = FaceMatches[0]
                const student_id = bestMatch.Face.ExternalImageId
                await createAuthLog({userId:student_id,timestamp:Date.now(),success:true,imageCapture:img})
                res.status(200).json({message: response})
           }else{
                await createAuthLog({userId:null,timestamp:Date.now(),success:false,imageCapture:img})
                res.status(404).json({message:"No face match found"})
           }
           
           

        }catch(error){
                 console.error("AWS Error name:", error.name);
        console.error("AWS Error message:", error.message);
        console.error("AWS Error details:", error);
        console.log(error)
        await createAuthLog({userId:null,timestamp:Date.now(),success:false,imageCapture:img})
        res.status(500).json({error:error})
        }
})


module.exports = router




