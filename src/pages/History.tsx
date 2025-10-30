import MovieCard from "@/components/MovieCard";
import { Badge } from "@/components/ui/badge";
import moviesData from "@/data/movies.json";

const History = () => {
  // Simulate some history with liked/disliked status
  const historyMovies = moviesData.slice(0, 8).map((movie, index) => ({
    ...movie,
    isLiked: index % 2 === 0, // Alternate between liked and disliked
  }));

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Your History</h1>
          <p className="text-muted-foreground">
            Review all the movies you've swiped on
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-effect p-6 rounded-3xl text-center">
            <p className="text-3xl font-bold text-primary">
              {historyMovies.filter((m) => m.isLiked).length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Liked</p>
          </div>
          <div className="glass-effect p-6 rounded-3xl text-center">
            <p className="text-3xl font-bold text-destructive">
              {historyMovies.filter((m) => !m.isLiked).length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Disliked</p>
          </div>
          <div className="glass-effect p-6 rounded-3xl text-center">
            <p className="text-3xl font-bold text-foreground">
              {historyMovies.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total</p>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {historyMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              genre={movie.genre}
              rating={movie.rating}
              year={movie.year}
              poster={movie.poster}
              showActions
              isLiked={movie.isLiked}
            />
          ))}
        </div>

        {historyMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No history yet. Start swiping to build your history!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
