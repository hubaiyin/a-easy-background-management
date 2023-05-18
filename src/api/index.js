import axios from 'axios';

const request = axios.create({
    baseURL: 'http://2022vue.katerkcl.top:6789/',
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