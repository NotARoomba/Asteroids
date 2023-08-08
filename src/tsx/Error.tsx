import { Link } from "react-router-dom";


export default function Error() {
  return (
    <div>
        <div className="flex bg-neutral-800">
            <h1 className='top-text'>404</h1>
            <Link to='/' className="button">Home</Link>
        </div>
    </div>
  )
}