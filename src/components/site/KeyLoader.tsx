export function KeyLoader({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="relative h-24 w-24">
        <svg
          className="absolute inset-0 h-full w-full text-navy animate-key-swing-left"
          viewBox="0 0 64 64"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M22 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-2 14v38a2 2 0 0 0 4 0V16h-4Z" />
        </svg>
        <svg
          className="absolute inset-0 h-full w-full text-gold animate-key-swing-right"
          viewBox="0 0 64 64"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M42 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-2 14v38a2 2 0 0 0 4 0V16h-4Z" />
        </svg>
      </div>
      {message && (
        <p className="mt-6 text-sm font-medium text-muted-foreground animate-fade-in">
          {message}
        </p>
      )}
    </div>
  );
}
