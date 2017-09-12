const Controller = require('../../lib/controller');
const battleFacade = require('./facade');

class BattleController extends Controller {
    create(val) {
        return this.facade.create(val);

    }

    findById(id) {
        return this.facade.findById(id);
    }
}

module.exports = new BattleController(battleFacade);
