export const emailTemplate = (name, resetUrl) => `
<div> 
  <h2 style="color:#333333; margin-bottom:10px;">Reset Your Password</h2> 
  <p style="color:#555555;">Hi ${name},</p>
  <p style="color:#555555;"> We received a request to reset your password. Click the button below to create a new one: </p>
  <div style="text-align:center; margin:30px 0;"> <a href="${resetUrl}" style="background-color:#4F46E5; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-weight:bold;"> Reset Password </a> </div>
  <p style="color:#555555;"> If the button above doesn’t work, you can copy and paste the link below into your browser: </p>
  <p style="word-break:break-all;"> <a href="${resetUrl}" style="color:#4F46E5;">${resetUrl}</a> </p>
  <p style="color:#777777; font-size:14px; margin-top:30px;"> If you didn’t request a password reset, you can safely ignore this email. Your account remains secure. </p> 
   <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0;" /> <p style="color:#999999; font-size:12px;"> This link will expire shortly for security reasons. </p>
</div>
`;

export const tokenVerificationTemplate = (name, verificationUrl, verificationToken) => `
<div>
     <h2 style="color:#333333; margin-bottom:10px;">Verify Your Email</h2>
     <p style="color:#555555;">Hi ${name},</p> <p style="color:#555555;"> Thanks for signing up! Please use the verification code below to confirm your email address: </p>
     <div style="font-size:32px; font-weight:bold; letter-spacing:10px; margin:25px 0; color:#4F46E5;"> ${verificationToken} </div>
     <p style="color:#777777; font-size:14px;"> This code will expire in 1 hour. </p> 
     <p style="color:#555555; margin-top:25px;"> Or, you can verify your email instantly by clicking the button below: </p> 
     <div style="margin:25px 0;"> <a href="${verificationUrl}" style="background-color:#4F46E5; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-weight:bold;"> Verify Email </a> </div> 
     <p style="color:#999999; font-size:12px;"> If you didn’t create an account, you can safely ignore this email. </p>
</div>
`