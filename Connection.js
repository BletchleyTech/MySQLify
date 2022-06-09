const mysql = require('mysql');

class MySQLConnection {
    #connection;
    constructor(configuration) {
        if (typeof configuration === 'string') {
            const url = new URL(configuration);
            configuration = {
                host: url.host,
                user: url.username,
                password: url.password,
                database: url.pathname.slice(1),
            }
        }
        this.#connection = mysql.createConnection(configuration);
        this.connect();
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.#connection.connect((err) => { // connect to the database
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    query(sql, values=null) {
        if (sql.sql) { // if sql is a query object
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
        return new Promise((resolve, reject) => { // if sql is a string
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
            this.#connection.ping((err) => { // check if the connection is still alive
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.#connection.end((err) => { // end the connection gracefully
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
};

module.exports = MySQLConnection;