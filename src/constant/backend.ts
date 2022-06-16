import axios from 'axios';

axios.defaults.headers.common['uname'] = process.env.ADMIN_NAME as string; // for all requests
axios.defaults.headers.common['pw'] = process.env.ADMIN_PW as string;
export const API_URL = process.env.API_URL;
