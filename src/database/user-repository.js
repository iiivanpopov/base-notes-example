const one = (res) => res.rows[0] || null;

export const createUser = async ({ username, passwordHash, email }) =>
	one(
		await pool.query(
			`INSERT INTO users (email, username, password_hash)
     	 VALUES ($1, $2, $3)
       RETURNING *`,
			[email, username, passwordHash],
		),
	);

const findUser = async (field, value) =>
	one(await pool.query(`SELECT * FROM users WHERE ${field} = $1`, [value]));

export const getUserByUsername = (username) => findUser("username", username);
export const getUserById = (id) => findUser("id", id);
export const getUserByEmail = (email) => findUser("email", email);
