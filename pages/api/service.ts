import axios from 'axios';
import Router from 'next/router';

const server = axios.create({
    baseURL: 'https://homeworkbe.herokuapp.com/',
    headers: {
        'Content-Type': 'application/json'
    }
});

const isAuthorized = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        Router.push('/');
    }
    try {
        const res = await server.post('/auth/verify', {}, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    } catch (error) {
        Router.push('/');
    }
};

export { server, isAuthorized };
