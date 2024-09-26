import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Otpverifaction.css"

const OtpVerification = () => {
  const [otp, SetOtp] = useState("");
  let navi = useNavigate();

  const Otpverify = async () => {
    const token = localStorage.getItem("token");
    const Response = await fetch(
      "http://localhost:4000/api/instavista/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ otp }),
      }
    );
    const Res = await Response.json();
    console.log(Res);
    if (Res.success) {
      navi("/home");
    }
  };

  const ResendOtp = async () => {
    const token = localStorage.getItem("token");
    const Response = await fetch(
      "http://localhost:4000/api/instavista/resend-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
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
      <div className="Otp-otp-div">
        <div className="Otp-fgv-common">
          <div className="Otp-fgv-heading">
            <h1>
              <b>InstaVista</b>
            </h1>
          </div>
          <div>
          <h3>OTP Verification</h3>
          </div>
          <div className="">
            <p className="Otp-fg-p">Enter the 6-digit OTP sent to your email/phone</p>
            <input
              className="Otp-fgv-inp"
              type="text"
              name="otp"
              id="otp"
              onChange={(e) => {
                SetOtp(e.target.value);
              }}
            />
          </div>
          <div className="">
            <button className="Otp-fg-button" onClick={Otpverify}>
              Verify OTP
            </button>
            <button className="Otp-fg-button" onClick={ResendOtp}>
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
