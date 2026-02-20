import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface DraggableSignatureProps {
    id: string;
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    isActive: boolean;
    signatureDataUrl?: string;
    onRemove: () => void;
    onClick: () => void;
}

export const DraggableSignature = ({
    id,
    index,
    x,
    y,
    width,
    height,
    isActive,
    signatureDataUrl,
    onRemove,
    onClick,
}: DraggableSignatureProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    const style = {
        position: 'absolute' as const,
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : isActive ? 100 : 10,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onClick}
            className={`
        group cursor-move select-none
        ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
        >
            <div
                className={`
          w-full h-full rounded-lg border-2 border-dashed
          flex items-center justify-center
          transition-all duration-200
          ${isDragging ? 'bg-primary-100 border-primary-500 shadow-lg scale-105' : 'bg-white border-primary-400'}
          ${isActive ? 'border-primary-600' : ''}
          hover:bg-primary-50 hover:border-primary-500
        `}
            >
                {/* Drag Handle */}
                <div
                    {...listeners}
                    {...attributes}
                    className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="w-6 h-6 text-primary-400" />
                </div>

                {/* Signature Image or Placeholder */}
                {signatureDataUrl ? (
                    <div className="absolute inset-0 p-2 flex items-center justify-center opacity-90 pointer-events-none">
                        <img src={signatureDataUrl} alt="Signature" className="max-w-full max-h-full object-contain" />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-sm font-medium text-gray-400">Click to Sign</span>
                    </div>
                )}

                {/* Signature Label */}
                <div className="absolute bottom-1 left-1 right-1 text-center pointer-events-none">
                    <span className="text-[10px] font-medium text-primary-600 bg-white/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
                        Signature #{index + 1}
                    </span>
                </div>

                {/* Remove Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="
            absolute -top-2 -right-2 w-6 h-6
            bg-red-500 text-white rounded-full
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            hover:bg-red-600 hover:scale-110
            shadow-md
          "
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Resize Indicator (visual only for now) */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-500 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </motion.div>
    );
};
