import { useAllActivities } from "@/hooks/use-activities";
import { Link } from "wouter";
import { Leaf, Users, Heart } from "lucide-react";

//console.log(useAllActivities().data);
// we should probably turn this into a use function like the other fetch requests.
const res = await fetch("/api/all-activities", { credentials: "include" });
let activities = await res.json();
console.log(activities);

export default function Community() {
  return (
    <div className="min-h-screen w-full bg-background p-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-card p-8 rounded-3xl shadow-lg border border-border/50 text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Users className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Community
            </h1>
            <p className="text-muted-foreground mt-2">
              See what everyone is doing to make the world a greener place 🌱
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity gap-2"
          >
            <Leaf className="w-5 h-5" />
            Back Home
          </Link>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card flex flex-col"
            >
              <div className="relative">
                <img
                  src={activity.imageUrl}
                  alt="Community post"
                  className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Heart className="w-5 h-5 fill-white" />
                    10
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="px-3 py-2 text-sm text-center text-muted-foreground">
                {activity.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
