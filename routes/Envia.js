const express = require('express');
const router = express.Router();
const EnviaCtrl = require("../controllers/EnviaController");

router.get('/', EnviaCtrl.tracking);
router.get('/shippings', EnviaCtrl.shippings);
router.get('/showTracking', EnviaCtrl.showTracking);
router.get('/search', EnviaCtrl.search);
router.get('/showSearch', EnviaCtrl.showSearch);
router.get('/create', EnviaCtrl.create);
router.post('/create', EnviaCtrl.create);
router.post('/quote', EnviaCtrl.quote);
router.post('/quotes', EnviaCtrl.quotes);
router.get('/couriers', EnviaCtrl.couriers);
router.get('/update', EnviaCtrl.update);
router.get('/remove', EnviaCtrl.remove);

module.exports = router;