"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { DropdownMenu } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import UserAvatar from "./UserAvatar";
import { User } from "lucia";

interface UserButtonProps {
  className?: string;
}
/*
This is a client component so we can't call the validate session here, we have to retrive it from react context via SessionProvider useSession()
*/
export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession() as { user: User };
  console.log(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="">
          {/* <UserAvatar avatarUrl={user.avatarUrl} size={40} /> */}
          <UserAvatar avatarUrl={null} size={40} />
        </button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
