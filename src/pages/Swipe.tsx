import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, RotateCcw, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProgressBar from "@/components/ProgressBar";
import moviesData from "@/data/movies.json";
import { toast } from "sonner";

const Swipe = () => {
  const [watchedCount, setWatchedCount] = useState(0);
  const totalMovies = moviesData.length;

  const handleLike = (title: string) => {
    toast.success(`Added "${title}" to favorites!`);
    setWatchedCount((prev) => prev + 1);
  };

  const handleDislike = (title: string) => {
    toast.error(`Skipped "${title}"`);
    setWatchedCount((prev) => prev + 1);
  };

  const handleReshuffle = () => {
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

        {/* Horizontal Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {moviesData.map((movie) => (
                <CarouselItem key={movie.id} className="pl-4 basis-auto">
                  {/* Playing Card Size: ~2.5 x 3.5 inches ratio */}
                  <div className="w-[280px]">
                    <Card className="shadow-2xl hover:shadow-primary/20 transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative">
                          {/* Movie Poster */}
                          <div className="aspect-[5/7] overflow-hidden rounded-t-3xl">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-t-3xl" />

                          {/* Movie Info */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <Badge className="mb-2 text-xs">{movie.genre}</Badge>
                            <h2 className="text-xl font-bold mb-1 line-clamp-1">{movie.title}</h2>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="font-medium">{movie.rating}</span>
                              </div>
                              <span className="text-white/80">{movie.year}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-3 p-4 bg-card">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full w-12 h-12 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDislike(movie.title)}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            className="rounded-full w-12 h-12"
                            onClick={() => handleLike(movie.title)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          {/* Reshuffle Button */}
          <div className="flex justify-center mt-6">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={handleReshuffle}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reshuffle Deck
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar current={watchedCount} total={totalMovies} />
      </div>
    </div>
  );
};

export default Swipe;
