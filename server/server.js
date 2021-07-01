const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Server Work'));
app.use('/api/bitgoapi', require('./routes/bitgoapi'));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));