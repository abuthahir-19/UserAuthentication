const express = require('express');
const router = express.Router();
const checkUser = require ('../controllers/authController');

router.get ('/', (req, res) => {
    res.send ("Sending some authentication front end !!");
});

router.post ('/', checkUser);

module.exports = router;