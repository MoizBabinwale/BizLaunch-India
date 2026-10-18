import { useRef, useState } from "react";
import { ImagePlus, Link2, LoaderCircle, Trash2, Upload } from "lucide-react";
import { uploadImage } from "../../api/uploadApi";

const normalizePhotoUrl = (value) => {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Use an HTTP or HTTPS photo link.");
  }

  const host = url.hostname.toLowerCase();
  const driveId =
    (host === "drive.google.com" &&
      (url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get("id"))) ||
    (host === "docs.google.com" && url.pathname.match(/\/file\/d\/([^/]+)/)?.[1]);
  return driveId
    ? `https://drive.google.com/uc?export=view&id=${encodeURIComponent(driveId)}`
    : url.href;
};

export default function PhotoField({
  label = "Photos",
  value = [],
  onChange,
  maxPhotos = 8,
  profilePhoto = "",
  onSelectProfilePhoto,
}) {
  const inputRef = useRef(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const addPhotos = (photos) => {
    const remaining = maxPhotos - value.length;
    if (remaining <= 0) {
      setError(`You can add up to ${maxPhotos} photos.`);
      return;
    }
    onChange([...value, ...photos.filter((photo) => !value.includes(photo)).slice(0, remaining)]);
    setError("");
  };

  const addUrl = () => {
    try {
      addPhotos([normalizePhotoUrl(url.trim())]);
      setUrl("");
    } catch (reason) {
      setError(reason.message || "Enter a valid photo link.");
    }
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    if (files.some((file) => !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type))) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Each photo must be 5 MB or smaller.");
      return;
    }
    if (files.length > maxPhotos - value.length) {
      setError(`You can add up to ${maxPhotos} photos.`);
      return;
    }

    setUploading(true);
    setError("");
    const uploaded = [];
    try {
      for (const file of files) {
        uploaded.push(await uploadImage(file));
      }
      addPhotos(uploaded);
    } catch (reason) {
      if (uploaded.length) addPhotos(uploaded);
      setError(reason.message || "Unable to upload the selected photo(s).");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">{label} <span className="font-normal text-muted">(optional)</span></h3>
        <p className="mt-1 text-xs text-muted">Upload from your device, or add a public image URL or Google Drive share link. Drive files must be shared with anyone who has the link.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || value.length >= maxPhotos}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-slate-50 disabled:opacity-50"
        >
          {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading..." : "Choose from device"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFiles}
          className="hidden"
          aria-label={`Upload ${label.toLowerCase()} from device`}
        />
        <div className="flex min-w-[min(100%,20rem)] flex-1 gap-2">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste an image or Google Drive link"
            disabled={uploading}
            className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            aria-label={`${label} URL`}
          />
          <button
            type="button"
            onClick={addUrl}
            disabled={uploading || !url.trim() || value.length >= maxPhotos}
            className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary disabled:opacity-50"
          >
            <Link2 size={15} /> Add
          </button>
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((photo, index) => (
            <div key={`${photo}-${index}`} className="group relative">
              <img src={photo} alt={`${label} ${index + 1}`} className="h-28 w-full rounded-xl border border-border object-cover" />
              {onSelectProfilePhoto && (
                <button
                  type="button"
                  onClick={() => onSelectProfilePhoto(profilePhoto === photo ? "" : photo)}
                  aria-pressed={profilePhoto === photo}
                  className={`absolute bottom-2 left-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow ${
                    profilePhoto === photo
                      ? "bg-primary text-white"
                      : "bg-white/95 text-text-primary hover:bg-primary-sky"
                  }`}
                >
                  {profilePhoto === photo ? "Shop profile photo" : "Set as profile"}
                </button>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, photoIndex) => photoIndex !== index))}
                disabled={uploading}
                aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
                className="absolute right-2 top-2 rounded-lg bg-white/95 p-2 text-red-600 shadow hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-xs text-muted">
          <ImagePlus size={16} /> No photos added
        </div>
      )}
      <p className="text-xs text-muted">{value.length}/{maxPhotos} photos</p>
    </section>
  );
}
