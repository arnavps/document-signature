import { Router } from 'express';
import { DocumentController } from './document.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();
const documentController = new DocumentController();

router.use(authenticate);

router.post('/upload', upload.single('file'), (req, res) =>
    documentController.uploadDocument(req, res)
);
router.get('/', (req, res) => documentController.getDocuments(req, res));
router.get('/:id', (req, res) => documentController.getDocumentById(req, res));
router.delete('/:id', (req, res) => documentController.deleteDocument(req, res));
router.patch('/:id/status', (req, res) => documentController.updateStatus(req, res));

export default router;
