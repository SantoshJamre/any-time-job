const baseUrl = 'http://localhost:4000'
// src/utils/api.js

const fetchData = async (endpoint, options) => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, options);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch data.');
    }

    return await response.json();
  } catch (error) {
    return { code: error.code || 500, message: error.message || 'An unexpected error occurred. Please try again later.' };
  }
};

const get = async (endpoint) => {
  return await fetchData(endpoint);
};

const post = async (endpoint, body) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  return await fetchData(endpoint, options);
};

const put = async (endpoint, headers, body) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'access-token': headers.accessToken
      },
      body: JSON.stringify(body),
    };
    return await fetchData(endpoint, options);
  } catch (error) {
    if (error.message === 'expired access token' && error.code) {
      // need to write refresh token logic
    }
  }

};
export { get, post, put };

