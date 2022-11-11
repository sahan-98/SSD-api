const express = require('express');
const router = express.Router();
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');

const {saveDocument,gelAllDocuments,downloadDocument} = require('../controllers/document_controller');




router.post('/', [], saveDocument);
router.get('/', [], gelAllDocuments);
router.get('/download/:filename', [], downloadDocument);


module.exports = router;