import { useActivities } from "@/hooks/use-activities";
import { format } from "date-fns";
import { Leaf, Award, Loader2 } from "lucide-react";

function isVerified(points: number) {
  return points >= 5;
}

export function ActivityFeed() {
  const { data: activities, isLoading, error } = useActivities();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">
          Loading your green journey...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive bg-destructive/5 rounded-2xl">
        Error loading activities.
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No activities yet
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
          Your journey starts with a single step. Upload your first green
          activity!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <h3 className="text-lg font-display font-bold text-foreground px-1">
        Recent Activity
      </h3>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex p-4 gap-4">
            <div className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-muted">
              <img
                src={activity.imageUrl}
                alt={activity.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-bold text-white">
                  +{activity.points}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                "{activity.caption}"
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isVerified(activity.points) ? (
                  <>
                    <Leaf className="w-3 h-3 text-primary" />
                    <span>Green Activity verified</span>
                  </>
                ) : (
                  <>
                    <Leaf className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Green Activity not verified
                    </span>
                  </>
                )}
                <span className="text-border">•</span>
                <time>
                  {format(new Date(activity.createdAt), "MMM d, yyyy")}
                </time>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
