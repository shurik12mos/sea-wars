const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/signup')
  .post((...args) => controller.create(...args));

router.route('/login')
    .post((...args) => controller.login(...args));

router.route('/')
    .get((...args) => controller.findByToken(...args));

router.route('/:id')
  .get((...args) => controller.findById(...args))
  .put((...args) => controller.update(...args))
  .delete((...args) => controller.remove(...args));

module.exports = router;
