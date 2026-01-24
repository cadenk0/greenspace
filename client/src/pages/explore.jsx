import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ExplorePhotosPage() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch("/api/photos")
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 p-4">
      <h1 className="text-2xl font-semibold mb-4">Explore</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden rounded-2xl shadow-sm">
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="w-full h-56 object-cover"
              />

              <CardContent className="p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">@{photo.username}</span>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Heart size={14} /> {photo.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} /> {photo.comments}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Expected API response shape:
[
  {
    id: "1",
    imageUrl: "https://...",
    caption: "recycle",
    username: "alex",
    likes: 120,
    comments: 14
  }
]
*/
