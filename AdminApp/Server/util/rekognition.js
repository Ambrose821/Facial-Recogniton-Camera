import { RekognitionClient,CreateCollectionCommand,IndexFacesCommand , SearchFacesByImageCommand, ListFacesCommand, DeleteFacesCommand } from "@aws-sdk/client-rekognition";



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


// List all unique ExternalImageId values (user IDs) in the collection
const listUserIds = async () => {
    const client = new RekognitionClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    });

    const userIds = new Set();
    let nextToken = undefined;

    do {
        const command = new ListFacesCommand({
            CollectionId: "students",
            NextToken: nextToken,
            MaxResults: 1000
        });
        const resp = await client.send(command);
        (resp.Faces || []).forEach(face => {
            if (face.ExternalImageId) {
                userIds.add(face.ExternalImageId);
            }
        });
        nextToken = resp.NextToken;
    } while (nextToken);

    return Array.from(userIds);
};

// Delete all faces in the collection that match a given ExternalImageId (userId)
const deleteFacesByUserId = async (userId) => {
    const client = new RekognitionClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    });

    // First, gather FaceIds for faces with this ExternalImageId
    let nextToken = undefined;
    const faceIds = [];
    do {
        const listCmd = new ListFacesCommand({
            CollectionId: "students",
            NextToken: nextToken,
            MaxResults: 1000
        });
        const resp = await client.send(listCmd);
        (resp.Faces || []).forEach(face => {
            if (face.ExternalImageId === userId && face.FaceId) {
                faceIds.push(face.FaceId);
            }
        });
        nextToken = resp.NextToken;
    } while (nextToken);

    if (faceIds.length === 0) {
        return { deleted: [], message: "No faces found for userId" };
    }

    // Delete those faces
    const delCmd = new DeleteFacesCommand({
        CollectionId: "students",
        FaceIds: faceIds
    });
    const delResp = await client.send(delCmd);
    return { deleted: delResp.DeletedFaces || [], faceIds };
};

export { listUserIds, deleteFacesByUserId,createCollection,registerFace,runFaceId };