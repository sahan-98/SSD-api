import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { handleResponse } from '@/_helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));


export const authenticationService = {
    login,
    logout,
    saveMessage,
    getMessages,
    getDocuments,
    saveDocument,
    downloadDocument,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};


function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    // return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    return fetch(`${config.apiUrl}/api/v1/users/auth`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            console.log(user)

            return user;
        });
}


function saveMessage(obj) {
    const user = currentUserSubject.value

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','x-access-token': user.token},
        body: JSON.stringify(obj)
    };

    // return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    return fetch(`${config.apiUrl}/api/v1/message`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            // currentUserSubject.next(user);

            console.log(user)

            return user;
        });
}

function getMessages() {
    const user = currentUserSubject.value

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json','x-access-token': user.token},
       
    };

    // return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    return fetch(`${config.apiUrl}/api/v1/message`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            // currentUserSubject.next(user);

            console.log(user)

            return user;
        });
}

function getDocuments() {
    const user = currentUserSubject.value

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json','x-access-token': user.token},
       
    };

    // return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    return fetch(`${config.apiUrl}/api/v1/document`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            // currentUserSubject.next(user);

            console.log(user)

            return user;
        });
}

function saveDocument(obj) {
    const user = currentUserSubject.value

    console.log(">><<<",obj)

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','x-access-token': user.token},
        body: JSON.stringify(obj)
    };

    // return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    return fetch(`${config.apiUrl}/api/v1/document`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            // currentUserSubject.next(user);

            console.log(user)

            return user;
        });
}

function downloadDocument(fileName) {
    const user = currentUserSubject.value

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json','x-access-token': user.token},
       
    };

    // return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    return fetch(`${config.apiUrl}/api/v1/document/download/${fileName}`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            // currentUserSubject.next(user);

            console.log(user)

            return user;
        });
}


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
