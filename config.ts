const config = {
  production: "https://gigupserver-d94fc174e3bf.herokuapp.com",
  development: "http://localhost:8080",
};

export const SOCKET_URL = () => {
  return config[process.env.NODE_ENV || "development"];
};
