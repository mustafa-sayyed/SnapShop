import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="text-center">
        <h1 className="text-9xl">404</h1>
        <p className="text-4xl text-center">Not Found</p>
        <p className="text-xl">The requested page not found</p>
        <div className="mt-4 flex gap-4 justify-center items-center">
          <Button className="cursor-pointer" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button className="cursor-pointer" onClick={() => navigate("/dashboard/home")}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
