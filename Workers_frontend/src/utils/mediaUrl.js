/**
 * mediaUrl.js — Resolves photo and image URLs cleanly across environments.
 * Handles Cloudinary URLs, relative paths (/uploads/...), absolute localhost URLs, and external URLs.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
// Strip trailing /api to get base server origin
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function getMediaUrl(url, fallback = '') {
  if (!url) return fallback;
  if (typeof url !== 'string') return fallback;

  // Handle data URIs
  if (url.startsWith('data:')) return url;

  // Cloudinary URLs — pass through as-is (they are already absolute and permanent)
  if (url.includes('res.cloudinary.com')) return url;

  // If path is relative like /uploads/abc.jpg or uploads/abc.jpg (legacy local uploads)
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${BACKEND_ORIGIN}${cleanPath}`;
  }

  // If URL contains localhost:8080/uploads/ but we are configured with a custom BACKEND_ORIGIN
  if (url.includes('localhost:8080/uploads/')) {
    const pathPart = url.substring(url.indexOf('/uploads/'));
    return `${BACKEND_ORIGIN}${pathPart}`;
  }

  return url;
}

export default getMediaUrl;

