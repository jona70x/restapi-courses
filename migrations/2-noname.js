'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "emailAddress" on table "Users"
 *
 **/

var info = {
    "revision": 2,
    "name": "noname",
    "created": "2023-07-29T22:21:07.219Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "changeColumn",
    params: [
        "Users",
        "emailAddress",
        {
            "type": Sequelize.STRING,
            "field": "emailAddress",
            "validate": {
                "is": {},
                "notNull": {
                    "msg": "Please provide a valid email"
                },
                "notEmpty": {
                    "msg": "\"Email\" can not be empty, please provide a valid email"
                }
            },
            "unique": {
                "msg": "The email you entered already exist"
            },
            "allowNull": false
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
