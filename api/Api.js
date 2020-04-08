import axios from 'axios';

// Create axios client, pre-configured with baseURL
let APIKit = axios.create({
  baseURL: 'http://newdemo.aplikasiskripsi.com/fungky_ws/api/services',
  timeout: 10000,
});



export default APIKit;