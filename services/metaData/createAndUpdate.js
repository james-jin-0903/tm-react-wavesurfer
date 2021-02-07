import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, _context) {
  try {
    // check if meta data exist
    const { id } = event.pathParameters;
    const param = {
      TableName: "metaData",
      Key: { id }
    };
    const result = await dynamoDb.get(param).promise();

    // if exist update value
    if (result.Item) {
      const data = JSON.parse(event.body);

      let attributeValues = {};
      let updateExpression = [];

      Object.keys(data).map(row => {
        if (row !== "id") {
          updateExpression.push(`${row} = :${row}`);
          attributeValues[`:${row}`] = data[row] || null;
        }
      });

      const params = {
        TableName: "metaData",
        Key: { id },
        UpdateExpression: `SET ${updateExpression.join(", ")}`,
        ExpressionAttributeValues: attributeValues,
        ReturnValues: "ALL_NEW",
      };
      const result = await dynamoDb.update(params).promise();

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(result),
      };
    } else {
      // if not exist create new metadata
      const data = JSON.parse(event.body);
      const {
        id,
        sessionId,
        metaTagAdditionalInfo,
        metaTagArtist,
        metaTagISRC,
        metaTagLabel,
        metaTagRegion,
        metaTagReleaseDate,
        metaTagTrack
      } = data;
      const params = {
        TableName: "metaData",
        Item: {
          id,
          sessionId,
          metaTagAdditionalInfo,
          metaTagArtist,
          metaTagISRC,
          metaTagLabel,
          metaTagRegion,
          metaTagReleaseDate,
          metaTagTrack
        },
      };

      await dynamoDb.put(params).promise();
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(params.Item),
      };
    }
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
