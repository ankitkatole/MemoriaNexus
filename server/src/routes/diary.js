const express = require('express');
const { getDiary, updateDiary } = require('../controllers/diary');

const router = express.Router();

router.get('/:user_id', getDiary);
router.post('/update', updateDiary);

module.exports = router;
