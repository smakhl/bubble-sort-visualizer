const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const path = require('path')

app.use(express.static(path.resolve(__dirname, './')));

app.listen(port, function () {
    console.log(`listening on ${port}`)
})

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, './index.html'))
})