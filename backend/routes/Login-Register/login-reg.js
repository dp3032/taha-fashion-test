var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 
const verifyToken = require('../../Middleware/AdminToken'); 


const RegModel  = require('../../model/user'); 

//Register User
router.post("/registeruserdata", async (req, res) => {
  const { username, userlastname , email, password } = req.body;

  try {

    // Check if email already exists
    const existingUser = await RegModel.findOne({ user_email: email });
    if (existingUser) {
      return res.status(400).json({ flag: 0, message: "Email already exists" });
    }

    // Generate a random salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Hash the password using PBKDF2 with the salt
    crypto.pbkdf2(password, salt, 10000, 64, "sha512", async (err, derivedKey) => {
      if (err) throw err;

      // Store the salt and the hashed password
      const hashedPassword = derivedKey.toString("hex");

      // Generate OTP and expiry
      const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
      const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now

      // Save user with OTP and expiry
      const newUser = new RegModel({
        user_name: username,
        user_lastname: userlastname,
        user_email: email,
        user_password: hashedPassword,
        user_salt: salt,
        otp,
        otpExpiry,
        isVerified: false,
      });

      await newUser.save();

      // Send OTP email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: process.env.USER, pass: process.env.PASS },
      });

      const mailOptions = {
        to: email,
        subject: "Your OTP Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">Verify Your Email Address</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.5; text-align: center;">
              Hello <strong>${username}</strong>,
            </p>
            <p style="font-size: 16px; color: #555; line-height: 1.5; text-align: center;">
              Thank you for registering! Please use the OTP code below to complete your email verification.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; color: #007bff; font-weight: bold; letter-spacing: 4px; display: inline-block; border: 2px dashed #007bff; padding: 10px 20px; border-radius: 5px; background-color: #e6f7ff;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 16px; color: #555; text-align: center;">
              This code is valid for <strong>5 minutes</strong>.
            </p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #999; text-align: center;">
              If you did not request this email, you can safely ignore it.
            </p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.json({ flag: 1, message: "OTP sent to your email", data: newUser });
      } catch (emailError) {
        // If email sending fails, remove the user entry
        await RegModel.findByIdAndDelete(newUser._id);
        console.error("Error sending OTP email:", emailError);
        return res.status(500).json({ flag: 0, message: "Failed to send OTP. Please try again." });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Resend OTP
router.post('/resendotp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await RegModel.findOne({ user_email: email });

    if (!user) {
      return res.status(400).json({ flag: 0, message: 'User not found' });
    }

    // Generate a new OTP and expiry time
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Update the user's OTP and expiry in the database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send the new OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.USER, pass: process.env.PASS },
    });

    const mailOptions = {
      to: email,
      subject: 'Your New OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #333;">Verify Your Email Address</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.5; text-align: center;">
            Hello <strong>${user.user_name}</strong>,
          </p>
          <p style="font-size: 16px; color: #555; line-height: 1.5; text-align: center;">
            We received a request to resend the OTP for email verification. Please use the OTP code below to complete your email verification. 
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; color: #007bff; font-weight: bold; letter-spacing: 4px; display: inline-block; border: 2px dashed #007bff; padding: 10px 20px; border-radius: 5px; background-color: #e6f7ff;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 16px; color: #555; text-align: center;">
            This code is valid for <strong>5 minutes</strong>.
          </p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 14px; color: #999; text-align: center;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ flag: 1, message: 'New OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Verify OTP
router.post('/verifyotp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await RegModel.findOne({ user_email: email });

    if (!user) {
      return res.status(400).json({ flag: 0, message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ flag: 0, message: 'Invalid OTP' });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ flag: 0, message: 'OTP expired' });
    }

    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    user.otpExpiry = null;
    await user.save();

    res.json({ flag: 1, message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

cron.schedule('* * * * *', async () => {
    try {
      const currentTime = Date.now();
  
      // Find users whose OTP has expired and are still not verified
      const usersToDelete = await RegModel.find({
        isVerified: false,
        otpExpiry: { $lt: currentTime }, // OTP expired
      });
  
      if (usersToDelete.length > 0) {
        // Delete those users
        await RegModel.deleteMany({
          isVerified: false,
          otpExpiry: { $lt: currentTime },
        });
  
      }
    } catch (err) {
      console.error('Error deleting unverified users:', err);
    }
  });
  
//Login User Data API
router.post('/loginuserdata', async (req, res) => {
const { loginemail, loginpassword } = req.body;

try {
    const ruserdata = await RegModel.findOne({ user_email: loginemail });

    if (!ruserdata) {
    return res.json({ flag: 0, msg: 'User not found' });
    }

    // Check if the user is verified
    if (!ruserdata.isVerified) {
    return res.json({ flag: 0, msg: 'Your email is not verified yet' });
    }

    // Extract salt from stored user data
    const salt = ruserdata.user_salt;

    // Hash the login password using the same salt
    crypto.pbkdf2(loginpassword, salt, 10000, 64, 'sha512', async (err, derivedKey) => {
    if (err) throw err;

    // Compare the hashed login password with the stored hashed password
    const isMatch = derivedKey.toString('hex') === ruserdata.user_password;

    if (!isMatch) {
        return res.json({ flag: 0, msg: 'Incorrect password' });
    }

    // Create JWT token for User or Admin
    const payload = {
        user_id: ruserdata._id,
        role: loginemail === process.env.ADMIN_EMAIL ? 'admin' : 'user',
    };

    // Create JWT token with 1 hour expiry
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the response with JWT token
    res.json({
        flag: 1,
        msg: 'Login successful',
        token: token,
        role: payload.role,
        user_id: ruserdata._id,
        name: ruserdata.user_name,
    });
    });
} catch (err) {
    console.error(err);
    res.status(500).send('Network Error');
}
});

router.get('/admin', verifyToken, (req, res) => {
  res.json({ msg: 'Welcome to the admin page!' });
});

// API route for updating the admin password
router.post('/updateadminpassword', async (req, res) => {
const { user_id, currentPassword, newPassword, confirmPassword } = req.body;

if (!user_id || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ msg: 'All fields are required' });
}

try {
    const admin = await RegModel.findById(user_id);

    if (!admin) {
    return res.status(404).json({ msg: 'Admin not found' });
    }

    // Compare hashed current password
    crypto.pbkdf2(currentPassword, admin.user_salt, 10000, 64, 'sha512', async (err, derivedKey) => {
    if (err) throw err;

    const isMatch = derivedKey.toString('hex') === admin.user_password;

    if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: 'Confirm passwords do not match' });
    }

    // Generate salt for new password
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the new password using PBKDF2 with the new salt
    crypto.pbkdf2(newPassword, salt, 10000, 64, 'sha512', async (err, derivedKey) => {
        if (err) throw err;

        // Update the password and salt
        admin.user_password = derivedKey.toString('hex');
        admin.user_salt = salt; // Store the new salt
        await admin.save();

        res.json({ msg: 'Password updated successfully' });
    });
    });
} catch (err) {
    console.error(err);
    res.status(500).send('Server error');
}
});

//Forgot Password Admin API
router.post('/forgotpassword-admin', async (req, res) => {
const { email } = req.body;

try {
    const user = await RegModel.findOne({ user_email: email });
    if (!user) {
        return res.status(404).json({ flag: 0, msg: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    user.resetToken = resetTokenHash;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.USER, 
            pass: process.env.PASS, 
        },
    });

    const resetURL = `${process.env.FROAPI}/resetpassword-admin/${resetToken}`;
    const message = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #555;">Password Reset Request</h2>
            <p>Hello Admin,</p>
            <p>You recently requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetURL}" 
                style="display: inline-block; padding: 10px 15px; color: #fff; background-color: #007bff; 
                        text-decoration: none; border-radius: 5px;">
                Reset Password
            </a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Thanks, <br> Taha Fashion</p>
        </div>
    `;

    await transporter.sendMail({
        to: email,
        subject: 'Password Reset Request',
        html: message,
    });

    res.json({ flag: 1, msg: 'Reset password link has been sent to your email address' });
} catch (error) {
    // console.log('Error:', error);
    res.status(500).send('Network Error');
}
});

//Reset Password Admin API
router.post('/resetpassword-admin/:token', async (req, res) => {
const { token } = req.params;
const { password, confirmPassword } = req.body;

if (password !== confirmPassword) {
    return res.status(400).json({ flag: 0, msg: 'Passwords do not match' });
}

try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await RegModel.findOne({
        resetToken: resetTokenHash,
        resetTokenExpiry: { $gt: Date.now() }, // Check if token has not expired
    });

    if (!user) {
        return res.status(400).json({ flag: 0, msg: 'Invalid or expired token' });
    }

    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the new password using PBKDF2 with the salt
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', async (err, derivedKey) => {
        if (err) throw err;

        // Update the user's password and salt in the database
        user.user_password = derivedKey.toString('hex'); // Store hashed password
        user.user_salt = salt; // Store the salt
        user.resetToken = undefined; // Remove the reset token
        user.resetTokenExpiry = undefined; // Remove the expiry time
        
        await user.save(); // Save the updated user

        res.json({ flag: 1, msg: 'Password successfully updated' });
    });
} catch (error) {
    console.error('Error:', error);
    res.status(500).send('Network Error');
}
});

//Forgot User Password API
router.post('/forgotpassword', async (req, res) => {
const { email } = req.body;

// Check if the email is the admin's email
if (email === process.env.ADMIN_EMAIL) {
    return res.status(400).json({ flag: 0, msg: 'Email cannot reset password.' });
}

try {
    const user = await RegModel.findOne({ user_email: email });
    if (!user) {
        return res.status(404).json({ flag: 0, msg: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    user.resetToken = resetTokenHash;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.USER, 
            pass: process.env.PASS, 
        },
    });

    const resetURL = `${process.env.FROAPI}/resetpassword/${resetToken}`;
    const message = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #555;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You recently requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetURL}" 
                style="display: inline-block; padding: 10px 15px; color: #fff; background-color: #007bff; 
                        text-decoration: none; border-radius: 5px;">
                Reset Password
            </a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Thanks, <br> Taha Fashion</p>
        </div>
    `;

    await transporter.sendMail({
        to: email,
        subject: 'Password Reset Request',
        html: message,
    });

    res.json({ flag: 1, msg: 'Reset password link has been sent to your email address' });
} catch (error) {
    // console.log('Error:', error);
    res.status(500).send('Network Error');
}
});

//Reset User Password API
router.post('/resetpassword/:token', async (req, res) => {
const { token } = req.params;
const { password, confirmPassword } = req.body;

if (password !== confirmPassword) {
    return res.status(400).json({ flag: 0, msg: 'Passwords do not match' });
}

try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await RegModel.findOne({
        resetToken: resetTokenHash,
        resetTokenExpiry: { $gt: Date.now() }, // Check if token has not expired
    });

    if (!user) {
        return res.status(400).json({ flag: 0, msg: 'Invalid or expired token' });
    }

    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the new password using PBKDF2 with the salt
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', async (err, derivedKey) => {
        if (err) throw err;

        // Update the user's password and salt in the database
        user.user_password = derivedKey.toString('hex'); // Store hashed password
        user.user_salt = salt; // Store the salt
        user.resetToken = undefined; // Remove the reset token
        user.resetTokenExpiry = undefined; // Remove the expiry time
        
        await user.save(); // Save the updated user

        res.json({ flag: 1, msg: 'Password successfully updated' });
    });
} catch (error) {
    console.error('Error:', error);
    res.status(500).send('Network Error');
}
});

//Display User Data
router.get('/userdisplay', apiKeyMiddleware , async (req, res) => {
try {
    const users = await RegModel.aggregate([
    {
        $match: {
        user_email: { $ne: process.env.ADMIN_EMAIL },  
        },
    },
    {
        $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "user_id",
        as: "orders",
        },
    },
    {
        $addFields: {
        orderCount: { $size: "$orders" },
        registrationDateISO: {
            $dateFromString: {
            dateString: "$registration_date",
            format: "%d/%m/%Y",
            },
        },
        },
    },
    {
        $sort: {
        registrationDateISO: -1, 
        },
    },
    {
        $project: {
        orders: 0,
        registrationDateISO: 0, 
        },
    },
    ]);

    res.status(200).json(users);
} catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user data");
}
});

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

// ✅ Initialize Passport
router.use(passport.initialize());
router.use(passport.session());

// ✅ Google Strategy Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await RegModel.findOne({ googleId: profile.id });

        if (!user) {
          user = new RegModel({
            googleId: profile.id,
            user_name: profile.name.givenName,
            user_lastname: profile.name.familyName,
            user_email: profile.emails[0].value,
            isVerified: true,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ✅ Serialize & Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await RegModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ✅ Google Authentication Route
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google Authentication Callback Route
router.get("/auth/google/callback",passport.authenticate("google", {
    failureRedirect: process.env.FAILREDIRECT,
  }),
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) throw new Error("User authentication failed");

      // ✅ Generate JWT Token
      const token = jwt.sign(
        { userId: user._id, name: user.user_name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // ✅ Redirect to frontend with token
      res.redirect(`${process.env.SUCCESSREDIRECT}?token=${token}`);
    } catch (error) {
      console.error("Google Login Error", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.post("/auth/google/success", async (req, res) => {
  try {
    const { tokenId } = req.body; // Get token from frontend
    const decoded = jwt.verify(tokenId, process.env.JWT_SECRET); // Verify JWT from Google

    let user = await RegModel.findOne({ googleId: decoded.sub });

    if (!user) {
      user = new RegModel({
        googleId: decoded.sub,
        user_name: decoded.name,
        user_email: decoded.email,
        isVerified: true,
      });
      await user.save();
    }

    // Generate new JWT for session management
    const token = jwt.sign(
      { userId: user._id, name: user.user_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user_id: user._id,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ success: false, message: "Google Authentication Failed" });
  }
});

module.exports = router;