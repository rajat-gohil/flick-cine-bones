import { Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  title: string;
  genre: string;
  rating: number;
  year: number;
  poster: string;
  className?: string;
  showActions?: boolean;
  isLiked?: boolean;
}

const MovieCard = ({
  title,
  genre,
  rating,
  year,
  poster,
  className = "",
  showActions = false,
  isLiked,
}: MovieCardProps) => {
  return (
    <Card className={`overflow-hidden group hover:scale-105 transition-all duration-300 ${className}`}>
      <CardContent className="p-0 relative">
        {/* Poster */}
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/80 mb-2">{genre}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-white font-medium">{rating}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {year}
            </Badge>
          </div>
        </div>

        {/* Like Badge */}
        {showActions && isLiked !== undefined && (
          <div className="absolute top-3 right-3">
            <Badge
              variant={isLiked ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isLiked ? (
                <Heart className="w-3 h-3 fill-current" />
              ) : (
                <span className="text-xs">✕</span>
              )}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieCard;
