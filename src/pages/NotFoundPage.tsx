import { Link } from "react-router-dom";


export default function NotFoundPage(){
    return(<div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-900 px-6">
      {/* Friendly, not frustrating visual */}
      <div className="mb-10 text-9xl font-extrabold text-primary-light relative">
        404
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-primary">
          Oops!
        </div>
      </div>

      <h1 className="mb-6 text-3xl md:text-5xl font-bold text-center">
        Looks like you're lost.
    </h1>
      <p className="mb-12 text-lg text-gray-600 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved. But don't worry, we can help you find your way back.
      </p>


        <Link 
        to="/" 
        className="button-positive max-w-100"
      >
        Go Back to Board
      </Link>
    </div>)
}