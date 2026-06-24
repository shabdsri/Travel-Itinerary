const express = require('express');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const tripRouter = require('./routers/tripRouter'); // Trip router import kiya
require('./connection');
const cors = require('cors');

const app = express(); // 1. Pehle 'app' initialize hoga (Line 8 ke baad)
const port = 5000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// Routes definition - ab saare app.use() safe hain
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/trip', tripRouter); // 2. Ab 'app' banne ke baad use ho raha hai

app.get('/', (req, res) => {
    res.send('response from express');
});

// Add route
app.get('/add', (req, res) => {
    res.send('response from add');
});

// Update route
app.get('/update', (req, res) => {
    res.send('response from update');
});

// Delete route
app.get('/delete', (req, res) => {
    res.send('response from delete');
});

app.listen(port, () => {
    console.log('server started on port ' + port);
});