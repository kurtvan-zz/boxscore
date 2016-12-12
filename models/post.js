var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Define a schema for users
var postSchema = new Schema(
    {
        title: {
            type: String, required: true
        },
        text: {
            type: String, required: false
        },
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}],
        score : {
            type: Number, required: true, default: 0
        },
        sport: {
            type: String, required: true
        },
        tags: [{type: String}],
        poster: {
            type: String,
            ref: "User",
        },
        date_posted : { type : Date, default: Date.now }
    },
    {
        collection: 'posts'
    }
);


mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/group9db');
// mongoose.createConnection('mongodb://localhost/group9db');
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});
module.exports = mongoose.model('Post', postSchema);
