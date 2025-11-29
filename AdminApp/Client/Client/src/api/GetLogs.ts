import api from '../api';

const getLogs = async () => {
  try {
    const response = await api.get('/logs/authLogs');
    console.log(response.data.logs);
    return response.data.logs;
  } catch (error: any) {
    return error.response.data;
  }
};

export default getLogs;
