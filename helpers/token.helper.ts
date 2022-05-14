import Router from 'next/router';
import { ITokenInfo } from '../interfaces/tokenInfo.interface';
import { server } from '../pages/api/service';

interface TokenResponse extends ITokenInfo {
    token: string;
}

export async function getTokenInfo(): Promise<TokenResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
        Router.push('/');
    }
    try {
        const res = await server.post('/auth/verify', {}, { headers: { Authorization: `Bearer ${token}` } });
        return { token, ...res.data };
    } catch (error) {
        Router.push('/');
    }
    return {
        token: '',
        id: '',
        name: '',
        userBalance: 0
    };
}
