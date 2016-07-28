'use strict';
console.log('Loading function');
const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

function guid(){function n(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return n()+n()+'-'+n()+'-'+n()+'-'+n()+'-'+n()+n()+n()}

exports.handler = function(event, context, callback) {
    
    const operation = event.operation;

    let p;
    
    if          (operation == 'scan')   p = scan();
    else if     (operation == 'create') p = create(event.message);
    else if     (operation == 'read')   p = read(event.id);

    else throw new Error(`Unrecognized operation "${operation}"`);
    
    Promise.resolve(p).then(result => {
        callback(null, result);
    }).catch(error => {
        callback(error);
    });

};


function create(item) {
    if (!item.name) { throw new Error('you need to specify a name for this call'); }
    if (!item.players) item.players = [];
    if (!item.phases) item.phases = {};
    item.id = guid();
    item.currentPhase = 0;
    return dynamo.put({
        Item : item,
        TableName: 'werewolf-game'
    }).promise()
    .then(data => {
        return item;
    });
}

function read(id, callback) {
    return dynamo.get({
        Key : { id : id },
        TableName: 'werewolf-game'
    }).promise()
    .then(data => {
        return data;
    });
}

function scan(callback) {
    return dynamo.scan({
        TableName: 'werewolf-game'
    }).promise()
    .then(data => {
        return data;
    });
}