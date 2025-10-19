import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from "react";
import { BiImages} from "react-icons/bi";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import { FcGoogle} from "react-icons/fc";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Logo from "../components/Logo";
import Button from "../components/Button";
import Divider from "../components/Divider";
import Inputbox from "../components/Inputbox";
import { getGoogleSignUp, emailSignUp } from "../utils/apiCalls";
import useStore from "../store";
import { saveUserInfo } from "../utils/index";


const SignupPage = () => {
  const {user, signIn, setIsLoading} = useStore();
  const [showForm, setShowForm] = useState(false);
  const [Data, setData] = useState({
   firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    profile: ""
  });
  const [file, setFile] = useState('');
  const [fileURL, setFileURL] = useState('');

    const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...Data,
      [name]: value
    });
  };

   const GoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const userResp = await getGoogleSignUp(tokenResponse.access_token);

        setIsLoading(false);

        if (userResp?.success === true) {
          // signIn is provided by the store; persist the authenticated user
          signIn(userResp);
          if (userResp.token) window.location.replace("/");
          toast.success("Account created successfully!");
        } else {
          toast.error(userResp?.message || 'Google Sign-Up failed. Please try again.');
        }
      } catch (err) {
        setIsLoading(false);
        toast.error('Google Sign-Up failed. Please try again.');
      }
    },
    onError: () => {
      toast.error('Google Sign-Up failed. Please try again.');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await emailSignUp(Data, file);
      setIsLoading(false);

      if (result?.success) {
        signIn(result);
        if (result.token) window.location.replace("/");
        toast.success("Account created successfully!");
      } else {
        toast.error(result?.message || 'Sign up failed. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      toast.error('Sign up failed. Please try again.');
    }
  };

  

  return (
    <div className="flex w-full h-[100vh]">
      <div className="hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen bg-black items-center justify-center">
        {fileURL && (
          <img
            src={fileURL}
            alt=""
            className="w-16 h-16 rounded-full"
          />
        )}
        <Logo type="Sign-in" />
        <span className="text-xl font-semibold text-white text-center">
          Welcome!
        </span>
      </div>

      <div className="flex flex-col gap-y-4 w-full md:w-2/3 min-h-screen bg-white dark:bg-gradient-to-br md:dark:bg-gradient-to-r from-black via-[#020b19] to-black items-center justify-center px-10 md:px-20 lg:px-40">
        <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4 sm:px-0 lg:px-8">
          <div className="block mb-10 md:hidden -ml-8">
            <Logo />
          </div>
          <div className="w-full space-y-6 flex flex-col justify-start">
            <div className="max-w-md w-full flex gap-3 md:gap-4 items-center justify-center mb-12">  

              {showForm && (
                <IoArrowBackCircleSharp 
                  className="text-2xl lg:text-3xl cursor-pointer text-gray-800 dark:text-gray-400"
                  onClick={() => setShowForm(false)}
                />
              )}
              <h2 className=" text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white ">
                
                Sign Up for an account
              </h2>
            </div>

            {showForm ? (
               <form className="max-w-md w-full mt-8 space-y-6"
                 onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4 mb-8">

                  <Inputbox
                    type="text"
                    label="First Name"
                    name="firstname"
                    value={Data.firstname}
                    placeholder="Enter First Name"
                    onChange={handleChange}
                    isRequired={true}
                  />
                  <Inputbox
                    type="text"
                    label="Last Name"
                    name="lastname"
                    value={Data.lastname}
                    placeholder="Enter Last Name"
                    onChange={handleChange}
                    isRequired={true}
                  />
                  <Inputbox
                    type="password"
                    label="Password"
                    name="password"
                    isRequired={true}
                    value={Data.password}
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <Inputbox
                    type="email"
                    label="Email"
                    name="email"
                    isRequired={true}
                    value={Data.email}
                    placeholder="Enter Your Email"
                    onChange={handleChange}
                  />
                  <div className="flex items-center justify-between
                  py-4">
                    <label htmlFor="imgUpload" className="flex items-centre gap-1 text-base text-black
                   dark:text-gray-500 cursor-pointer">
                    <input
                      id="imgUpload"
                      type="file"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setFileURL(URL.createObjectURL(e.target.files[0]));
                      }}
                      className="hidden"
                      data-max-size= "1024"
                      accept="image/*"
                    />
                    <BiImages />
                    <span>Picture</span>
                   </label>

                  </div>
                  </div>
                   <div className=" flex items-centre justify-centre text-gray-600 dark:text-gray-300">
                                <p>
                                  Already have an account?{" "}
                                  <Link to="/sign-in" className="text-orange-500
                                    font-medium">
                                    Sign in
                                  </Link>
                                </p>
                              </div>

                               <Button

                label="Create Account"
                type={"submit"}
                styles={"group relative w-full flex justify-centre py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none"}
              />
              

               </form> ): (
                <div className="max-w-md w-full space-y-8">
               <Button 
               onClick={() => GoogleLogin() }
              label="Sign up with Google"
              icon={<FcGoogle className="text-xl" />}
              styles={"w-full flex flex-row-reverse gap-4  bg-black dark:bg-transparent dark:border  text-white dark:text-white px-5 py-2.5 rounded-full"}
            />
            <Divider label="or sign up with email"/>

            <Button 
              onClick={() => setShowForm(true) }
              label="Continue with Email"
              styles={"w-full gap-4 bg-white text-black dark:bg-rose-800 dark:text-white px-5 py-2.5   rounded-full border dark:border-none border-gray-300"}
              />
              </div>
           ) }
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default SignupPage;
