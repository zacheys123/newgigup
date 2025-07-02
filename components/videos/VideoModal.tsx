"use client";
import { motion } from "framer-motion";
import { Upload, X, Film, Check, AlertTriangle } from "lucide-react";
import { useState, useCallback, ChangeEvent, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import { fileupload } from "@/hooks/fileUpload";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserProps } from "@/types/userinterfaces";
import Image from "next/image";
import { Camera } from "react-feather";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const VideoUploadModal = ({
  isOpen,
  onClose,
  onUploadSuccess,
}: VideoUploadModalProps) => {
  const { user } = useCurrentUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const dep = "video";
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];

      fileupload(
        event,
        (file: string) => setVideoUrl(file),
        toast,
        allowedTypes,
        fileUrl,
        (file: string | undefined) => file && setFileUrl(file),
        setIsUploading,
        dep,
        user?.user as UserProps,
        () => {} // refetch callback
      );
    },
    [fileUrl, user]
  );

  const handleThumbnailUpload = useCallback(
    async (file: File) => {
      const dep = "image";
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      // Create a mock event object for the fileupload function
      const mockEvent = {
        target: {
          files: [file],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await fileupload(
        mockEvent,
        (url: string) => setThumbnailUrl(url),
        toast,
        allowedTypes,
        thumbnailUrl,
        (url: string | undefined) => url && setThumbnailUrl(url),
        setIsUploading,
        dep,
        user?.user as UserProps,
        () => {} // refetch callback
      );
    },
    [thumbnailUrl, user]
  );

  const captureThumbnail = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas dimensions to match video frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame on canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        // Create a file from the blob
        const thumbnailFile = new File([blob], "thumbnail.jpg", {
          type: "image/jpeg",
        });

        // Upload the thumbnail
        await handleThumbnailUpload(thumbnailFile);

        // Set local thumbnail for preview
        const thumbnailUrl = URL.createObjectURL(blob);
        setThumbnail(thumbnailUrl);

        toast.success("Thumbnail captured and uploaded!");
      },
      "image/jpeg",
      0.8
    );
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl) {
      toast.error("Please upload a video first");
      return;
    }

    if (!thumbnailUrl) {
      toast.error("Please capture and upload a thumbnail first");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/videos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          source: videoUrl,
          thumbnail: thumbnailUrl,
          postedBy: user?.user?._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Video uploaded successfully!");
        onUploadSuccess();
        resetForm();
        onClose();
      } else {
        toast.error(data.message || "Failed to upload video");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred while uploading");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFileUrl("");
    setVideoUrl("");
    setThumbnail("");
    setThumbnailUrl("");
    setCurrentTime(0);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-900/80 to-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-purple-500/10">
              <Film className="h-5 w-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Upload New Video</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {!videoUrl ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-500/10 to-purple-500/10 mb-4">
                  <Upload className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Add Your Performance Video
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Showcase your talent with a high-quality video. This will
                  appear in your public profile portfolio.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-700/50 rounded-xl p-8 text-center hover:border-amber-400/30 transition-all cursor-pointer">
                <label htmlFor="video-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Click to browse or drag & drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        MP4, MOV or AVI (Max 100MB)
                      </p>
                    </div>
                    {isUploading && (
                      <div className="flex items-center gap-2 text-amber-400 mt-3">
                        <CircularProgress
                          size={16}
                          className="text-amber-400"
                        />
                        <span className="text-xs">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-lg border border-gray-700/50 p-4">
                <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Upload Tips
                </h4>
                <ul className="text-xs text-gray-400 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Keep videos under 2 minutes for best engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Use landscape orientation for better viewing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Ensure good lighting and audio quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Show your best work first</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Video Preview with Thumbnail Controls */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-700/50">
                  <video
                    ref={videoRef}
                    src={fileUrl}
                    className="w-full h-full object-contain"
                    controls
                    onTimeUpdate={handleTimeUpdate}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl("");
                      setThumbnail("");
                      setThumbnailUrl("");
                    }}
                    className="absolute top-3 right-3 bg-gray-900/80 text-white p-1.5 rounded-full hover:bg-gray-800 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Thumbnail Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Camera className="h-4 w-4 text-amber-400" />
                      Select Thumbnail
                    </h3>
                    {thumbnailUrl && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Thumbnail uploaded
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max={videoRef.current?.duration || 0}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={captureThumbnail}
                      disabled={isUploading}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-400/30 text-amber-300 text-xs rounded-full hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-purple-500/20 transition-all disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <CircularProgress
                            size={12}
                            className="text-amber-400 mr-1"
                          />
                          Uploading...
                        </>
                      ) : (
                        "Capture & Upload Frame"
                      )}
                    </button>
                  </div>

                  {/* Thumbnail Preview */}
                  {thumbnail && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">
                        Thumbnail Preview:
                      </p>
                      <div className="relative w-32 h-20 border border-gray-700/50 rounded overflow-hidden">
                        <Image
                          src={thumbnail}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                          height={100}
                          width={100}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnail("");
                            setThumbnailUrl("");
                          }}
                          className="absolute top-1 right-1 bg-black/70 text-white p-0.5 rounded-full hover:bg-black transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hidden canvas for thumbnail capture */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all"
                    placeholder="E.g. 'Live Performance at Jazz Festival'"
                    required
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all"
                    placeholder="Tell viewers about this performance (optional)"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !thumbnailUrl}
                  className="w-full bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={16} className="text-white" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Publish Video</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoUploadModal;
