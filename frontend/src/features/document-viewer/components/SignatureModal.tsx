import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (signatureDataUrl: string) => void;
}

export const SignatureModal = ({ isOpen, onClose, onSave }: SignatureModalProps) => {
    const sigPad = useRef<SignatureCanvas>(null);

    const handleClear = () => {
        sigPad.current?.clear();
    };

    const handleSave = () => {
        if (sigPad.current?.isEmpty()) {
            alert("Please provide a signature first.");
            return;
        }
        const dataUrl = sigPad.current?.getCanvas().toDataURL('image/png');
        if (dataUrl) {
            onSave(dataUrl);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Draw Your Signature</h3>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 bg-gray-50">
                            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                <SignatureCanvas
                                    ref={sigPad}
                                    canvasProps={{
                                        className: 'w-full h-48 cursor-crosshair'
                                    }}
                                    backgroundColor="white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
                            <Button variant="secondary" onClick={handleClear}>
                                Clear
                            </Button>
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                Save Signature
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
