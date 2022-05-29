import axios from "axios";
axios.defaults.withCredentials = true;

export const login = async (user) => {
  const url = `${process.env.REACT_APP_BASIC_URL}/api/v1/login`;
  try {
    const response = await axios.post(url, user);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const register = async (user) => {
  const url = `${process.env.REACT_APP_BASIC_URL}/api/v1/register`;
  try {
    const response = await axios.post(url, user);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const logout = async () => {
  const url = `${process.env.REACT_APP_BASIC_URL}/api/v1/logout`;
  try {
    const response = await axios.post(url);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getUserInfo = async () => {
  const url = `${process.env.REACT_APP_BASIC_URL}/api/v1/userInfo`;
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response;
  }
};
