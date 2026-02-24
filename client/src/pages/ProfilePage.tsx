import { useActivities } from "@/hooks/use-activities";
import { useUser, useLogout } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { StatCard } from "@/components/StatCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { LogOut, Leaf, Trophy, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: user } = useUser();
  const logoutMutation = useLogout();

  if (!user) return null;
  let arr = useActivities().data;
  let actions = 0;
  if (arr !== undefined) {
    actions = arr.length;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="inline-flex items-center justify-center w-16 h-16">
          <img
            src="/GreenspaceLogo.png"
            alt="Greenspace Logo"
            className="w-15 h-15 object-contain"
          />
        </div>
        <button
          onClick={() => logoutMutation.mutate()}
          className="p-2 rounded-full text-muted-foreground hover:bg-muted/50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">
        {/* User Info */}
        <section className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-green-300 shadow-lg flex items-center justify-center text-white text-2xl font-display font-bold">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Hello, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground font-medium">
              @{user.username}
            </p>
          </div>
        </section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <StatCard
            label="Green Score"
            value={user.greenScore}
            trend="up"
            icon={<Leaf className="w-24 h-24 text-primary" />}
            className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20"
          />
          <StatCard
            label="Actions"
            value={actions}
            trend="up"
            icon={<Trophy className="w-24 h-24 text-accent" />}
            className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20"
          />
        </motion.section>

        {/* Activity Feed */}
        <section>
          <ActivityFeed />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
