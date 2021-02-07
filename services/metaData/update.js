import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, _context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  let attributeValues = {};
  let updateExpression = [];

  Object.keys(data).map(row => {
    updateExpression.push(`${row} = :${row}`);
    attributeValues[`:${row}`] = data[row] || null;
  });

  const params = {
    TableName: "metaData",
    Key: { "id": event.pathParameters.id },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeValues: attributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();

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
      body: JSON.stringify({ error: e.message }),
    };
  }
}
