import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost/v1/'
});

instance.interceptors.request.use(config => {
    if(localStorage.getItem("accessToken") !== null) {
      config.headers.Authorization =  localStorage.getItem("accessToken");
    }
    return config;
});

export default instance;