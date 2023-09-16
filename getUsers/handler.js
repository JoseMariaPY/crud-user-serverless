const aws = require('aws-sdk');


const dynamodb = new aws.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://0.0.0.0:8000',
    accessKeyId: 'MockAccessKeyId',
    secretAccessKey: 'MockSecretAccessKey',
  });

//const dynamodb = new aws.DynamoDB.DocumentClient();

const getUsers = async (event, context) => {
    console.log("event", event)
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