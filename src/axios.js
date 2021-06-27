import axios from 'axios';

import { CIRCLE_SANDBOX_APIKEY } from './config';

let serverURL = 'https://api-sandbox.circle.com/';

const instance = axios.create({
   baseURL: serverURL,
   headers: {"Authorization": `Bearer ${CIRCLE_SANDBOX_APIKEY}`}
});

export default instance;