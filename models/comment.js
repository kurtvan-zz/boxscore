var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Define a schema for users
var commentSchema = new Schema(
    {
        text: {
            type: String, required: true
        },
        poster: {
            type: String, ref: 'User', required: false
        },
        date_posted : { type : Date, default: Date.now },
        score: {
            type: Number, required: true, default: 0
        },
    },
    {
        collection: 'comments'
    }
);

mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/group9db');
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});
module.exports = mongoose.model('Comment', commentSchema);
