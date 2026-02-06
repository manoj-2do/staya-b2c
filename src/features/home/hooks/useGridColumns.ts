import { useState, useEffect } from "react";

export function useGridColumns() {
    const [columns, setColumns] = useState(1); // Default mobile

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            // Matching tailwind breakpoints: sm: 640, lg: 1024, xl: 1280, 2xl: 1536
            if (width >= 1536) {
                setColumns(5); // 2xl
            } else if (width >= 1280) {
                setColumns(4); // xl
            } else if (width >= 1024) {
                setColumns(3); // lg
            } else if (width >= 640) {
                setColumns(2); // sm
            } else {
                setColumns(1);
            }
        }

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return columns;
}
