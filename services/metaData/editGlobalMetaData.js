import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, _context) {
  try {
    const data = JSON.parse(event.body);
    console.log(data);
    for(let i = 0; i < data.length; i++) {
      const id = data[i]["id"];
      const params = {
        TableName: "metaData",
        Key: { id }
      };
      const metaData = await dynamoDb.get(params).promise();

      if (metaData.Item) {
        const params = {
          TableName: "metaData",
          Item: data[i],
        };
        await dynamoDb.put(params).promise();
      } else {
        let attributeValues = {};
        let updateExpression = [];

        Object.keys(data[i]).map(row => {
          if (row !== "id") {
            updateExpression.push(`${row} = :${row}`);
            attributeValues[`:${row}`] = data[i][row] || null;
          }
        });
        const params = {
          TableName: "metaData",
          Key: { id },
          UpdateExpression: `SET ${updateExpression.join(", ")}`,
          ExpressionAttributeValues: attributeValues,
          ReturnValues: "ALL_NEW",
        };

        await dynamoDb.update(params).promise();
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ result: true }),
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
