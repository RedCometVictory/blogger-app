import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__inner">
        <h2>404 | Page Not Found</h2>
        <div className="text">
          <p>We cannot find what you are looking for.</p>
          <p>You may not be logged in.</p>
          <div>
            <p>
              Go back <Link href="/"><a>Home</a></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};
export default NotFound;