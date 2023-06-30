const express = require ('express');
const router = express();
const createNewUser = require ('../controllers/registerController');

router.get ('/', (req, res) => {
    res.send ("Sending a register page to handle new users !!");
});

router.post ('/', createNewUser);

module.exports = router;