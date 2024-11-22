import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text}) => {
    try {
    const transporter = nodemailer.createTransport({
        //Gmail or yahoo or outlook
        service: "Gmail",
        auth: {
          user: process.env.PASS_MAIL,
          pass: process.env.PASS_KEY,
        },
      });
      const mailOptions = {
        from: process.env.PASS_MAIL,
        to,
        subject,
        text,
      };
      await transporter.sendMail(mailOptions);
      
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw new Error("Internal server error in sending the mail.");
      }
}
export default sendEmail;