const express = require('express');
const router = express.Router();
const EnviaCtrl = require("../controllers/EnviaController");

router.get('/', EnviaCtrl.tracking);
router.get('/showTracking', EnviaCtrl.showTracking);
router.get('/create', EnviaCtrl.create);
router.post('/create', EnviaCtrl.create);
router.get('/update', EnviaCtrl.update);
router.get('/remove', EnviaCtrl.remove);

module.exports = router;