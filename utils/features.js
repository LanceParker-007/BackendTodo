import jwt from "jsonwebtoken";

export const sendCookie = (userRef, res, message, statusCode = 200) => {
  const token = jwt.sign(
    {
      _id: userRef.id,
    },
    process.env.JWT_SECRET
  );

  return res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15, //Added 5:30 hrs to get time in IST
      sameSite: process.env.NODE_ENV === "Development" ? "Lax" : "None",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message,
    });
};
