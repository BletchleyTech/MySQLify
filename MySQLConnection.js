const mysql = require('mysql');
const parseConnectionString = require('./parseConnectionString');

class MySQLConnection {
	#host;
	#user;
	#database;
	#connection;
	constructor(configuration) {
		if (typeof configuration === 'string') {
			// if configuration is a connection string e.g. mysql://user:password@host:port/database
			configuration = parseConnectionString(configuration);
		}
		this.#host = configuration.host;
		this.#user = configuration.user;
		this.#database = configuration.database;
		this.#connection = mysql.createConnection(configuration);
		this.connect();
	}
	get host() {
		return this.#host;
	}
	get currentUser() {
		return this.#user;
	}
	get currentDatabase() {
		return this.#database;
	}
	get connectionId() {
		return this.#connection.threadId;
	}
	get config() {
		return {
			host: this.#host,
			user: this.#user,
			database: this.#database,
			connectionId: this.connectionId
		};
	}
	connect() {
		return new Promise((resolve, reject) => {
			this.#connection.connect((err) => {
				// connect to the database
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
	query(sql, values = null) {
		if (sql.sql) {
			// if sql is a query object
			return new Promise((resolve, reject) => {
				this.#connection.query(sql, (err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
			});
		}
		return new Promise((resolve, reject) => {
			// if sql is a string
			this.#connection.query(sql, values, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}
	ping() {
		return new Promise((resolve, reject) => {
			this.#connection.ping((err) => {
				// check if the connection is still alive
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
	changeConnection(changeOptions) {
		return new Promise((resolve, reject) => {
			this.#connection.changeUser(changeOptions, (err) => {
				// change the connection settings
				if (err) {
					reject(err);
				} else {
					this.#database = changeOptions.database ? changeOptions.database : this.#database;
					this.#user = changeOptions.user ? changeOptions.user : this.#user;
					resolve();
				}
			});
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this.#connection.end((err) => {
				// end the connection gracefully
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}

module.exports = MySQLConnection;
