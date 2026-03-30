import axios from 'axios';

const API_KEY = import.meta.env.VITE_LLAMA_API_KEY;

const llamaApi = axios.create({
  baseURL: import.meta.env.VITE_LLAMA_API_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
  timeout: 60 * 60 * 1000, // 1 hour in milliseconds
});

export default llamaApi;
