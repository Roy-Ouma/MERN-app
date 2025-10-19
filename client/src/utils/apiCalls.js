import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8800/api';

// existing helper used by Signup page (client previously fetched Google userinfo then posted to server)
export const getGoogleSignUp = async (accessToken) => {
  try {
    const { data: user } = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (user?.sub) {
      const data = {
        name: user.name,
        email: user.email,
        emailVerified: user.email_verified,
        image: user.picture,
      };

      const result = await axios.post(`${API_BASE_URL}/auth/google-signup`, data);
      return result?.data;
    }

    return { success: false, message: 'Invalid Google response' };
  } catch (error) {
    const err = error?.response?.data || error?.response || error;
    console.error('Error during Google Sign-Up:', err);
    return { error: err };
  }
};

// emailSignUp: accepts FormData or plain object. If FormData, convert to JSON (ignore binary file on client->server for now).
export const emailSignUp = async (data) => {
  try {
    let payload;
    let headers = {};

    if (data instanceof FormData) {
      // convert to plain object, ignore file binary (server accepts profile as URL or skip)
      payload = {};
      for (const [key, value] of data.entries()) {
        if (key === 'profile') {
          // skip file binary; if you want to upload file, add multer on server and send FormData directly
          continue;
        }
        payload[key] = value;
      }
      headers['Content-Type'] = 'application/json';
    } else {
      payload = data;
      headers['Content-Type'] = 'application/json';
    }

    const res = await axios.post(`${API_BASE_URL}/auth/signup`, payload, { headers });
    return res.data;
  } catch (error) {
    const err = error?.response?.data || error?.response || error;
    console.error('Error during Email Sign-Up:', err);
    return { error: err };
  }
};

// client -> server Google sign-in (server will verify token with Google)
export async function getGoogleSignIn(accessToken) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/google`, { access_token: accessToken });
    return res.data;
  } catch (error) {
    const err = error?.response?.data || error?.response || error;
    console.error('Error during Google Sign-In:', err);
    return { error: err };
  }
}




