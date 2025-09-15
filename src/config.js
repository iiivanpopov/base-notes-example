import "dotenv/config";

export const config = {
	port: process.env.PORT,
	jwtSecret: process.env.JWT_SECRET,
	db: {
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
		port: Number(process.env.DB_PORT),
	},
};
