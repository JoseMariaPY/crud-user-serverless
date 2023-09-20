const aws = require('aws-sdk');

let config = {}

if (process.env.IS_OFFLINE) {
    config = {
        region: process.env.REGION,
        endpoint: process.env.ENDPOINT,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
}
const dynamodb = new aws.DynamoDB.DocumentClient(config);

//const dynamodb = new aws.DynamoDB.DocumentClient();

const getUserById = async (event, context) => {
    let userId = event.pathParameters.id

    var params = {
        ExpressionAttributeValues: { ':pk': userId },
        KeyConditionExpression: 'pk = :pk',
        TableName: 'usersTable'
    };
    

    try {
        return dynamodb.query(params).promise().then(res => {
            console.log(res)
            return {
                "statusCode": 200,
                "body": JSON.stringify({ 'user': res.Items[0] })
            }
        })
      } catch (error) {
        console.log(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'No se pudo obtener el registro' }),
        };
      }
}

module.exports = {
    getUserById
}