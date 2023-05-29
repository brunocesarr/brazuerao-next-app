import axios, { AxiosRequestConfig } from 'axios';

const URL_BASE_API_FUTEBOL = process.env.NEXT_PUBLIC_URL_AMBIENTE_SERVER;

const defaultOptions: AxiosRequestConfig = {
	baseURL: URL_BASE_API_FUTEBOL,
	headers: {
		'Content-Type': 'application/json',
	},
};

const apiGoogleSheet = axios.create(defaultOptions);

export default apiGoogleSheet;