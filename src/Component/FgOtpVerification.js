import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CssFile/FgOtpVerification.css"

const FgOtpVerification = () => {
  const [otp, SetOtp] = useState("");
  let navi = useNavigate();

  const Otpverify = async () => {
    const Email = localStorage.getItem("Email");
    const Response = await fetch(
      "http://localhost:4000/api/instavista/fpverify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, otp }),
      }
    );
    const Res = await Response.json();
    console.log(Res);
    if (Res.success) {
      navi("/createpassword");
    }
  };

  const ResendOtp = async () => {
    const Email = localStorage.getItem("Email");
    const Response = await fetch(
      "http://localhost:4000/api/instavista/fpresend-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email }),
      }
    );
    const Res = await Response.json();
    console.log(Res);
  };
  useEffect(() => {
    // Otpsend()
  }, []);

  return (
    <>
      <div className="fg-otp-div">
        <div className="fgv-common">
          <div className="fgv-heading">
            <h1>
              <b>InstaVista</b>
            </h1>
          </div>
          <div>
          <h3>OTP Verification</h3>
          </div>
          <div className="">
            <p className="fg-p">Enter the 6-digit OTP sent to your email/phone</p>
            <input
              className="fgv-inp"
              type="text"
              name="otp"
              id="otp"
              onChange={(e) => {
                SetOtp(e.target.value);
              }}
            />
          </div>
          <div className="">
            <button className="fg-button" onClick={Otpverify}>
              Verify OTP
            </button>
            <button className="fg-button" onClick={ResendOtp}>
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FgOtpVerification;
