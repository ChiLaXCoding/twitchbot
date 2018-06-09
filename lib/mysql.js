const mysql = require('promise-mysql'),
file = require('fs');

class DB {
    constructor(options) {
        var __self = this;

        // config
        __self.host = options.host || '';
        __self.user = options.user || '';
        __self.password = options.password || '';
        __self.database = options.database || '';
    }
    
    start() {
        var __self = this, streamers ='', viewers = '';

        // table structure for table streamers
        streamers += 'CREATE TABLE IF NOT EXISTS `streamers` (';
        streamers += '`name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,';
        streamers += 'PRIMARY KEY (`name`)';
        streamers += ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1';

        // table structure for table viewers
        viewers += 'CREATE TABLE IF NOT EXISTS `viewers` (';
        viewers += '`name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,';
        viewers += '`points` int(11) NOT NULL,';
        viewers += 'PRIMARY KEY (`name`)';
        viewers += ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;';

        // execute sql, create tables if they don't exist
        __self.execute(streamers + '; ' + viewers).then(() => {
            return Promise.resolve();
        })
    }

    execute(sql) {
        var __self = this;
        var connection;
        
        return mysql.createConnection({
            host               : __self.host,
            user               : __self.user,
            password           : __self.password,
            database           : __self.database,
            multipleStatements : true
        }).then((conn) => {
            connection = conn;

            // execute query
            var results = connection.query(sql);
            connection.end();
            return Promise.resolve(results);
        }).catch(function(error){
            if (connection && connection.end) connection.end();

            file.appendFile('./../logs/error-log.txt', error.message + '\r\n' + error.stack + '\r\n', function() {});
            //logs out the error
            console.log(error);
        });
    };
}

module.exports = DB;