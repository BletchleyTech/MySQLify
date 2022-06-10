module.exports = function parseConnectionString(connectionString) {
	const url = new URL(connectionString); // parse the url
	if (url.protocol !== 'mysql:') { // if the protocol is not mysql
		throw new Error('Invalid protocol');
	} else if (!url.hostname) { // if the hostname is not set
		throw new Error('Invalid hostname');
	} else if (!url.username) { // if the username is not set
		throw new Error('Invalid username');
	} else if (!url.password) { // if the password is not set
		throw new Error('Invalid password');
	}
	return {
		host: url.hostname,
		user: url.username,
		password: url.password,
		database: url.pathname.substring(1),
		port: url.port || 3306
	};
};