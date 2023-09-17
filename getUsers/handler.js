const aws = require('aws-sdk');

let config = {}

if (process.env.IS_OFFLINE) {
    config = {
        region: 'localhost',
        endpoint: 'http://0.0.0.0:8000',
        accessKeyId: 'MockAccessKeyId',
        secretAccessKey: 'MockSecretAccessKey',
    }
}
const dynamodb = new aws.DynamoDB.DocumentClient(config);

//const dynamodb = new aws.DynamoDB.DocumentClient();

const getUsers = async (event, context) => {
    let userId = event.pathParameters.id

    var params = {
        ExpressionAttributeValues: { ':pk': userId },
        KeyConditionExpression: 'pk = :pk',
        TableName: 'usersTable'
    };
    return dynamodb.query(params).promise().then(res => {
        console.log(res)
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res})
        }
    })
}

module.exports = {
    getUsers
}