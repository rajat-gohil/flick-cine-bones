import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "@/components/MovieCard";
import moviesData from "@/data/movies.json";

const Home = () => {
  const featuredMovies = moviesData.slice(0, 6);

  return (
    <div className="container mx-auto px-6 py-16 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Discover Movies You'll Love</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
          Discover Your Next
          <br />
          <span className="gradient-text">Favorite Movie</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Swipe up to like, swipe down to skip. Find your perfect movie match in seconds.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/room">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full group">
              Start Matching
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <p className="text-muted-foreground">
            Popular movies other users are loving
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              genre={movie.genre}
              rating={movie.rating}
              year={movie.year}
              poster={movie.poster}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-16">
        <h2 className="text-4xl font-bold">Ready to Find Your Match?</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Join thousands of movie lovers discovering their next favorite film
        </p>
        <Link to="/swipe">
          <Button variant="outline" size="lg" className="rounded-full">
            Get Started
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
