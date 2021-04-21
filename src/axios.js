import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://cors-everywhere-me.herokuapp.com/http://3.140.102.246/v1/'
});

instance.interceptors.request.use(config => {
    if(localStorage.getItem("accessToken") !== null) {
      config.headers.Authorization =  localStorage.getItem("accessToken");
    }
    return config;
});

export default instance;