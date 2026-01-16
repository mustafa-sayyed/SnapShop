import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const handleSendEmail = async (title, content, audience) => {
  console.log(title, content, audience);
  if (!title || !content) {
    toast.info("Please provide both title and content for the email.");
    return;
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/emails/campaign`, {
      title,
      content,
      audience
    });
    if (response.data.success) {
      toast.success("Email sent successfully!");
    } else {
      toast.error(response.data.message || "Failed to send email.");
    }
  } catch (error) {
    console.log(error);
    const message = error.response?.data?.message || "An error occurred while sending the email.";
    toast.error(message);    
  }
};

function SendEmail() {
  const [emailContent, setEmailContent] = useState("Write email content here...");
  const [emailTitle, setEmailTitle] = useState("Enter email title here...");
  const [selectedAudience, setSelectedAudience] = useState("");

  return (
    <div>
      <div className="mb-4 text-2xl">Send Emails</div>
      <div className="mt-4 mb-8 w-full flex items-start justify-start flex-col sm:flex-row gap-2 ">
        <div className="w-full">
          <Label className="mb-2">Email Title:</Label>
          <Input
            placeholder="Enter email title here..."
            className="mb-4 w-full"
            value={emailTitle}
            onChange={(e) => setEmailTitle(e.target.value)}
          />
        </div>
        <div className="">
          <Label className="mb-2">Select Audience:</Label>
          <Select defaultValue="subscribed" value={selectedAudience} onValueChange={setSelectedAudience}>
            <SelectTrigger className="w-45"  >
              <SelectValue placeholder="Select Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Audience or Users</SelectLabel>
                <SelectItem value="subscribed" default>Subscribed</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                <SelectItem value="all">All Users</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Label className="mb-2">Email Content:</Label>
      <TextEditor value={emailContent} onChange={setEmailContent} />

      <div className="mt-4 mb-8 flex items-center justify-between flex-col sm:flex-row gap-2 ">
        <Button
          onClick={() => handleSendEmail(emailTitle, emailContent, selectedAudience)}
          className="cursor-pointer px-9"
        >
          Send Email
        </Button>
      </div>
    </div>
  );
}

export default SendEmail;
