import axios from "axios";

const fetcher = axios.create({
   baseURL: "http://34.64.80.226:8080",
   timeout: 3000,
});

export default fetcher;
