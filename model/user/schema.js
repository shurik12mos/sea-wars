const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

// User
const userSchema = new Schema({
    username: {
        type: String,
        unique: [true, 'This username already exist'],
        required: true
    },
    hashedPassword: {
        type: String,
        required: true,
        select: false
    },
    salt: {
        type: String,
        required: true,
        select: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String
    },
    battles: {
        type: Number,
        default: 0
    },
    win: {
        type: Number,
        default: 0
    },
    loose: {
        type: Number,
        default: 0
    }
});

userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('userId')
    .get(function () {
        return this._id;
    });

userSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


userSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

userSchema.methods.safeResult = function() {
    var result = this;
    delete result['hashedPassword'];
    delete result['salt'];

    return result
};

userSchema.pre('save', function(next) {
    this.token = crypto.randomBytes(32).toString('base64');
    next();
});

module.exports = mongoose.model('User', userSchema);
