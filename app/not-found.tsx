import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Página não encontrada</h2>
      <p className="mb-8 text-muted-foreground">A página que você está procurando não existe.</p>
      <Link
        href="/login"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Voltar para o login
      </Link>
    </div>
  )
}
