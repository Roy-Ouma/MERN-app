import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true // if your server uses cookies/auth
});

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
export const emailSignUp = (data) => api.post('/signup', data);

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




