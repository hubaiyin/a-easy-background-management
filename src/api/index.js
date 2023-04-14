import axios from 'axios';

const request = axios.create({
    baseURL: 'http://82.157.249.75:6789',
    timeout: 5000
})

request.interceptors.request.use((config) => {
    if (localStorage.getItem('token')) {
        config.headers['Authorization'] = localStorage.getItem('token')
        // console.log(config.headers['Authorization']);
    }
    return config;
})

export default request;