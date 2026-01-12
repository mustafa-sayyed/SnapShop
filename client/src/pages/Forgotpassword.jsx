import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingForm(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/forgot-password`,
        {
          email,
        }
      );

      if (response.data.success) {
        toast.success("Reset password link sent to your email");
        setIsEmailSent(true);
      }
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="h-[85vh] w-full flex justify-center items-center">
      <div className="border shadow rounded-lg px-6 sm:px-10 py-4 sm:py-6 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl text-center">Forgot Password</h1>
          <p className="mt-4 text-sm font-light">
            Please enter your email address, we will send you a password reset link to
            reset your password.
          </p>
        </div>

        {isEmailSent ? (
          <div className="mt-6 text-green-600 flex text-xl text-center gap-2">
            If an account with that email exists, a reset link has been sent.
          </div>
        ) : (
          <form className="flex flex-col mt-6 gap-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="mt-4 w-full cursor-pointer"
              type="submit"
              disabled={isSubmittingForm}
            >
              {isSubmittingForm ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span className="ml-2">Sending...</span>
                </div>
              ) : (
                "Send Reset Password Link"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Forgotpassword;
