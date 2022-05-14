import axios from 'axios';
import Router from 'next/router';
import { getTokenInfo } from '../../helpers/token.helper';

const server = axios.create({
    baseURL: 'https://homeworkbe.herokuapp.com/',
    headers: {
        'Content-Type': 'application/json'
    }
});

const isAuthorized = async () => {
    return getTokenInfo();
};

export { server, isAuthorized };
