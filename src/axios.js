import axios from 'axios';

//let serverURL = 'http://localhost:4000/api/';
let serverURL = 'https://defidonorsapi.herokuapp.com/api/';

const instance = axios.create({
   baseURL: serverURL,
});

export default instance;