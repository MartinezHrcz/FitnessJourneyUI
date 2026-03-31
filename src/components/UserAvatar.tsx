import {useEffect, useMemo, useState} from "react";
import {fileShareApi} from "../api/file/fileShareApi.ts";

interface UserAvatarProps {
    name?: string;
    imageFilename?: string | null;
    className?: string;
    textClassName?: string;
}

const UserAvatar = ({
    name,
    imageFilename,
    className = "w-10 h-10",
    textClassName = "text-base"
}: UserAvatarProps) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    const fallbackInitial = useMemo(() => {
        if (!name?.trim()) return "U";
        return name.trim().charAt(0).toUpperCase();
    }, [name]);

    useEffect(() => {
        let objectUrl: string | null = null;
        let isMounted = true;

        if (!imageFilename) {
            setImgSrc(null);
            return;
        }

        if (imageFilename.startsWith("http") || imageFilename.startsWith("data:")) {
            setImgSrc(imageFilename);
            return;
        }

        fileShareApi.getFile(imageFilename)
            .then((response) => {
                if (!isMounted) return;

                if (typeof response.data === 'string') {
                    setImgSrc(response.data);
                } else if (response.data instanceof Blob) {
                    objectUrl = URL.createObjectURL(response.data);
                    setImgSrc(objectUrl);
                } else if (response.data === null) {
                    setImgSrc(null);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.warn("Failed to load image:", error);
                    setImgSrc(null);
                }
            });

        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imageFilename]);

    return (
        <div className={`${className} rounded-full overflow-hidden bg-gray-100 dark:bg-slate-950 flex items-center justify-center`}>
            {imgSrc ? (
                <img
                    src={imgSrc}
                    className="w-full h-full object-cover"
                    onError={() => setImgSrc(null)}
                    alt={name ? `${name} avatar` : "User avatar"}
                />
            ) : (
                <div className={`w-full h-full bg-gray-100 dark:bg-slate-950 rounded-full flex items-center justify-center text-black dark:text-white font-normal [text-shadow:0_0_10px_rgba(59,130,246,0.95),0_0_22px_rgba(59,130,246,0.8),0_0_34px_rgba(59,130,246,0.55)] ${textClassName}`}>
                    {fallbackInitial}
                </div>
            )}
        </div>
    );
};

export default UserAvatar;