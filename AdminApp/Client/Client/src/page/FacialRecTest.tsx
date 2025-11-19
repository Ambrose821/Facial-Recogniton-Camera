
import Camera from "../components/Camera";
import "../styles/pages/FacialRecTest.css";
import { useState } from "react";

import { identify } from "../api/IdentifyFace";

export default function FacialRecTest() {
    const [imgUrl, setImgUrl] = useState<string>("");
    const [res,setRes] = useState({})
    
    const [hasResponse,setHasResponse] = useState(true)
    const captureCallback = (imgUrl: string) => {
      setImgUrl(imgUrl)
    };

    const refreshCallback = () => {
        setImgUrl("");
    };

    const handleIdentify = async () =>{
        if(imgUrl){
            const responseData = await identify(imgUrl)
            setRes(responseData)
        }
    }

    

    return (
        <div className="facialrec-test-root">
		   
            <div className="facialrec-camera-container">
                <h2>Capture Photos</h2>
                <Camera captureCallback={captureCallback} refreshCallback={refreshCallback} />
               
                <button onClick={handleIdentify}>Identify</button>
            </div>
            <div className="facialrec-compare-container">
                <h2>Face to Identify</h2>
               {imgUrl &&
               <img src = {imgUrl}/>
               }
            </div>

            {res && (
                <div className="facialrec-photos">
                    {JSON.stringify(res)}
                    
                </div>
            )}
        </div>
    );
}