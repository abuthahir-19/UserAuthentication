const express = require ('express');
const app = express();
const PORT = process.env.PORT | 3500;

app.use (express.json());
app.use (express.urlencoded ({extended: false}));

app.use ('/', require ('./routes/root'));
app.use ('/register', require ('./routes/register'));
app.use ('/auth', require ('./routes/auth'));

app.listen (PORT, () => console.log (`Server is listening to the port ${PORT}`));