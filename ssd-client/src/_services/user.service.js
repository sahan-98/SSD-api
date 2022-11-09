import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll,
    getById
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    // return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
    return fetch(`${config.apiUrl}/api/v1/users/`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    // return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
    return fetch(`${config.apiUrl}/api/v1/users/${id}`, requestOptions).then(handleResponse);
}