import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, _context) {
  if (event.pathParameters) {
    const { id } = event.pathParameters;

    const params = {
      TableName: "metaData",
      FilterExpression: "sessionId = :sessionId",
      ExpressionAttributeValues: {
        ":sessionId": id,
      },
    };

    const result = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ result: result.Items }),
    };
  } else {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ result: false }),
    };
  }
}
