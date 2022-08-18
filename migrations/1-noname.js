'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Users", deps: []
 * createTable "Courses", deps: [Users]
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2022-08-18T17:19:44.526Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "firstName": {
                    "type": Sequelize.STRING,
                    "field": "firstName",
                    "validate": {
                        "notNull": {
                            "msg": "Please provide a valid name"
                        },
                        "notEmpty": {
                            "msg": "\"First name can not be empty\" Please provide a name"
                        }
                    },
                    "allowNull": false
                },
                "lastName": {
                    "type": Sequelize.STRING,
                    "field": "lastName",
                    "validate": {
                        "notNull": {
                            "msg": "Please provide a valid last name"
                        },
                        "notEmpty": {
                            "msg": "\"Last name can not be empty\" Please provide a name"
                        }
                    },
                    "allowNull": false
                },
                "emailAddress": {
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
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "validate": {
                        "notNull": {
                            "msg": "Please provide a valid password"
                        },
                        "notEmpty": {
                            "msg": "Please provide a valid password"
                        }
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Courses",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "title": {
                    "type": Sequelize.STRING,
                    "field": "title",
                    "validate": {
                        "notEmpty": {
                            "msg": "\"Title\" can not be empty. Please provide a valid course title"
                        },
                        "notNull": {
                            "msg": "Please provide a valid title"
                        }
                    },
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description",
                    "validate": {
                        "notEmpty": {
                            "msg": "\"Description can not be empty\". Please provide a course description"
                        },
                        "notNull": {
                            "msg": "Please provide a valid description"
                        }
                    },
                    "allowNull": false
                },
                "estimatedTime": {
                    "type": Sequelize.STRING,
                    "field": "estimatedTime"
                },
                "materialsNeeded": {
                    "type": Sequelize.STRING,
                    "field": "materialsNeeded"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "userId": {
                    "type": Sequelize.INTEGER,
                    "field": "userId",
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": false
                }
            },
            {}
        ]
    }
];

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
