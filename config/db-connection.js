const mongoose = require('mongoose');

// Database connection using mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).catch(error => console.log(error));

mongoose.Promise = global.Promise;

module.exports = {mongoose}