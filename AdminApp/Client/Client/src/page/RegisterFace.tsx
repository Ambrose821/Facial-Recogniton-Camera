import Camera from "../components/Camera";
import "../styles/pages/RegisterFace.css";
import { useState } from "react";
import { registerFace } from "../api/RegisterFace";

export default function RegisterFace() {
    const [imgUrls, setImgUrls] = useState<string[]>([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [succesfulReg, setSuccessfulReg] = useState(false)
    const [errState, setErrState] = useState(false)

    const captureCallback = (imgUrl: string) => {
        setImgUrls((prev) => [...prev, imgUrl]);
    };

    const refreshCallback = () => {
        setImgUrls([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: hook this up to your backend/register API
        console.log({ firstName, lastName, identifier, imgUrls });

        const success = await registerFace({ firstName, lastName, identifier, imgUrls })

        setSuccessfulReg(success)
        setErrState(!success)
    };

    const hasImages = imgUrls.length > 0;

    return (
        <div className={hasImages ? "register-content has-images" : "register-content"}>
            <div className="form">
                <h2>Register Person</h2>

                {succesfulReg && !errState &&
                <div className="success-message">
                    Face Registerd! Feel free to add more images for this user
                </div>}
                 {!succesfulReg && errState &&
                <div className="failure-message">
                    Uh oh! Something went wrong
                </div>}

                <form className="form-fields" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="identifier">ID / Email / Badge</label>
                        <input
                            id="identifier"
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button register-button"
                        disabled={!firstName || !lastName || !identifier || !hasImages}
                    >
                        Register Person
                    </button>
                </form>
            </div>

            <div className="camera-container">
                <h2>Capture Photos</h2>
                <Camera captureCallback={captureCallback} refreshCallback={refreshCallback} />
                <p className="camera-hint">Capture several angles before registering.</p>
            </div>

            {hasImages && (
                <div className="photos">
                    <h2>Captured Photos ({imgUrls.length})</h2>
                    <div className="photo-list">
                        {imgUrls.map((imgSrc, index) => (
                            <div className="photo-thumb" key={index}>
                                <img src={imgSrc} alt={`capture-${index}`} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}