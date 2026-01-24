import { useState, useCallback } from "react";
import { useCreateActivity } from "@/hooks/use-activities";
import { BottomNav } from "@/components/BottomNav";
import { useDropzone } from "react-dropzone";
import { Camera, Upload, X, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

export default function ActionPage() {
  const [, setLocation] = useLocation();
  const createActivity = useCreateActivity();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !caption) return;

    createActivity.mutate(
      { caption, image: file },
      {
        onSuccess: () => {
          setFile(null);
          setPreview(null);
          setCaption("");
          setLocation("/");
        },
      },
    );
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="inline-flex items-center justify-center w-16 h-16">
          <img
            src="/GreenspaceLogo.png"
            alt="Greenspace Logo"
            className="w-15 h-15 object-contain"
          />
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-display font-bold">New Green Action</h1>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col space-y-6"
        >
          {/* File Upload Area */}
          <div className="flex-1 min-h-[300px] relative group cursor-pointer">
            <div
              {...getRootProps()}
              className={`absolute inset-0 rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center p-6 ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : preview
                    ? "border-transparent"
                    : "border-muted-foreground/30 bg-muted/20 hover:bg-muted/30"
              }`}
            >
              <input {...getInputProps()} />

              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full"
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl shadow-lg"
                    />
                    <button
                      onClick={removeFile}
                      className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors backdrop-blur-md"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="inline-block bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        Tap to change photo
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                      <Camera className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        Upload Photo
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-[200px] mx-auto">
                        Snap a picture of your green activity (recycling,
                        planting, etc.)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-1 uppercase tracking-wide opacity-70">
              Description
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="I recycled 5 plastic bottles today..."
              className="w-full px-4 py-3 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all resize-none h-24 text-base"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!file || !caption || createActivity.isPending}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-3 text-lg"
            >
              {createActivity.isPending ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Uploading
                </>
              ) : (
                <>Show off your Green</>
              )}
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
