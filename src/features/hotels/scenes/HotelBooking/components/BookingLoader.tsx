import React from "react";
import { Loader2 } from "lucide-react";

interface BookingLoaderProps {
    open: boolean;
}

export const BookingLoader: React.FC<BookingLoaderProps> = ({ open }) => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        if (!open) return;
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center space-y-6 animate-in zoom-in-95 duration-300">

                <div className="flex justify-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Securing your stay...
                </h2>

                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                    Please wait while we confirm your reservation with the hotel.
                </p>

                {/* Progress Bar */}
                <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden mx-auto">
                    {/* Progress → blue */}
                    <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
