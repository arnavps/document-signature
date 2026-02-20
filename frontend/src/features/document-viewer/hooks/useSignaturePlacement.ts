import { useState } from 'react';
import { SignaturePosition } from '@/types';
import { SIGNATURE_DEFAULTS } from '@/lib/constants';

export const useSignaturePlacement = () => {
    const [signatures, setSignatures] = useState<SignaturePosition[]>([]);
    const [activeSignatureId, setActiveSignatureId] = useState<number | null>(null);

    const addSignature = (page: number) => {
        const newSignature: SignaturePosition = {
            x: 50,
            y: 50,
            width: SIGNATURE_DEFAULTS.WIDTH,
            height: SIGNATURE_DEFAULTS.HEIGHT,
            page,
        };
        setSignatures((prev) => [...prev, newSignature]);
        setActiveSignatureId(signatures.length);
    };

    const updateSignature = (index: number, position: Partial<SignaturePosition>) => {
        setSignatures((prev) =>
            prev.map((sig, i) => (i === index ? { ...sig, ...position } : sig))
        );
    };

    const removeSignature = (index: number) => {
        setSignatures((prev) => prev.filter((_, i) => i !== index));
        if (activeSignatureId === index) {
            setActiveSignatureId(null);
        }
    };

    const clearSignatures = () => {
        setSignatures([]);
        setActiveSignatureId(null);
    };

    const getSignaturesForPage = (page: number) => {
        return signatures
            .map((sig, index) => ({ ...sig, index }))
            .filter((sig) => sig.page === page);
    };

    return {
        signatures,
        activeSignatureId,
        addSignature,
        updateSignature,
        removeSignature,
        clearSignatures,
        getSignaturesForPage,
        setActiveSignatureId,
    };
};
