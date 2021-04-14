import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost/v1/'
});

export default instance;