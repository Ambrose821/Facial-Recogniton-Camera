import api from "../api";

// Fetch all unique user IDs (ExternalImageId) from the backend
export const listUserIds = async (): Promise<string[]> => {
  try {
    const res = await api.get("/faceid/users");
    // Expecting { userIds: string[] }
    return res.data?.userIds ?? [];
  } catch (err) {
    return [];
  }
};

// Delete all faces for a given userId in the collection
export const deleteFacesByUserId = async (userId: string): Promise<boolean> => {
  try {
    const res = await api.delete(`/faceid/users/${encodeURIComponent(userId)}`);
    // Expecting { deleted: string[], faceIds: string[] }
    return res.status === 200;
  } catch (err) {
    return false;
  }
};
