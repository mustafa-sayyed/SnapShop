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
import React from "react";

function SendEmail() {
  return (
    <div>
      <div className="mb-4 text-2xl">Send Emails</div>
      <Label className="mb-2">Email Title:</Label>
      <Input placeholder="Enter email title here..." className="mb-4" />

      <Label className="mb-2">Email Content:</Label>
      <TextEditor />

      <div className="mt-4 mb-8 flex items-center justify-between flex-col sm:flex-row gap-2 ">
        <Select>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select Audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Audience or Users</SelectLabel>
              <SelectItem value="subscribed ">Subscribed</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              <SelectItem value="all">All Users</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>Send Email</Button>
      </div>
    </div>
  );
}

export default SendEmail;
