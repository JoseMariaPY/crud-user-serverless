const aws = require("aws-sdk");
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const { randomUUID } = require("crypto");
 
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


module.exports.createUsers = async (event) => {
  const data = JSON.parse(event.body);
  data.pk = randomUUID();

  const params = {
    TableName: process.env.DB_TABLE,
    Item: data,
  };

  console.log(data)

  try {
    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No se pudo crear el registro' }),
    };
  }
};
