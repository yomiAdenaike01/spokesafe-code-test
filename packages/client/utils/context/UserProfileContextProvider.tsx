import { IUser } from "@spokesafe/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
interface UserContext {
  profile: IUser;
  getUser(): Promise<void>;
}
const apiGetUser = async () => {
  try {
    const apiRes = await fetch("http://localhost:4041/users/me");
    const json = await apiRes.json();
    return json;
  } catch (error) {
    throw new Error(error as any);
  }
};
const UserContext = createContext<UserContext>({
  getUser: apiGetUser,
  profile: {} as IUser,
});
export const useProfile = () => {
  return useContext(UserContext);
};
export const UserContextProvider: React.FC = ({ children }) => {
  const [profile, setProfile] = useState<IUser>({} as IUser);
  const _getUser = useCallback(() => apiGetUser().then((x) => setProfile(x)), [
    setProfile,
  ]);
  useEffect(() => {
    _getUser();
  }, []);
  const value = useMemo(() => {
    return {
      profile,
      getUser: _getUser,
    };
  }, [profile, _getUser]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
