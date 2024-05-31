const mysql = require('mysql');

class Database {
    constructor(config) {
        this.connectionConfig = config;
        this.connect();
    }

    connect() {
        this.connection = mysql.createConnection(this.connectionConfig);

        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                setTimeout(() => this.connect(), 5000); // Retry connection after 5 seconds
            } else {
                console.log('Connected to MySQL');
            }
        });

        this.connection.on('error', (err) => {
            console.error('MySQL error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('MySQL connection lost. Reconnecting...');
                this.connect();
            } else {
                throw err;
            }
        });
    }

    query(sql, values) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, values, (err, results) => {
                if (err) {
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        console.error('Lost connection to MySQL. Reconnecting...');
                        this.connect();
                    }
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    get state() {
        return this.connection.state;
    }
}

module.exports = Database;