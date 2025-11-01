
interface AuthLayoutProps{
    title: string,
    subTitle?: string,
    icon?: string,
    children: React.ReactNode,
}

export default function AuthLayout({title,subTitle,icon,children}: AuthLayoutProps) {
    return (
      <div className="min-h-screen flex items center justify-center">
          <div className="bg-blue-300 p-8 rounded-2xl shadow-lg w-full max-w-md">
              {icon && (
                  <div className="flex justify-left mb-4">{icon}</div>
              )}
              <h1 className="text-2xl font-semibold text-center">{title}</h1>
              {subTitle &&(
                    <p>{subTitle}</p>
              )}
              {children}
          </div>
      </div>
    );
}