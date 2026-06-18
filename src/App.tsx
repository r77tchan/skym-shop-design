import { ThemeToggle } from '@/components/theme-toggle'

export function App() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between gap-4 border-b pb-4">
          <p className="font-heading text-base font-semibold">SKYM TACKLE</p>
          <ThemeToggle />
        </header>
      </div>
    </main>
  )
}
