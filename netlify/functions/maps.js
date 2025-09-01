export const handler = async () => {
  const key = process.env.GOOGLE_MAPS_KEY;

  const encodedKey = Buffer.from(key).toString("base64");

  return {
    statusCode: 200,
    body: JSON.stringify({
      encodedKey,
    }),
  };
};
