import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useScroll, useTransform, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin } from "lucide-react";

const FRAME_COUNT = 192; // frame_000 to frame_191

// Generate the frame image URLs.
const images = Array.from({ length: FRAME_COUNT }, (_, i) => {
    const index = i.toString().padStart(3, "0");
    return `/hero-sequence/frame_${index}_delay-0.04s.png`;
});

export const ScrollHero = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Scroll tracking setup
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Transform scroll progress to a frame index (0 to 191)
    const currentFrameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Framer-motion transformations for 3D/Parallax effect
    const worldScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]); // Zooming slightly in
    const worldOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0.2]); // Fade out gently at the very end
    const textYParallax = useTransform(scrollYProgress, [0, 1], [0, -150]); // Move text up faster than scroll

    // 1. Preload images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        images.forEach((src, idx) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) {
                    setImagesLoaded(true);
                }
            };
            imgArray[idx] = img;
        });

        setLoadedImages(imgArray);
    }, []);

    // 2. Render current frame onto the canvas
    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current) return;
        const context = canvasRef.current.getContext("2d");
        if (!context) return;

        // A function to render the image that covers the canvas beautifully like `object-fit: cover`
        const renderFrame = (idx: number) => {
            const img = loadedImages[idx];
            if (!img) return;

            const canvas = canvasRef.current!;
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Calculates drawing sizes to achieve object-fit "cover"
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            context.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        // Render initially
        renderFrame(0);

        // Subscribe to changes in the current frame index from Framer Motion
        const unsubscribe = currentFrameIndex.on("change", (latest) => {
            renderFrame(Math.floor(latest));
        });

        // We must handle window resize to redraw covering properly
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                renderFrame(Math.floor(currentFrameIndex.get()));
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial sizing based on window

        return () => {
            unsubscribe();
            window.removeEventListener("resize", handleResize);
        };
    }, [imagesLoaded, currentFrameIndex, loadedImages]);

    // If loading...
    if (!imagesLoaded) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
                <p className="animate-pulse text-lg tracking-widest text-muted-foreground">
                    ENTER THE CITY...
                </p>
            </div>
        );
    }

    // The container will be e.g. 500vh high, so scrolling takes time.
    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-black">

            {/* Sticky Container for the visual layers */}
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">

                {/* Background Layer: The Canvas Sequence */}
                <motion.div
                    className="absolute inset-0 z-0 origin-center"
                    style={{ scale: worldScale, opacity: worldOpacity }}
                >
                    <canvas ref={canvasRef} className="w-full h-full block" />

                    {/* A gradient overlay so text stays readable, adding a cinematic dark transition at the bottom */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
                </motion.div>

                {/* Foreground Layer: UI / Content */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
                    <motion.div
                        className="flex flex-col items-center text-center max-w-4xl"
                        style={{ y: textYParallax }}
                    >
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-md shadow-2xl">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Smart Civic Intelligence Platform
                        </div>

                        {/* Main Heading styled for a darker, immersive backdrop */}
                        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-xl">
                            Building a Cleaner, <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Smarter</span>{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Madurai</span>
                        </h1>

                        {/* Subtext */}
                        <p className="mb-10 max-w-3xl text-lg sm:text-xl text-white/80 font-light drop-shadow-md leading-relaxed">
                            Locate public utilities, report cleanliness issues, and support your city using real-time civic intelligence powered by Google technologies. NAMMA MADURAI is a smart city initiative designed to empower citizens by bringing together AI-driven waste classification, interactive smart mapping, and IoT-enabled infrastructure. Join us in transforming our heritage city into a cleaner, more sustainable, and forward-looking community.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link to="/select-role?mode=signin">
                                <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                                    Enter Platform
                                </Button>
                            </Link>
                            <Link to="/select-role?mode=signup">
                                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold bg-black/20 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur shadow-lg hover:scale-105 transition-transform">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
