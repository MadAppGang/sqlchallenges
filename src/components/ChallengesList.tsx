import { ArrowRight, Clock, Search, Star, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface Challenge {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "completed" | "in-progress" | "not-started";
  description: string;
  estimatedTime: string;
  topics: string[];
  isFeatured?: boolean;
  completionRate?: number;
}

export interface ChallengesListProps {
  challenges: Challenge[];
  onChallengeSelect: (challengeId: number) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showFeatured?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export default function ChallengesList({
  challenges,
  onChallengeSelect,
  showSearch = true,
  showFilters = true,
  showFeatured = true,
  className = "",
  title = "Challenges",
  subtitle = "Select a challenge to get started",
  searchPlaceholder = "Search challenges...",
}: ChallengesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const matchesSearch =
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        challenge.topics.some((topic) =>
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesDifficulty =
        difficultyFilter === "all" || challenge.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [challenges, searchQuery, difficultyFilter]);

  const featuredChallenges = challenges.filter(
    (challenge) => challenge.isFeatured
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "secondary";
      case "Medium":
        return "default";
      case "Hard":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {(title || subtitle || showSearch || showFilters) && (
        <div className="mb-8">
          {(title || subtitle) && (
            <div className="text-center mb-6">
              {title && <h1 className="text-4xl mb-2">{title}</h1>}
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>
          )}

          {/* Search and Filters */}
          {(showSearch || showFilters) && (
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto px-4">
              {showSearch && (
                <div className="relative flex-[3]">
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pr-4 py-2 border border-gray-300 rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    style={{ 
                      height: "44px", 
                      paddingLeft: "38px",
                      background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 10px center`,
                      backgroundColor: "white"
                    }}
                  />
                </div>
              )}

              {showFilters && (
                <div className="flex-shrink-0">
                  <Select
                    value={difficultyFilter}
                    onValueChange={setDifficultyFilter}
                  >
                    <SelectTrigger className="w-44" style={{ height: "44px" }}>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Featured Challenges */}
      {showFeatured && featuredChallenges.length > 0 && (
        <section className="mb-16 px-2">
          <div className="flex items-center gap-2 mb-6 px-4 py-3 ">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-semibold">Featured Challenges</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {featuredChallenges.map((challenge) => (
              <ChallengeCard
                key={`featured-${challenge.id}`}
                challenge={challenge}
                onSelect={onChallengeSelect}
                getDifficultyColor={getDifficultyColor}
                isFeatured={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Challenges */}
      <section className="px-2 pt-8">
        <div className="flex items-center justify-between mb-6 px-4 py-3 ">
          <h2 className="text-2xl font-semibold">All Challenges</h2>
          <div className="text-sm text-muted-foreground">
            {filteredChallenges.length} of {challenges.length} challenges
          </div>
        </div>

        {filteredChallenges.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No challenges found matching your criteria.</p>
              <p className="text-sm mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onSelect={onChallengeSelect}
                getDifficultyColor={getDifficultyColor}
                isFeatured={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (id: number) => void;
  getDifficultyColor: (difficulty: string) => string;
  isFeatured: boolean;
}

function ChallengeCard({
  challenge,
  onSelect,
  getDifficultyColor,
  isFeatured,
}: ChallengeCardProps) {
  const cardClasses = isFeatured
    ? "hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden border-2 border-yellow-200 dark:border-yellow-800"
    : "hover:shadow-md transition-shadow cursor-pointer";

  return (
    <Card
      className={`${cardClasses} flex flex-col`}
      style={{ minHeight: "380px" }}
      onClick={() => onSelect(challenge.id)}
    >
      {isFeatured && (
        <div className="absolute top-4 right-4">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={getDifficultyColor(challenge.difficulty)}>
            {challenge.difficulty}
          </Badge>
          {!isFeatured && challenge.isFeatured && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>
        <CardTitle className="text-lg leading-tight">
          {challenge.title}
        </CardTitle>
        <CardDescription
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "2.5rem", // Ensures consistent height
          }}
        >
          {challenge.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {challenge.estimatedTime}
          </div>
          {challenge.completionRate && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              {challenge.completionRate}% completion
            </div>
          )}
        </div>
        <div className="mb-4" style={{ minHeight: "60px" }}>
          <div className="flex flex-wrap gap-1">
            {challenge.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
            {challenge.topics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{challenge.topics.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full gap-2 hover:bg-accent">
            {challenge.status === "not-started"
              ? "Start Challenge"
              : challenge.status === "in-progress"
              ? "Continue"
              : "Review"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
