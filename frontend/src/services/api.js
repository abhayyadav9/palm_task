const API_BASE_URL = "http://localhost:5000";

export const loginApi = `${API_BASE_URL}/api/user/login`;
export const registerApi = `${API_BASE_URL}/api/user/register`;
export const logoutApi = `${API_BASE_URL}/api/user/logout`;
export const usersApi = `${API_BASE_URL}/api/user/users`;

export const getUsersApi = ({ page = 1, limit = 10, query = "" } = {}) => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});

	if (query.trim()) {
		params.set("query", query.trim());
	}

	return `${usersApi}?${params.toString()}`;
};




//for the messages api

export const sendMessageApi = `${API_BASE_URL}/api/message/send`;
export const getMessagesApi = `${API_BASE_URL}/api/message/get`;