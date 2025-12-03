export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md rounded-lg border bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
        <p className="mt-3 text-sm text-gray-600">
          You do not have permission to access this page. If you believe this is a mistake, please
          contact your system administrator.
        </p>
      </div>
    </div>
  )
}
