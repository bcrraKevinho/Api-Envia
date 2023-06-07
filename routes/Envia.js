const express = require('express');
const router = express.Router();
const EnviaCtrl = require("../controllers/EnviaController");

router.get('/tracking', EnviaCtrl.tracking);
router.get('/create', EnviaCtrl.create);
router.get('/update', EnviaCtrl.update);
router.get('/remove', EnviaCtrl.remove);

module.exports = router;