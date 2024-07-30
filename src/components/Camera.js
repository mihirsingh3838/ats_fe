import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useAttendance } from "../hooks/useAttendance";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const Camera = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const { markAttendance, isLoading, error } = useAttendance();
  const navigate = useNavigate();
  const [isCameraOpen, setIsCameraOpen] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);
    }
  };

  const handleSubmit = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      await markAttendance(imageSrc, location, userId);

      // Reset image source and turn off the camera
      setImageSrc(null);
      if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
        webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
      }

      // Navigate to home page
      toast.success("Attendance submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleClose = () => {
    setIsCameraOpen(false);
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
      webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    isCameraOpen && (
      <div className="flex flex-col items-start bg-gray-200 p-4 rounded-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        {!imageSrc && (
          <div className="flex flex-col items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="mb-4"
            />
            <button
              onClick={captureImage}
              className="bg-indigo-600 text-white p-2 rounded-lg"
            >
              Click
            </button>
          </div>
        )}
        {imageSrc && (
          <div className="ml-4">
            <h3>Captured Image:</h3>
            <img src={imageSrc} alt="Captured" className="mt-2 rounded-lg" />
            <button
              onClick={handleSubmit}
              className={`bg-red-600 text-white p-2 rounded-lg mt-4 ${
                isLoading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
        {error && (
          <div className="error mt-4 p-2 bg-red-100 text-red-700 border border-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    )
  );
};

export default Camera;
