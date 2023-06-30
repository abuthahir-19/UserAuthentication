const bcrypt = require ('bcrypt');
const mysql = require ('mysql');

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'userauthentication',
});

db.connect (er => {
    if (er) console.log ('Error in connecting to the database !');
    else console.log ('Connection to the database successfull !');
});

const checkUser = (req, res) => {
    const { username, pwd } = req.body;
    var sqlQuery = 'select * from registeredusers where Email = ?';
    db.query (sqlQuery, [username], async (er, result) => {
        if (er) {
            console.log (er.name + ":" + er.message);
            res.json ( { "Error" : "Error occured while fetching the data !" });
        } else {
            if (result.length > 0) {
                const match = await bcrypt.compare (pwd, result[0].Password);
                if (match) {
                    res.json ({ message : "Login successfull !"});
                } else {
                    res.json ({ message : "Invalid password please check with your password ! "});
                }
            } else {
                // console.log ("User does not exists! Please register with your email.");
                res.json ({ message : "User does not exists! Please register with your email." });
            }
        }
    });
}

module.exports = checkUser;