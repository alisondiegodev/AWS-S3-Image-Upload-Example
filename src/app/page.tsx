"use client";
import Image from "next/image";
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { getSignedURL } from "./actions";

export default function UploadImage() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonDisabled = content.length < 1 || loading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("Creating");
    setLoading(true);
    
    console.log(content, file);

    
    if (file) {
      const signedURL = await getSignedURL(file?.name)
      const url = signedURL.success.url
      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type
        }
      })
      console.log("Link: " + response.url.split("?X-")[0])
    }

    
    setStatusMessage("Created");
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    } else {
      setFileUrl(undefined);
    }
  };

  return (
    <div className="bg-zinc-700 flex flex-col justify-center items-center gap-4 h-[100vh] w-full">
      <div className=" bg-white p-8 mt-6 rounded-md flex flex-col gap-4">
        <p>Post something</p>
        {statusMessage && <p>{statusMessage}</p>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-4 justify-center items-start"
        >
          <div className="flex gap-2 w-full items-center justify-between">
            <input
              type="text"
              className="outline-none p-4"
              placeholder="Whats happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <ImageIcon />
            </label>
          </div>
          <input
            id="fileInput"
            className="hidden"
            type="file"
            onChange={(e) => handleChange(e)}
          />

          {fileUrl && file && (
            <Image
              src={fileUrl}
              width={400}
              height={400}
              alt="Image user have uploaded"
            />
          )}

          <div className="flex justify-end w-full mt-8">
            <button
              disabled={buttonDisabled ? true : false}
              className={`${buttonDisabled ? "opacity-60" :"hover:shadow-xl"}  text-gray-800 font-semibold shadow-md py-2 px-4 rounded`}
              type="submit"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
