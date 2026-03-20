import {useEffect, useMemo, useState} from "react";
import {fileShareApi} from "../api/file/fileShareApi.ts";

interface UserAvatarProps {
    name?: string;
    imageFilename?: string | null;
    alt?: string;
    className?: string;
    textClassName?: string;
}

const UserAvatar = ({
    name,
    imageFilename,
    alt = "User avatar",
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
                objectUrl = URL.createObjectURL(response.data);
                setImgSrc(objectUrl);
            })
            .catch(() => {
                if (isMounted) {
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
        <div className={`${className} rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center`}>
            {imgSrc ? (
                <img src={imgSrc} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <span className={`font-black text-blue-600 dark:text-blue-400 ${textClassName}`}>{fallbackInitial}</span>
            )}
        </div>
    );
};

export default UserAvatar;