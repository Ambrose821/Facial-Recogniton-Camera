import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import '../styles/components/Camera.css';

interface CameraProps {
  captureCallback: (url: string) => void;
  refreshCallback: () => void;
}

const Camera = ({ captureCallback, refreshCallback }: CameraProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null | undefined>(null);

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setUrl(imageSrc);
    if (imageSrc) {
      captureCallback(imageSrc);
    }
  }, [webcamRef]);

  const onUserMedia = (e: MediaStream) => {
    // console.log(e);
  };

  return (
    <div className="camera-wrapper">
      <div className="camera-view">
        <Webcam
          ref={webcamRef}
          audio={true}
          screenshotFormat="image/jpeg"
          onUserMedia={onUserMedia}
        />
      </div>
      <div className="camera-controls">
        <button onClick={capturePhoto}>Capture</button>
        <button onClick={refreshCallback}>Refresh</button>
      </div>
    </div>
  );
};

export default Camera;
