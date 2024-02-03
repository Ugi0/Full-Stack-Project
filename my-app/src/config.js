const dev = {
    BackendLocation: 'localhost'
};
  
const prod = {
    BackendLocation: '16.170.248.48'
};
  
const config = process.env.NODE_ENV === "production" ? prod : dev;

const myConfig = { ...config, BackendPort: 8080 };
export default myConfig;
