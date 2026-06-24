/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Allow any HTTPS image source — needed once real product photos
        // are hosted on Cloudinary, S3, or similar. Restrict this to
        // specific hostnames once you know where images will be hosted.
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
