var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Define a schema for users
var userSchema = new Schema(
    {
        username: {
            type: String, required: true
        },
        password: {
            type: String, required: true
        },
        admin : {
            type: Boolean, default : false, required: true
        },
        salt: {
            type: String
        },
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}],
        posts   : [{type: Schema.Types.ObjectId, ref: 'Post', required: true}],
        score : {
            type: Number, default: 0, required: true
        },
        upvoted : [{type: String, required: true}],
        downvoted : [{type: String, required: true}]
    },
    {
        collection: 'users'
    }
);


//remove data members of collection we dont want exposed
//like the password or internals such as id or version number

userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
	delete ret.salt;
	delete ret.__v;
	delete ret._id;
        return ret;
    }
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/group9db');
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});
module.exports = mongoose.model('User', userSchema);
