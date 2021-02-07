import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, _context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
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

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(params.Item),
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
