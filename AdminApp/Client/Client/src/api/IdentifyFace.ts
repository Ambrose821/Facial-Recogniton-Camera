import api from '../api';
export const identify = async (imgUrl: string) => {
  try {
    const response = await api.post('/faceid/identify', { img: imgUrl });

    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
