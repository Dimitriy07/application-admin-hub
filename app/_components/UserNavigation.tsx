"use client";
import { signOutUser } from "../_services/actions";
import Menus from "./Menus";
import { HiOutlineArrowLeftStartOnRectangle } from "react-icons/hi2";

function UserNavigation({ userName }: { userName: string }) {
  return (
    <Menus>
      <Menus.Toggle id="user-info">
        <button className="border border-ocean-0 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer font-s text-2xl hover:font-bold hover:border-2">
          {userName.split(" ").reduce((acc, cur) => {
            return (acc = acc + cur.slice(0, 1).toUpperCase());
          }, "")}
        </button>
      </Menus.Toggle>
      <Menus.List id="user-info">
        <Menus.Button
          icon={<HiOutlineArrowLeftStartOnRectangle />}
          onClick={signOutUser}
        >
          SignOut
        </Menus.Button>
      </Menus.List>
    </Menus>
  );
}

export default UserNavigation;
