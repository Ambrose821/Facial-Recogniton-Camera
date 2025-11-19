import { RekognitionClient,CreateCollectionCommand,IndexFacesCommand , SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";



const runFaceId = async(bytes) =>{
    const client = new RekognitionClient({
        region: "us-east-1",
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    })

    const command = new SearchFacesByImageCommand({
        CollectionId:"students",
        FaceMatchThreshold: 30,
        Image: {Bytes:bytes}
    })

    const response = await client.send(command)
    return response
}

const registerFace = async(bytes, user_id) => {

    const rekognitionClient = new RekognitionClient({
    region: "us-east-1", // change to your region
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
    });
    console.log(typeof bytes)

    const command = new IndexFacesCommand({
        CollectionId:"students",
        Image: {Bytes:bytes},
        ExternalImageId: user_id
    })

    const response = await rekognitionClient.send(command)

    console.log(response)
    return response
   
}

const createCollection = async (collectionName) =>{

    const rekognitionClient = new RekognitionClient({
    region: "us-east-1", // change to your region
     credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
    });
    console.log(process.env.AWS_ACCESS_KEY)
    console.log(process.env.AWS_SECRET_KEY)
    const command = new CreateCollectionCommand({CollectionId:collectionName})
    const response =  await rekognitionClient.send(command)
    console.log(response)
}

export {createCollection,registerFace,runFaceId}