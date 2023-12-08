const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/bharat_intern');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

const user = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.sendFile("pages/signup.html", { root: __dirname });
})

app.get('/login', (req, res) => {
    res.sendFile("pages/login.html", { root: __dirname });
})

app.post('/registration', async (req, res) => {
    try {
        const existingUser = await user.find({ email: req.body.email });

        if (existingUser > 0) {
            // return res.status(400).send('User already registered');
            return res.status(400).sendFile("pages/login.html", {root: __dirname});
        }
        else {
            const registerdata = new user(req.body);
            await registerdata.save();
            // return res.status(400).send('User successfully registered');
            res.status(200).sendFile("pages/register.html", { root: __dirname });
        }    

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/registration', async (req, res) => {
    res.sendFile('pages/signup.html', {root: __dirname});
})
app.get('/validation', async (req, res) => {
    res.sendFile('pages/login.html', {root: __dirname});
})

app.post('/validation', async (req, res) => {
    try {
        const existingUser = await user.findOne({ email: req.body.email });
        console.log(existingUser);
        if (existingUser) {
            if(existingUser.email == req.body.email && 
                existingUser.password === req.body.password) {
                return res.status(200).sendFile("pages/register.html", {root: __dirname});
            }
            else{
                return res.status(401).send('Incorrect Password');
            }
        }
        else {
            return res.status(200).sendFile("pages/signup.html", {root: __dirname});
        }    

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
})
