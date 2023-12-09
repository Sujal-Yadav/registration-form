const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
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
        const email = req.body.email;
        const existingUser = await user.findOne({ email });
        console.log(existingUser)
        if (existingUser) {
            return res.status(400).sendFile("pages/login.html", { root: __dirname });
        }
        else {
            const registerdata = new user(req.body);
            await registerdata.save();
            return res.redirect(`/home/${registerdata._id}`);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/home/:id', async (req, res) => {
    const id = req.params.id;
    const userid = await user.findOne({ _id: id });
    console.log(userid);
    let htmlFile = fs.readFileSync(__dirname + '/pages/register.html', 'utf8', err => {
        if (err) {
            console.log(err.message);

            throw err;
        }
        console.log('data written to file');
    });

    let posts = userid.username;
    console.log(posts);
    let modifiedhtml = htmlFile.replace('{ user }', posts);
    res.send(modifiedhtml);
})

app.get('/validation', async (req, res) => {
    return res.sendFile('pages/login.html', { root: __dirname });
})

app.get('/registration', async (req, res) => {
    return res.sendFile('pages/signup.html', { root: __dirname });
})

app.post('/validation', async (req, res) => {
    try {
        const email = req.body.email;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            if (existingUser.email == req.body.email &&
                existingUser.password === req.body.password) {
                return res.redirect(`/home/${existingUser._id}`);
            }
            else {
                return res.status(401).send('Incorrect Password');
            }
        }
        else {
            return res.status(200).sendFile("pages/signup.html", { root: __dirname });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
})
