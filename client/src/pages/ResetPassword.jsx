import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isPasswordResetSuccessful, setIsPasswordResetSuccessful] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const params = useParams();

  async function validateResetToken() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/validate-reset-token`,
        {
          resetToken: params.resetToken,
        }
      );
      if (response.data.success) {
        setIsTokenValid(true);
      }
    } catch (error) {
      setIsTokenValid(false);
      console.log(error);
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsValidatingToken(false);
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsResettingPassword(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/reset-password`,
        {
          resetToken: params.resetToken,
          newPassword,
        }
      );
      if (response.data.success) {
        toast.success("Password has been reset successfully");
        setIsPasswordResetSuccessful(true);
      }
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  useEffect(() => {
    if (params.resetToken) {
      validateResetToken();
    } else {
      setIsValidatingToken(false);
      setIsTokenValid(false);
    }
  }, []);

  return (
    <div className="h-[85vh] w-full flex justify-center items-center">
      <div className="border rounded-lg shadow px-6 sm:px-10 py-4 sm:py-6  max-w-md w-full">
        <h1 className="sm:text-4xl text-3xl text-center">Reset Password</h1>
        <p className="font-light mt-4">
          Enter your new password and click the button below to reset it.{" "}
        </p>
        {isValidatingToken ? (
          <div className="flex items-center justify-center gap-2 mt-4 mx-auto ">
            <Spinner />
            <p>Validating reset token...</p>
          </div>
        ) : isTokenValid ? (
          isPasswordResetSuccessful ? (
            <div>
              <p className="mt-6 text-green-600 text-xl text-center">
                Your password has been reset successfully. You can now log in with your
                new password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <div className="mt-4 flex flex-col gap-2">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  className="mt-4 w-full cursor-pointer"
                  type="submit"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
                    <div className="flex items-center gap-2">
                      <Spinner />
                      <span className="ml-2">Resetting Password...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          )
        ) : (
          <p className="mt-6 text-red-600 text-xl text-center">
            Invalid or expired reset token.
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
