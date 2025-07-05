import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = "119561404479-bbhdt0e630s78u0jae4du68c7morplnh.apps.googleusercontent.com";

function UploadToDrive({ onUploadSuccess, accessToken }) {
    const [fileUrl, setFileUrl] = useState("");

    const canUpload = !!accessToken;

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !canUpload) return;

        const metadata = {
            name: file.name,
            mimeType: file.type || "application/zip",
        };

        const form = new FormData();
        form.append(
            "metadata",
            new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        form.append("file", file);

        try {
            const res = await fetch(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: form,
                }
            );
            const data = await res.json();
            if (!res.ok) {
                setFileUrl("");
                if (data.error && data.error.code === 401) {
                    alert("Your Google login session has expired. Please sign in to Google again!");
                } else {
                    alert(`Error ${res.status}: ${JSON.stringify(data)}`);
                }
            } else {
                await fetch(
                    `https://www.googleapis.com/drive/v3/files/${data.id}/permissions`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            role: "reader",
                            type: "anyone",
                        }),
                    }
                );

                const fileLink = `https://drive.google.com/file/d/${data.id}/view`;
                setFileUrl(fileLink);
                alert("Upload thành công!");
                if (typeof onUploadSuccess === "function") {
                    onUploadSuccess(fileLink);
                }
            }
        } catch (err) {
            alert("Upload failed: " + err.message);
            setFileUrl("");
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
            <h3>Upload ZIP to Google Drive</h3>
            {!canUpload && (
                <div style={{ color: "red", marginBottom: 10 }}>
                    You are not logged in to Google or the token has expired.<br />
                    Please log in to Google before uploading!
                </div>
            )}
            <input
                type="file"
                accept=".zip,application/zip"
                onChange={handleUpload}
                style={{ marginTop: 20 }}
                disabled={!canUpload}
            />
            {fileUrl && (
                <div style={{ marginTop: 20 }}>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        View uploaded files on Google Drive
                    </a>
                </div>
            )}
        </div>
    );
}

export default function UploadZip(props) {
    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <UploadToDrive {...props} />
        </GoogleOAuthProvider>
    );
}
