import axios from 'axios';

let serverURL = 'http://localhost:4000/api/bitgoapi/';

const instance = axios.create({
   baseURL: serverURL,
});

export default instance;