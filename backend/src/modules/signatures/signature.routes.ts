import { Router } from 'express';
import { SignatureController } from './signature.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const signatureController = new SignatureController();

router.use(authenticate);

router.post('/', (req, res) => signatureController.placeSignature(req, res));
router.get('/document/:documentId', (req, res) =>
    signatureController.getSignaturesByDocument(req, res)
);
router.post('/finalize', (req, res) => signatureController.finalizeSignature(req, res));
router.delete('/:id', (req, res) => signatureController.deleteSignature(req, res));

export default router;
