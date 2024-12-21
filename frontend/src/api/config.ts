import axios from "axios";

// Get the user object from localStorage
const root = localStorage.getItem("persist:root");

let token;

if (root) {
  const user = JSON.parse?.(root)?.user;

  const accessToken = JSON.parse(user)?.accessToken;

  console.log("token:", accessToken);

  // Extract the token from the user object
  token = accessToken;
}

// Set up a global Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Base URL for all requests
  withCredentials: true, // Include cookies with requests
});

// Set the token in the Authorization header for all requests
if (token) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

console.log(apiClient);

export { apiClient };
