# **MySQLify**

MySQLify is a Promise-based Node.js wrapper for the [mysql](https://www.npmjs.com/package/mysql) npm package.

MySQLify aims to make working with a MySQL database easier by providing a promise-based API built on top of the already reliable [mysql](https://www.npmjs.com/package/mysql) package.

**Note: MySQLify is not a replacement for the mysql package. It is a wrapper for the mysql package.**

## **Installation**

```shell
$ npm install @bletchley-tech/mysqlify
```

## **Usage**

MySQLify is built *on top* of mysql, which means that everything you can do with the mysql package you can do with MySQLify.

While with mysql you'd write code like this:

```javascript
connection.query("SELECT * FROM Users;", (err, users, fields) => {
    if (err) throw err;
    return users;
});
```

MySQLify simplifies this to:

```javascript
const users = await connection.query("SELECT * FROM Users;");

// or

connection.query("SELECT * FROM Users;")
.then(users => {
    // do something with users
})
.catch(err => {
    // handle error
});
```

In so doing, MySQLify provides a simpler, cleaner method of working with MySQL databases by removing callbacks and avoiding falling into 'callback hell'.

**Note: MySQLify does NOT yet support pool connections. For the time being, use the mysql package for pool connections.**

### **MySQLConnection**

MySQLify provides a MySQLConnection class that wraps the mysql connection.

To create a connection to a MySQL instance, regardles of whether it is locally- or remotely-hosted, you can use the following code:

```javascript
const connection = new MySQLConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "my_database"
});

// or

const connection = new MySQLConnection('mysql://root:password@localhost/my_database');
```

### **Class Methods**

#### *connect()*

By default, initializing a MySQLConnection instance will connect to the database. Regardless, the class provides a `connect()` method that can be used to connect to the database.

```javascript
connection.connect();
```

To handle errors in this method, as well as the [`ping`](#ping) and [`close`](#close) methods, simple add a `catch` block and handle the error like you would in any other Promise-based method.

```javascript
connection.connect()
.catch(err => {
    // handle error
});
```

#### *query(sql, values)*

The `query()` method is used to execute a query against the database.

```javascript
connection.query("SELECT * FROM Users;")
.then(users => {
    // do something with users
})
.catch(err => {
    // handle error
});

// or

const users = await connection.query("SELECT * FROM Users;");
```

The `values` parameter is optional. If used, it should be an array of values to be bound to the query, while the query string itself (sql) should have a question mark ('?') in the places where you want the values in the `values` array to be replaced.

```javascript

connection.query("SELECT * FROM Users WHERE id = ?;", [1])
.then(users => {
    // do something with users
})
.catch(err => {
    // handle error
});

// or

const users = await connection.query("SELECT * FROM Users WHERE id = ?;", [1]);
```

#### *ping()*

The `ping()` method is used to ping the database. The method will return a Promise that resolves if the database is reachable, or rejects if the database is not reachable.

```javascript
connection.ping()
.then(() => {
    // database is reachable
})
.catch(err => {
    // database is not reachable
});
```

If the promise resolves, there will be no return value. If the promise rejects, the rejection will be an Error object.

#### *close()*

The `close()` method is used to close the connection to the database. The method will return a Promise that resolves if the connection is closed, or rejects if the connection is not closed.

```javascript
connection.close()
.then(() => {
    // connection is closed
})
.catch(err => {
    // connection is not closed
});
```

Same as with the `ping()` method, if the promise resolves, there will be no return value. If the promise rejects, the rejection will be an Error object.

## **License**

MySQLify is licensed under the MIT license (see the [LICENSE](LICENSE) for more information).