import DisenadorClient from "./disenador-client"

export const metadata = {
  robots: { index: false, follow: false },
}

export default function Page() {
  return <DisenadorClient />
}
