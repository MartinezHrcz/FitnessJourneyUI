import {XIcon} from "lucide-react";

interface AuthLayoutProps{
    title: string,
    subTitle?: string,
    icon?: React.ReactNode,
    children: React.ReactNode,
}

export default function AuthLayout({title,subTitle,icon,children}: AuthLayoutProps) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white-300 p-8 rounded-2xl shadow-lg w-full max-w-md">
              <div className="float-end cursor-pointer hover:text-red-600 transition duration-300 ease-in-out hover:scale-110">
                  <XIcon size={24} />
              </div>
              {icon && (
                  <div className="flex justify-left mb-4">{icon}</div>
              )}
              <h1 className="text-2xl font-semibold text-center">{title}</h1>
              {subTitle &&(
                    <p className="text-center text-gray-700">{subTitle}</p>
              )}
              <div className="mt-4">
                  {children}
              </div>
          </div>
      </div>
    );
}