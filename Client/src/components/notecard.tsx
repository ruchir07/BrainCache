import React from "react";
export type NoteType = "all" | "note" | "file" | "link";
import { useEffect, useState } from "react";
import {
  Calendar,
  Tag,
  Play,
  Twitter,
  ExternalLink,
  Globe,
} from "lucide-react";
import { TwitterTweetEmbed } from "react-twitter-embed";

interface INote {
  userId: string;
  type: NoteType;
  title: string;
  content: string;
  tags: string[];
  fileUrl?: string;
  vector?: number[];
  createdAt: Date;
}

const NoteCard = (props: INote) => {
  const [contentType, setContentType] = useState<
    "youtube" | "twitter" | "default"
  >("default");
  const [youtubeId, setYoutubeId] = useState<string>("");
  const [tweetId, setTweetId] = useState<string | null>(null);

  useEffect(() => {
    if (props.fileUrl) {
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const youtubeMatch = props.fileUrl.match(youtubeRegex);

      if (youtubeMatch) {
        setContentType("youtube");
        setYoutubeId(youtubeMatch[1]);
      } else if (
        props.fileUrl.includes("twitter.com") ||
        props.fileUrl.includes("x.com")
      ) {
        setContentType("twitter");

        const tweetMatch = props.fileUrl.match(/status\/(\d+)/);
        if (tweetMatch && tweetMatch[1]) {
          setTweetId(tweetMatch[1]);
        }
      }
    }
  }, [props.fileUrl, props.content, props.title]);

  const renderPreview = () => {
    switch (contentType) {
      case "youtube":
        return (
          <div className="relative mb-4 rounded-xl overflow-hidden group cursor-pointer">
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
              alt="YouTube thumbnail"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
              <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
            </div>
            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              YouTube
            </div>
          </div>
        );

      case "twitter":
        return (
          <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="p-3 bg-gradient-to-r from-blue-100 via-white to-blue-50 flex items-center gap-2">
              <div className="bg-blue-500 text-white p-1 rounded-full">
                <Twitter className="w-4 h-4" />
              </div>
              <span className="text-blue-700 font-semibold text-sm">Tweet</span>
            </div>

            <div className="px-4 py-3">
              {tweetId ? (
                <TwitterTweetEmbed
                  tweetId={tweetId}
                  options={{ width: "100%" }}
                />
              ) : (
                <div className="text-sm italic text-gray-500">
                  Unable to load tweet
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getCardIcon = () => {
    switch (contentType) {
      case "youtube":
        return <Play className="w-5 h-5 text-red-600" />;
      case "twitter":
        return <Twitter className="w-5 h-5 text-blue-500" />;
      default:
        return props.fileUrl ? (
          <Globe className="w-5 h-5 text-gray-500" />
        ) : null;
    }
  };

  return (
    <div className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-6">
      {/* Gradient accent based on content type */}
      <div
        className={`h-1 ${
          contentType === "youtube"
            ? "bg-gradient-to-r from-red-500 to-red-600"
            : contentType === "twitter"
            ? "bg-gradient-to-r from-blue-400 to-blue-500"
            : "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"
        }`}
      ></div>

      <div className="p-6">
        {/* Preview Section */}
        {renderPreview()}

        {/* Header with title and icon */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors flex-1">
            {props.title}
          </h3>
          {getCardIcon() && <div className="ml-3 mt-1">{getCardIcon()}</div>}
        </div>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed mb-4 text-base">
          {props.content}
        </p>

        {/* fileUrl Link (if not YouTube or Twitter) */}
        {props.fileUrl && contentType === "default" && props.type !== 'file' && (
          <div className="mb-4">
            <a
              href={props.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Link
            </a>
          </div>
        )}

        {props.fileUrl && props.type === "file" && (
          <div className="flex gap-4 mt-4">
            {/* View File */}
            <a
              href={`http://localhost:3000${props.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition"
            >
              👁️ View
            </a>

            {/* Download File */}
            <a
              href={`http://localhost:3000${props.fileUrl}`}
              download
              className="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition"
            >
              ⬇️ Download
            </a>
          </div>
        )}

        {/* YouTube/Twitter Links */}
        {props.fileUrl &&
          (contentType === "youtube" || contentType === "twitter") && (
            <div className="mb-4">
              <a
                href={props.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                  contentType === "youtube"
                    ? "text-red-600 hover:text-red-800"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                {contentType === "youtube"
                  ? "Watch on YouTube"
                  : "View on Twitter/X"}
              </a>
            </div>
          )}

        {/* Tags Section */}
        {props.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {props.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${
                      contentType === "youtube"
                        ? "bg-red-100 text-red-700"
                        : contentType === "twitter"
                        ? "bg-blue-100 text-blue-700"
                        : index % 3 === 0
                        ? "bg-purple-100 text-purple-700"
                        : index % 3 === 1
                        ? "bg-blue-100 text-blue-700"
                        : "bg-indigo-100 text-indigo-700"
                    }
                    hover:scale-105 transition-transform cursor-pointer
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t border-gray-100">
          <Calendar className="w-4 h-4" />
          <span>
            Added on{" "}
            {new Date(props.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
