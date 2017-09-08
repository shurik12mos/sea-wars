const Facade = require('../../lib/facade');
const userSchema = require('./schema');
const crypto = require('crypto');

class UserFacade extends Facade {
    login(body) {
        return this.Schema
            .find({username: body.username})
            .exec((err, user) => {
                if (err) {
                    throw new Error(err);
                }

                if ( user.checkPassword(body.password) ) {
                   return user;
                }else {
                    throw new Error('Incorrect password');
                }
            });
    }

    findByToken(body) {
        return this.Schema
            .find({token: token})
            .exec((err, user) => {
                if (err) {
                    throw new Error(err);
                }

                return user;
            });
    }
}

module.exports = new UserFacade(userSchema);
