
const BASE_URL = 'http://35.247.144.129:8080';

const TOKEN = (window as any)._getFarmToken?.() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyIiwibG9naW5NYXJrIjoiYnl4aDRXUEEiLCJpcCI6IjIyMC4yNDYuMjUyLjQ3IiwibG9naW5UaW1lc3RhbXAiOiIxNjcwMzM4MTcwMjI0In0.wumb3p4IzN9kQjKfEN82vGgczzgo2Uh-LkDt08f0SCE';

export const DEFAULT_HEADERS = {
    token: TOKEN, // typeof window !== "undefined" ? window.localStorage.getItem('FARM_TOKEN') : '',
};

export class RequestError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

class Request {
    public post(url: string, data?: Record<string, any>) {
        return this._request(url, 'POST', data);
    }

    public get(url: string, params?: Record<string, any>) {
        return this._request(url, 'GET', params);
    }

    private _request(url: string, method: 'POST' | 'GET', data?: Record<string, any>) {
        const init: RequestInit = {
            method,
            headers: {
                ...DEFAULT_HEADERS,
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        };
        if (method === 'POST' && data) {
            init.body = JSON.stringify(data);
        }
        return fetch(BASE_URL + url, init)
            .then(res => {
                if (res.status !== 200) {
                    return Promise.reject(new RequestError(res.statusText, res.status));
                } else {
                    return res.json();
                }
            }).then(json => {
                if (json.status !== '200') {
                    return Promise.reject(new RequestError(json.message, Number(json.status)));
                }
                return json;
            });
    }
}

export default new Request();
