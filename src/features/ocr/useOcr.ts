import { useState } from 'react';
import Tesseract from 'tesseract.js';

export function useOcr() {
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const extractText = async (imageSrc: string | File): Promise<string | null> => {
        setIsProcessing(true);
        setProgress(0);
        setError(null);

        let objectUrl = "";
        if (imageSrc instanceof File) {
            objectUrl = URL.createObjectURL(imageSrc);
            imageSrc = objectUrl;
        }

        try {
            // Trying swe first. Tesseract downloaded languages are cached in IndexedDB.
            // If SWE is not available it fetches it from github.
            const result = await Tesseract.recognize(
                imageSrc,
                'swe+eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            );
            return result.data.text;
        } catch (err: any) {
            console.error(err);
            setError("Misslyckades med att extrahera text. Kontrollera nätverket eller skriv in manuellt.");
            return null;
        } finally {
            setIsProcessing(false);
            setProgress(0);
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        }
    };

    return { extractText, progress, isProcessing, error };
}
