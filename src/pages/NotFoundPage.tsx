import { Link } from 'react-router-dom'
import { buttonClass } from '../components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl">Page not found</h1>
      <p className="mt-2 mb-6 text-muted">There's nothing at this address.</p>
      <Link to="/" className={buttonClass()}>
        Back to overview
      </Link>
    </div>
  )
}
