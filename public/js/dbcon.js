var mysql = require('mysql');
var pool = mysql.createPool( {
    connectionLimit : 10,
    host            : 'mysql.eecs.oregonstate.edu',
    user            : 'cs290_ericksjo',
    password        : '1520',
    database        : 'cs290_ericksjo'
});

module.exports.pool = pool;