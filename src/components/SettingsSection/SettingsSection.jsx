import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Video, Eye, Trash2 } from "lucide-react";
import axios from "axios";

const SettingsSection = () => {
  const [mainImage, setMainImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const BASE_URL = "http://localhost:3085";

  // ✅ Fetch saved media when component loads
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axios.get("http://localhost:3085/api/media/latest");
      if (response.data.success) {
        const { imageUrl, videoUrl } = response.data.data;

        // Set the preview URLs to backend-hosted files
        if (imageUrl) setImagePreview(BASE_URL + imageUrl);
        if (videoUrl) setVideoPreview(BASE_URL + videoUrl);
      } else {
        console.log("No media found yet.");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideo(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const removeImage = () => {
    setMainImage(null);
    setImagePreview(null);
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
  };

  // ✅ Save (upload or update) media
  const handleSave = async () => {
    try {
      if (!mainImage && !video) {
        alert("Please upload at least an image or video before saving.");
        return;
      }

      const formData = new FormData();
      if (mainImage) formData.append("image", mainImage);
      if (video) formData.append("video", video);

      const response = await axios.post(`${BASE_URL}/api/media/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Settings saved successfully!");
        console.log("Saved media:", response.data.data);

        // ✅ Fetch updated media from backend
        fetchMedia();

        // Clear uploaded files
        setMainImage(null);
        setVideo(null);
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Error saving settings. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE6E1] to-[#F8F0ED] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your banner images and promotional videos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Image Upload Box */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Main Banner Image
                </h2>
                <p className="text-gray-600 text-sm">
                  Upload your main promotional banner
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#8C3C4E] transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-xl mx-auto"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() =>
                          document.getElementById("image-upload").click()
                        }
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={removeImage}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 text-sm font-medium">
                      Image loaded successfully!
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your image here
                  </p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Video Upload Box */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Promotional Video
                </h2>
                <p className="text-gray-600 text-sm">
                  Upload your promotional video
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#8C3C4E] transition-colors">
              {videoPreview ? (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      src={videoPreview}
                      className="w-full h-48 object-cover rounded-xl mx-auto"
                      controls
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() =>
                          document.getElementById("video-upload").click()
                        }
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={removeVideo}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 text-sm font-medium">
                      Video loaded successfully!
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your video here
                  </p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Video</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-lg"
          >
            Save Settings
          </button>
        </div>

        {/* Preview Section */}
        {(imagePreview || videoPreview) && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Preview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {imagePreview && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">
                    Banner Image Preview
                  </h4>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                </div>
              )}
              {videoPreview && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">
                    Video Preview
                  </h4>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <video
                      src={videoPreview}
                      className="w-full h-48 object-cover rounded-xl"
                      controls
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
