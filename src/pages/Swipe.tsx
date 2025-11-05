import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, X, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/ProgressBar";
import moviesData from "@/data/movies.json";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Swipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [watchedCount, setWatchedCount] = useState(0);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [matchedMovie, setMatchedMovie] = useState<string>("");
  const totalMovies = moviesData.length;

  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => {
        setSwipeDirection(null);
        setCurrentIndex((prev) => (prev + 1) % totalMovies);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [swipeDirection, totalMovies]);

  const handleLike = () => {
    const movie = moviesData[currentIndex];
    setSwipeDirection("right");
    toast.success(`Liked "${movie.title}"!`);
    setWatchedCount((prev) => prev + 1);
    
    // Simulate match (for demo - will be replaced with real matching logic)
    if (Math.random() > 0.7) {
      setTimeout(() => {
        setMatchedMovie(movie.title);
        setShowMatchDialog(true);
      }, 600);
    }
  };

  const handleDislike = () => {
    const movie = moviesData[currentIndex];
    setSwipeDirection("left");
    toast.error(`Passed on "${movie.title}"`);
    setWatchedCount((prev) => prev + 1);
  };

  const currentMovie = moviesData[currentIndex];
  const nextMovie = moviesData[(currentIndex + 1) % totalMovies];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Swipe to Match</h1>
          <p className="text-muted-foreground">
            Find movies you both will love
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative h-[600px] flex items-center justify-center">
          {/* Next card (background) */}
          <div className="absolute w-full max-w-[350px]">
            <Card className="shadow-xl opacity-50 scale-95 transform">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[2/3] overflow-hidden rounded-t-3xl bg-secondary">
                    <img
                      src={nextMovie.poster}
                      alt={nextMovie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current card (foreground) */}
          <div
            className={`absolute w-full max-w-[350px] transition-all duration-300 ${
              swipeDirection === "left"
                ? "animate-swipe-left"
                : swipeDirection === "right"
                ? "animate-swipe-right"
                : "animate-card-enter"
            }`}
          >
            <Card className="shadow-2xl hover:shadow-primary/30 transition-shadow duration-300 animate-pulse-glow">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Movie Poster */}
                  <div className="aspect-[2/3] overflow-hidden rounded-t-3xl">
                    <img
                      src={currentMovie.poster}
                      alt={currentMovie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-t-3xl" />

                  {/* Movie Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                    <Badge className="mb-2 bg-primary/90 text-primary-foreground border-0">
                      {currentMovie.genre}
                    </Badge>
                    <h2 className="text-2xl font-bold">{currentMovie.title}</h2>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-medium">{currentMovie.rating}</span>
                      </div>
                      <span className="text-white/80">{currentMovie.year}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-6 p-6 bg-card">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-16 h-16 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all hover:scale-110"
                    onClick={handleDislike}
                    disabled={swipeDirection !== null}
                  >
                    <X className="w-6 h-6" />
                  </Button>

                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 transition-all hover:scale-110"
                    onClick={handleLike}
                    disabled={swipeDirection !== null}
                  >
                    <Heart className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar current={watchedCount} total={totalMovies} />

        {/* Match Dialog */}
        <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
          <DialogContent className="sm:max-w-md border-2 border-primary">
            <DialogHeader>
              <DialogTitle className="text-3xl text-center gradient-text">
                It's a Match! 🎉
              </DialogTitle>
              <DialogDescription className="text-center text-lg pt-4">
                You both liked <span className="font-bold text-foreground">{matchedMovie}</span>!
                <br />
                <span className="text-sm text-muted-foreground mt-2 block">
                  Time to grab some popcorn 🍿
                </span>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Swipe;
