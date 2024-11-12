import Link from "next/link"

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>I don&apos;t know what you where looking for, but it&apos;s not available!</p>
      <Link href="/conversations">Return Home</Link>
    </div>
  )
}
