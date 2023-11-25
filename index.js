const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile('pages/index.html', {root: __dirname});
})

app.get('/registration', (req, res) => {
    res.send('Registration Page');
})

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
})
