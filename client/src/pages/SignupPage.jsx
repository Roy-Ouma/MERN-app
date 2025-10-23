import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from "react";
import { BiImages} from "react-icons/bi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
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
import { uploadFile } from "../utils/index";



const SignupPage = () => {
  // guard against useStore() returning null/undefined during startup
  const store = useStore() || {};
  const user = store?.user ?? null;
  const signIn = store?.signIn ?? (() => {});
  const setIsLoading = store?.setIsLoading ?? (() => {});

  const [showForm, setShowForm] = useState(false);
  const [Data, setData] = useState({
   firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    profile: ""
  });
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // quick confirm-password check (non-submitting)
  const confirmPassword = (e) => {
    // prevent accidental form submit if used inside form
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!Data.password || !Data.confirmpassword) {
      toast.error("Please enter both password fields to confirm.");
      return;
    }
    if (Data.password === Data.confirmpassword) {
      toast.success("Passwords match.");
    } else {
      toast.error("Passwords do not match.");
    }
  };

    const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...Data,
      [name]: value
    });
  };

   const GoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const setLoading = typeof setIsLoading === "function" ? setIsLoading : null;
      try {
        setLoading && setLoading(true);
        const userResp = await getGoogleSignUp(tokenResponse?.access_token);

        if (userResp?.success === true) {
          // signIn is provided by the store; persist the authenticated user
          signIn(userResp);
          if (userResp.token) window.location.replace("/");
          toast.success("Account created successfully!");
        } else {
          toast.error(userResp?.message || "Google Sign-Up failed. Please try again.");
        }
      } catch (err) {
        toast.error("Google Sign-Up failed. Please try again.");
      } finally {
        setLoading && setLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-Up failed. Please try again.');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // prevent double submits
    if (handleSubmit.__running) return;
    handleSubmit.__running = true;

    const setLoading = typeof setIsLoading === "function" ? setIsLoading : null;

    // basic client validation
    if (Data.password !== Data.confirmpassword) {
      toast.error("Passwords do not match.");
      handleSubmit.__running = false;
      return;
    }

    try {
      setLoading && setLoading(true);

      // ensure image is uploaded and we have a remote URL (uploadFile may return the url)
      let imageUrl = fileURL;
      if (file) {
        try {
          const uploadResult = await uploadFile(setFileURL, file);
          // prefer explicit return from uploadFile if provided
          if (typeof uploadResult === "string" && uploadResult.length) imageUrl = uploadResult;
        } catch (err) {
          toast.error("Image upload failed. Please try again or continue without an image.");
          // continue without aborting submission
        }
      }

      const result = await emailSignUp({ ...Data, image: imageUrl });

      if (result?.success === true) {
        saveUserInfo(result, signIn);
      } else {
        toast.error(result?.message || "Sign up failed. Please try again.");
      }
    } catch (err) {
      toast.error("Sign up failed. Please try again.");
    } finally {
      setLoading && setLoading(false);
      handleSubmit.__running = false;
    }
  };
   
  // redirect only when user becomes available and has a token
  useEffect(() => {
    if (user && user.token) {
      window.location.replace("/");
    }
  }, [user]);

  // upload when `file` changes
  useEffect(() => {
    let objectUrl;
    const setLoading = typeof setIsLoading === "function" ? setIsLoading : null;
    if (file) {
      // show local preview quickly
      try {
        objectUrl = URL.createObjectURL(file);
        setFileURL(objectUrl);
      } catch {}

      (async () => {
        try {
          setLoading && setLoading(true);
          await uploadFile(setFileURL, file);
        } catch (err) {
          toast.error("Image upload failed.");
        } finally {
          setLoading && setLoading(false);
        }
      })();
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);
  

  return (
    <div className="flex w-full h-[100vh]">
      <div className="hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen bg-black items-center justify-center">
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
                    type="email"
                    label="Email"
                    name="email"
                    isRequired={true}
                    value={Data.email}
                    placeholder="Enter Your Email"
                    onChange={handleChange}
                  />
                  <div className="relative">
                    <Inputbox
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      name="password"
                      isRequired={true}
                      value={Data.password}
                      placeholder="Password"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-9 text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <Inputbox
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        name="confirmpassword"
                        isRequired={true}
                        value={Data.confirmpassword}
                        placeholder="Confirm Password"
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        className="absolute right-3 top-9 text-gray-600"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </button>
                    </div>
                    <div className="pt-6">
                      <Button
                        type="button"
                        onClick={confirmPassword}
                        label="Confirm"
                        styles="px-3 py-2 text-sm rounded-full bg-gray-200 text-black hover:bg-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between
                  py-4">
                    <div className="flex items-center gap-3">
                      <input
                        id="imgUpload"
                        type="file"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setFile(f);
                          // local preview until upload completes; navbar will use persisted user.profile after sign-in
                          try {
                            setFileURL(URL.createObjectURL(f));
                          } catch {}
                        }}
                        className="hidden"
                        data-max-size="1024"
                        accept="image/*"
                      />

                      <label
                        htmlFor="imgUpload"
                        className="flex items-center gap-2 text-base text-black dark:text-gray-500 cursor-pointer select-none"
                        onClick={(e) => {
                          // keep label behavior but ensure input receives click in all browsers
                          e.preventDefault();
                          document.getElementById("imgUpload")?.click();
                        }}
                      >
                        <BiImages />
                        <span>{file ? "Upload Picture" : "Upload picture"}</span>
                      </label>

                      {/* optional explicit Change button that also opens the file picker */}
                      {file && (
                        <button
                          type="button"
                          onClick={() => document.getElementById("imgUpload")?.click()}
                          className="px-3 py-1 text-sm rounded-full bg-gray-200 text-black hover:bg-gray-300"
                        >
                          Change
                        </button>
                      )}
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
              

                  </div>
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
