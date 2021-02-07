import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, _context) {
  const params = {
    TableName: "metaData",
    Key: { id: event.pathParameters.id },
    ReturnValues: "ALL_OLD"
  };

  try {
    const result = await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ result: false, error: e.message }),
    };
  }
}
