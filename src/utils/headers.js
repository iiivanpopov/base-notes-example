export const getAuthHeader = (req) =>
	req.headers.Authorization || req.headers.authorization;

export const getJwtFromHeader = (req) => getAuthHeader(req).split(" ")[1];
