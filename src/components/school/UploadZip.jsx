import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

// Thay clientId & apiKey bằng của bạn
const CLIENT_ID = "136974609035-otoulnu7f0cfboqouvgjcgpg39h6j2vg.apps.googleusercontent.com";
const API_KEY = "AIzaSyBi4S6wZDTjf2-pscb7vE9QFaWi79K-1NA";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

export default function UploadToDrive() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
            });
        }
        gapi.load("client:auth2", start);
    }, []);

    const handleGoogleLogin = async () => {
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            await authInstance.signIn();
            setIsSignedIn(true);
            setAccessToken(authInstance.currentUser.get().getAuthResponse().access_token);
        } catch (err) {
            console.error("Login error:", err);
        }
    };


    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("Chưa chọn file!");
            return;
        }
        if (!accessToken) {
            alert("Bạn chưa đăng nhập Google!");
            return;
        }

        const metadata = {
            name: file.name,
            mimeType: file.type || "application/zip",
        };

        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        form.append("file", file);

        fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: form,
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    console.error("Upload failed:", res.status, data);
                    alert(`Error ${res.status}: ${JSON.stringify(data)}`);
                } else {
                    alert("Upload OK, File ID: " + data.id);
                }
            })
            .catch((err) => {
                alert("Upload failed: " + err.message);
                console.error(err);
            });
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
            <h3>Upload ZIP to Google Drive</h3>
            {!isSignedIn ? (
                <button onClick={handleGoogleLogin} style={{ padding: "10px 20px" }}>
                    Đăng nhập Google Drive
                </button>
            ) : (
                <div>
                    <input
                        type="file"
                        accept=".zip,application/zip"
                        onChange={handleUpload}
                        style={{ marginTop: 20 }}
                    />
                </div>
            )}
        </div>
    );
}
