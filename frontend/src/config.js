const dev = {
    BackendLocation: 'localhost',
    BackendPort: 8080,
    http: 'http'
};
  
const prod = {
    BackendLocation: 'www.studentcalendar.xyz',
    BackendPort: 8443,
    http: 'https'
};
  
const config = process.env.NODE_ENV === "production" ? prod : dev;

const myConfig = { ...config };
export default myConfig;