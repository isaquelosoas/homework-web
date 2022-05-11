import axios from 'axios';
import Router from 'next/router';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
console.log(SERVER_URL);

const server = axios.create({
    baseURL: SERVER_URL,
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
