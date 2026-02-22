import {XIcon} from "lucide-react";

interface AuthLayoutProps{
    title: string,
    subTitle?: string,
    icon?: React.ReactNode,
    children: React.ReactNode,
}

export default function AuthLayout({title,subTitle,icon,children}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 transition-colors duration-300 p-4">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl w-full max-w-md border border-transparent dark:border-slate-800 transition-colors">
                <div className="float-end cursor-pointer text-gray-400 hover:text-red-600 transition duration-300 ease-in-out hover:scale-110">
                    <XIcon size={24} />
                </div>

                {icon && (
                  <div className="flex justify-left mb-4 text-blue-600 dark:text-blue-400">{icon}</div>
                )}

                <h1 className="text-2xl font-black text-gray-800 dark:text-white">{title}</h1>

                {subTitle &&(
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{subTitle}</p>
                )}

                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}