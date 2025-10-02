import mysql from 'mysql2';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agrosoft', 
    port: 3306 
};

const connection = mysql.createConnection(dbConfig);

const db = connection.promise();

export default db; 