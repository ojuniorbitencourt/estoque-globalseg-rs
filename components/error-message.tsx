import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  title?: string
  message: string
  className?: string
}

export function ErrorMessage({ title = "Erro", message, className = "" }: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 text-red-700 p-4 rounded-md mb-4 dark:bg-red-900/30 dark:text-red-400 ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-1 ml-7">{message}</p>
    </div>
  )
}
