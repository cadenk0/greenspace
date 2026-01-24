import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useUser } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { Trophy, Medal, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const { data: users, isLoading } = useLeaderboard();
  const { data: currentUser } = useUser();

  // Sort by score descending (API should handle this, but safe to ensure)
  const sortedUsers = users?.sort((a, b) => b.greenScore - a.greenScore);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
      default:
        return (
          <span className="text-sm font-bold text-muted-foreground w-6 text-center">
            {rank + 1}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="inline-flex items-center justify-center w-16 h-16">
          <img
            src="/GreenspaceLogo.png"
            alt="Greenspace Logo"
            className="w-15 h-15 object-contain"
          />
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-display font-bold">Global Rankings</h1>
      </header>

      <main className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
        {/* Top 3 Podium (Visual) */}
        {!isLoading && sortedUsers && sortedUsers.length >= 3 && (
          <div className="flex justify-center items-end gap-4 py-8 mb-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-gray-300 overflow-hidden bg-muted mb-2 shadow-lg">
                <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-white text-gray-500">
                  {sortedUsers[1].username.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="bg-gray-300 text-white text-xs font-bold px-3 py-1 rounded-full -mt-5 relative z-10">
                2nd
              </div>
              <p className="font-bold text-sm mt-1 max-w-[80px] truncate">
                {sortedUsers[1].username}
              </p>
              <p className="text-xs font-mono font-bold text-primary">
                {sortedUsers[1].greenScore}
              </p>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden bg-muted mb-2 shadow-xl ring-4 ring-yellow-400/20">
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-white text-yellow-600">
                    {sortedUsers[0].username.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500 text-white text-sm font-bold px-4 py-1 rounded-full -mt-6 relative z-10 shadow-md">
                1st
              </div>
              <p className="font-bold text-base mt-2">
                {sortedUsers[0].username}
              </p>
              <p className="text-sm font-mono font-bold text-primary">
                {sortedUsers[0].greenScore}
              </p>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-600 overflow-hidden bg-muted mb-2 shadow-lg">
                <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-white text-amber-700">
                  {sortedUsers[2].username.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full -mt-5 relative z-10">
                3rd
              </div>
              <p className="font-bold text-sm mt-1 max-w-[80px] truncate">
                {sortedUsers[2].username}
              </p>
              <p className="text-xs font-mono font-bold text-primary">
                {sortedUsers[2].greenScore}
              </p>
            </div>
          </div>
        )}

        {/* List View */}
        <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {sortedUsers?.map((user, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={user.id}
                  className={cn(
                    "flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors",
                    user.id === currentUser?.id ? "bg-primary/5" : "",
                  )}
                >
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    {getRankIcon(index)}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-bold truncate",
                        user.id === currentUser?.id
                          ? "text-primary"
                          : "text-foreground",
                      )}
                    >
                      {user.username}
                      {user.id === currentUser?.id && " (You)"}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.name}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-lg text-primary">
                      {user.greenScore}
                    </span>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">
                      Points
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
