
'use strict';

const request = require('request-promise');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


// You must return a Promise when performing asynchronous tasks inside a Functions such as
// writing to the Firebase Realtime Database.

exports.shortenURL = functions.database.ref('/users/{author}/notes/{note}/downloadURL')
    .onWrite(event => {

    console.log('url shortening');
    const original = event.data.val();
    return request({
        uri: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyACH0sMJ7xl2ePl5OKkAlKfqGf32oYg8Z4',
        method: 'POST',
        body: {
            longUrl: original
        },
        json: true,
        resolveWithFullResponse: true,
        }).then((res) => {
        let body = res.body;
        let url = body.id;
        return event.data.ref.parent.child('shortURL').set(url);
        })
        .catch((err) => console.log(err));
    });