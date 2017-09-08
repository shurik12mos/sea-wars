const Controller = require('../../lib/controller');
const userFacade = require('./facade');

class UserController extends Controller {
    login(req, res, next) {
        this.facade.login(req.body)
            .then(doc => res.status(200).json(doc))
            .catch(err => next(err));
    }

    findByToken(req, res, next) {
        if (!req.token) {
            next(new Error('no token provided'));
        }

        this.facade.findByToken(req.token)
            .then(doc => res.status(200).json(doc))
            .catch(err => next(err));
    }
}

module.exports = new UserController(userFacade);
