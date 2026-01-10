import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Unsubscribe() {
  const [isUnsubscribing, setIsUnsubscribing] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const unsubscribe = async (unsubscribeToken) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/subscribers/unsubscribe/${unsubscribeToken}`
      );
      if (response.data.success) {
        setIsUnsubscribed(true);
        setStatusMessage("You have been unsubscribed successfully.");
      } else {
        setIsUnsubscribed(false);
        setStatusMessage(response.data?.message || "Unsubscription failed");
      }
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Unsubscription failed";
      setIsUnsubscribed(false);
      setStatusMessage(message);
    } finally {
      setIsUnsubscribing(false);
      setSearchParams((params) => params.delete("token"));
    }
  };

  useEffect(() => {
    const unsubscribeToken = searchParams.get("token");
    if (unsubscribeToken) {
      unsubscribe(unsubscribeToken);
    } else {
      setIsUnsubscribing(false);
      setIsUnsubscribed(false);
      setStatusMessage("Invalid unsubscribe token");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div>
        {isUnsubscribing ? (
          <div className="flex items-center justify-center gap-2 text-2xl">
            <Spinner className="size-6" />
            <p>Unsubscribing...</p>
          </div>
        ) : (
          <div className="text-center text-4xl">
            {isUnsubscribed ? (
              <p className=" text-green-500">You have been unsubscribed successfully.</p>
            ) : (
              <p className="text-red-500">{statusMessage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Unsubscribe;
