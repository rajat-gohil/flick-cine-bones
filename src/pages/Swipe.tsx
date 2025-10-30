import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, RotateCcw, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/ProgressBar";
import moviesData from "@/data/movies.json";
import { toast } from "sonner";

const Swipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchedCount, setWatchedCount] = useState(0);
  const totalMovies = moviesData.length;
  const currentMovie = moviesData[currentIndex];

  const handleLike = () => {
    toast.success(`Added "${currentMovie.title}" to favorites!`);
    nextMovie();
  };

  const handleDislike = () => {
    toast.error(`Skipped "${currentMovie.title}"`);
    nextMovie();
  };

  const nextMovie = () => {
    setWatchedCount((prev) => prev + 1);
    setCurrentIndex((prev) => (prev + 1) % totalMovies);
  };

  const handleReshuffle = () => {
    setCurrentIndex(Math.floor(Math.random() * totalMovies));
    toast.info("Reshuffled deck!");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Swipe to Discover</h1>
          <p className="text-muted-foreground">
            Find your next favorite movie with every swipe
          </p>
        </div>

        {/* Movie Card Stack */}
        <div className="relative h-[600px] flex items-center justify-center">
          {/* Background Cards for Depth */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="w-[90%] h-[95%] absolute opacity-30 scale-95 rotate-2" />
            <Card className="w-[95%] h-[97%] absolute opacity-50 scale-97 -rotate-1" />
          </div>

          {/* Main Movie Card */}
          <Card className="relative w-full shadow-2xl hover:shadow-primary/20 transition-all duration-300">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-t-3xl" />

                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge className="mb-2">{currentMovie.genre}</Badge>
                  <h2 className="text-3xl font-bold mb-2">{currentMovie.title}</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{currentMovie.rating}</span>
                    </div>
                    <span className="text-white/80">{currentMovie.year}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/90 line-clamp-3">
                    {currentMovie.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 p-6 bg-card">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-16 h-16 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleDislike}
                >
                  <ThumbsDown className="w-6 h-6" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-12 h-12"
                  onClick={handleReshuffle}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>

                <Button
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={handleLike}
                >
                  <ThumbsUp className="w-6 h-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <ProgressBar current={watchedCount} total={totalMovies} />
      </div>
    </div>
  );
};

export default Swipe;
