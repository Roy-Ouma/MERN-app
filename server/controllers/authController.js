import axios from 'axios';
import Users from "../models/UserModel.js";
import { hashString, compareString } from "../utils/index.js";
import { createJWT } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
   try {
    const {
        firstName,
         email,
          password,
           lastName,
           
           image,
            accountType,
             provider
    } = req.body;

    if(!firstName || !email || !password || !lastName){
        return next('please provide required fields');
    }

    if(accountType === "Writer" && !image)
        return next('please provide profile image');

      const userExists = await Users.findOne({email});
        if(userExists) {
            return next('Email already exists');
        }


        const hashPassword = await hashString(password);

        const user = await Users.create({
            name: firstName + " " + lastName,
             email,
              password: provider? hashPassword : "",
              image,
                accountType,
                    provider,

        })
        user.password = undefined;

        const token = createJWT(user._id);

        //send email if account is writer

        if(accountType === "writer"){
            //send email
            sendVerificationEmail(user, req, res,token);  
        } else {
            return res.status(201).json({
                success: true,
                    message: 'User registered successfully',
                        user,
                            token, 
            });     
        }
    // TODO: implement registration logic (hash password, save user, etc.)
    return res.status(201).json({ message: 'User registered successfully' });

   } catch (error) {
    console.log(error)
      res.status(404).json({message: error.message});
   }
}     



export const googleSignup = async (req, res) => {
   try {

    const {name, email, image, emailVerified} = req.body;
    
    const userExists = await Users.findOne({email});
       
    if(userExists) {
            next
            return ;
             
            } 
            
        
    const user = await Users.create({
            name,
             email,
                image,
                    provider: 'Google',
                        emailVerified,
        })
        user.password = undefined;

        const token = createJWT(user?._id);

        return res.status(201).json({
                success: true,
                    message: 'Account registered successfully',
                        user,
                            token, 
            });

} catch (error) {
    console.log(error)
      res.status(404).json({message: error.message});
   }
}


export const login = async (req, res) => {
   try {

    const {email, password} = req.body;

    if(!email ){
        return next('please provide User Credentials');
    }
    const user = await Users.findOne({email}).select('+password');

    if(!user){
        return next('User not found, please signup');
    }

    //Google user login
    if(user.provider === "Google" && !password){
        const token = createJWT(user._id);
         user.password = undefined;
        return res.status(201).json({
            success: true,
                message: 'User logged in successfully',
                    user,
                        token, 
        });     
    }

    //compare password
    const isMatch = await compareString(password, user.password);
    if(!isMatch){
        return next('Invalid credentials, please try again');
    }

    if(user?.accountType === "Writer" && !user?.emailVerified){
        return next('Please verify your email to login');
    }

    user.password = undefined;

    const token = createJWT(user._id);
    return res.status(201).json({
            success: true,
                message: 'User logged in successfully',
                    user,
                        token, 
        });

   } catch (error) {
    console.log(error)
      res.status(404).json({message: error.message});
   }
}

/**
 * POST /api/auth/google-signup
 * Body: { name, email, image, emailVerified }
 */
export const googleSignUp = async (req, res, next) => {
  try {
    const { name, email, image, emailVerified } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    let user = await Users.findOne({ email });
    if (!user) {
      user = await Users.create({
        name,
        email,
        image,
        emailVerified: !!emailVerified,
        password: "", // third-party auth users may not have password
        accountType: "User",
      });
    }

    const token = createJWT(user._id);
    user.password = undefined;
    return res.status(200).json({ success: true, user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/google
 * Body: { access_token }
 * Server verifies with Google and logs user in (or creates)
 */
export const googleSignIn = async (req, res, next) => {
  try {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ success: false, message: "access_token required" });

    // verify with Google
    const { data: googleUser } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const email = googleUser?.email;
    if (!email) return res.status(400).json({ success: false, message: "Unable to verify Google user" });

    let user = await Users.findOne({ email });
    if (!user) {
      user = await Users.create({
        name: googleUser.name,
        email,
        image: googleUser.picture,
        emailVerified: !!googleUser.email_verified,
        password: "",
        accountType: "User",
      });
    }

    const token = createJWT(user._id);
    user.password = undefined;
    return res.status(200).json({ success: true, user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/signup
 * Accepts JSON body: { firstname, lastname, email, password, confirmpassword }
 * (If client sent FormData, client now converts it to JSON.)
 */
export const signup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existing = await Users.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

    const hashed = await hashString(password);
    const user = await Users.create({
      name: `${firstname} ${lastname}`,
      email,
      password: hashed,
      accountType: "User",
    });

    const token = createJWT(user._id);
    user.password = undefined;
    return res.status(201).json({ success: true, user, token });
  } catch (error) {
    next(error);
  }
};

export default { googleSignUp, googleSignIn, signup };

