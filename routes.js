const Router = require('express').Router;
const router = new Router();
const config = require('./config');

const user = require('./model/user/router');
const battle = require('./model/battle/router');


/*router.route('/').get((req, res) => {
    res.json({message: 'Welcome to sea-wars-server API!'});
});*/


router.use('/api/user', user);
router.use('/api/battle', battle);

router.get('*', function(req, res, next) {
    /*let extension = req.query.match(/.+\.(js|css|jpg|png)$/);
     if (extension) {
     next();
     }else {
     res.sendFile(__dirname + '/index.html');
     }*/
    console.log('request ', req);

    res.sendFile(__dirname + config.static.client + 'index.html');
});



module.exports = router;
