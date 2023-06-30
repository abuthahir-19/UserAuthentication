const userDB = {
    users : require ('../model/users.json'),
    setUsers : function (data) {
        this.users = data;
    }
};

const fsPromises = require ('fs').promises;
const path = require ('path');
const bcrypt = require ('bcrypt');
const uuid = require ('uuid');
const mysql = require ('mysql');

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'userauthentication',
});

db.connect (er => {
    if (er) console.log ('Error in connecting to the database !');
    else {
        console.log ('Connection to the database was successfull !!');
    }
});

const createNewUser = async (req, res) => {
    const { fname, lname, email, pwd, phone } = req.body;
    const id = uuid.v4();
    const hashedPwd = await bcrypt.hash (pwd, 10);

    var newUser = {
        "ID" : id,
        "FirstName" : fname,
        "LastName" : lname, 
        "Email" : email, 
        "Password" : hashedPwd,
        "Phone" : phone,
    };

    var sqlQuery = 'select * from registeredusers where Email = ? and Phone = ?';
    db.query (sqlQuery, [email, phone], async (er, result) => {
        if (er) {
            console.log ('Error in fetching the data !');
            res.json ({ message : "Error in fetching the data !" });
        } else {
            if (result.length > 0) {
                res.json ({ message : "User already exists !" });
            } else {
                console.log (result.length);
                const query = 'insert into registeredusers (ID, FirstName, LastName, Email, Password, Phone) values ?';
                var values = [
                    [id, fname, lname, email, hashedPwd, phone]
                ];

                db.query (query, [values], (er, result) => {
                    if (er) {
                        console.log (er.name + " : " + er.message);
                    } else {
                        console.log ("Records inserted to the database succesfully !");
                        // console.log ("No of records inserted : " + result.affectedRows);
                    }
                });

                userDB.setUsers ([...userDB.users, newUser]);

                await fsPromises.writeFile (
                    path.join (__dirname, '..', 'model', 'users.json'),
                    JSON.stringify (userDB.users)
                );

                res.json ({ message : "Data insertion successfull !" });
            }
        }
    });
};

module.exports = createNewUser;