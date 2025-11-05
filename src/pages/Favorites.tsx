import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/MovieCard";
import { Heart, Trash2, ExternalLink } from "lucide-react";
import moviesData from "@/data/movies.json";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Favorites = () => {
  const [streamingLinks, setStreamingLinks] = useState<any[]>([]);

  useEffect(() => {
    loadStreamingLinks();
  }, []);

  const loadStreamingLinks = async () => {
    const { data } = await supabase
      .from("streaming_links")
      .select("*");
    
    if (data) {
      setStreamingLinks(data);
    }
  };

  const getStreamingLinksForMovie = (movieId: string) => {
    return streamingLinks.filter(link => link.movie_id === movieId.toString());
  };

  // Simulate favorites (every other movie)
  const favoriteMovies = moviesData.filter((_, index) => index % 2 === 0);

  const handleRemove = (title: string) => {
    toast.success(`Removed "${title}" from favorites`);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
              <Heart className="w-10 h-10 text-primary fill-primary" />
              Your Favorites
            </h1>
            <p className="text-muted-foreground">
              {favoriteMovies.length} movies you loved
            </p>
          </div>

          {favoriteMovies.length > 0 && (
            <Button variant="outline" className="rounded-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Movies Grid */}
        {favoriteMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favoriteMovies.map((movie) => {
              const links = getStreamingLinksForMovie(movie.id.toString());
              return (
                <div key={movie.id} className="space-y-3">
                  <div className="relative group">
                    <MovieCard
                      title={movie.title}
                      genre={movie.genre}
                      rating={movie.rating}
                      year={movie.year}
                      poster={movie.poster}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-8 h-8 p-0"
                      onClick={() => handleRemove(movie.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {links.map((link) => (
                        <Button
                          key={link.id}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          asChild
                        >
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.platform}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <Heart className="w-20 h-20 text-muted-foreground mx-auto opacity-20" />
            <div>
              <p className="text-muted-foreground text-lg">
                No favorites yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Start swiping to add movies to your favorites
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
