import { useState } from "react"
import logo from "../../../public/iManageLogo.png"
import coverPhoto from "../../assets/iManageCover.png"
import Login from "../../components/UserComponents/LandingPageComponent/Login"
import Signup from "../../components/UserComponents/LandingPageComponent/Signup"


export default function LandingPage() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <>
        
          <div className="flex ">
              <div className="flex flex-col w-full h-screen  px-10  py-5 flex-1">
                <div className="flex flex-col h-full w-full justify-center gap-10">
                    <div className="flex flex-col gap-2 w-full justify-center items-center ">
                        <img src={logo} alt="I Manage Logo" className="w-15" />
                        <p className="font-semibold text-2xl italic">iManage</p>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <div className="flex flex-col justify-center items-center ">
                            <p className="font-semibold text-lg">{isLogin ? "Welcome Back" : "Welcome"}</p>
                            <p className="text-xs text-darkgray">Please enter your details</p>
                        </div>
                        <div className="flex w-full h-12 p-1 rounded-lg bg-lightgray text-sm font-semibold max-w-100">
                            <button
                                className={`flex-1 rounded-lg transition-all duration-300 ease-in-out ${isLogin ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                            </button>
                            <button
                                className={`flex-1 rounded-lg transition-all duration-300 ease-in-out ${!isLogin ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </div>
                        <div className="w-full">
                            {isLogin ? (<Login />) : (<Signup />)}
                        </div>
                    </div>
                </div>
                <div className="flex text-darkgray justify-center items-center text-xs italic">
                    <p>Collaborate effortlessly. Deliver flawlessly.</p>
                </div>

            </div>
              <div className="hidden lg:flex w-full h-screen  flex-1">
               <img src={coverPhoto} className="w-full h-full"/>
            </div>

          </div>
        </>
    )
}