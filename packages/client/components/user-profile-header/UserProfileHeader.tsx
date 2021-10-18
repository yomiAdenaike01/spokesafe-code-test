import React from "react";
import { useProfile } from "../../utils/context/UserProfileContextProvider";

interface Props {}

export const UserProfileHeader = (props: Props) => {
  const { profile } = useProfile();
  return <div></div>;
};
