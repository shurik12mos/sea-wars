const Facade = require('../../lib/facade');
const battleSchema = require('./schema');

class BattleFacade extends Facade {
    create(val) {
        const schema = new this.Schema(val);
        return schema.save((err, battle) => {
            if (err) {
                next(err);
            }

            console.log('battle created');
            return battle;
        });
    }
}

module.exports = new BattleFacade(battleSchema);
