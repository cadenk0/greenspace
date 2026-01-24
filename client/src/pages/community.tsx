import { Link } from "wouter";
import { Leaf, Users, Heart } from "lucide-react";

const photos = [
  { id: 1, src: "https://picsum.photos/400?random=1", likes: 124 },
  { id: 2, src: "https://picsum.photos/400?random=2", likes: 89 },
  { id: 3, src: "https://picsum.photos/400?random=3", likes: 203 },
  { id: 4, src: "https://picsum.photos/400?random=4", likes: 56 },
  { id: 5, src: "https://picsum.photos/400?random=5", likes: 311 },
  { id: 6, src: "https://picsum.photos/400?random=6", likes: 77 },
];

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
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card"
            >
              <img
                src={photo.src}
                alt="Community post"
                className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Heart className="w-5 h-5 fill-white" />
                  {photo.likes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
