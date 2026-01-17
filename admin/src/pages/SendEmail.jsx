import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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

function SendEmail() {
  const [emailContent, setEmailContent] = useState("Write email content here...");
  const [emailSubject, setEmailSubject] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailSubject || !emailContent || !selectedAudience) {
      toast.info("Please provide subject, content, and audience for the email.");
      return;
    }

    try {
      setIsSending(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/emails/campaign`,
        {
          subject: emailSubject,
          content: emailContent,
          audience: selectedAudience,
        }
      );
      if (response.data.success) {
        toast.success("Email sent successfully!");
        setEmailSubject("");
        setEmailContent("");
        setSelectedAudience("");
      } else {
        toast.error(response.data.message || "Failed to send email.");
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((err) => {
          toast.error(err[0]);
        });
      } else {
        const message =
          error.response?.data?.message || "An error occurred while sending the email.";
        toast.error(message);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendEmail}>
      <div className="mb-4 text-2xl">Send Emails</div>
      <div className="mt-4 mb-8 w-full flex items-start justify-start flex-col sm:flex-row gap-2 ">
        <div className="w-full">
          <Label className="mb-2">Email Subject:</Label>
          <Input
            placeholder="Enter email Subject here..."
            className="mb-4 w-full"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            disabled={isSending}
            required
          />
        </div>
        <div className="">
          <Label className="mb-2">Select Audience:</Label>
          <Select
            defaultValue="subscribers"
            value={selectedAudience}
            onValueChange={setSelectedAudience}
            disabled={isSending}
            required
          >
            <SelectTrigger className="w-45" disabled={isSending}>
              <SelectValue placeholder="Select Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Audience or Users</SelectLabel>
                <SelectItem value="subscribers" default>
                  Subscribers
                </SelectItem>
                <SelectItem value="unsubscribers">Unsubscribers</SelectItem>
                <SelectItem value="all">All Users</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Label className="mb-2">Email Content:</Label>
      <TextEditor value={emailContent} onChange={setEmailContent} readOnly={isSending} />

      <div className="mt-4 mb-8 flex items-center justify-between flex-col sm:flex-row gap-2 ">
        <Button
          type="submit"
          className="cursor-pointer px-9 sm:px-20 py-4 text-base min-w-38 select-none"
          disabled={isSending}
        >
          {isSending ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Sending...
            </div>
          ) : (
            "Send Email"
          )}
        </Button>
      </div>
    </form>
  );
}

export default SendEmail;
