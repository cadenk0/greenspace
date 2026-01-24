import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useActivities() {
  return useQuery({
    queryKey: [api.activities.list.path],
    queryFn: async () => {
      const res = await fetch(api.activities.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activities");
      return api.activities.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ caption, image }: { caption: string; image: File }) => {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image);

      const res = await fetch(api.activities.create.path, {
        method: api.activities.create.method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Invalid input. Please check your image and caption.");
        }
        throw new Error("Failed to upload activity");
      }
      return api.activities.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.activities.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] }); // Refresh score
      queryClient.invalidateQueries({ queryKey: [api.leaderboard.list.path] }); // Refresh leaderboard
      
      toast({
        title: "Activity Verified!",
        description: `You earned ${data.points} points for your green action!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
