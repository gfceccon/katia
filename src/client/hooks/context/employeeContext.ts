import { useCallback, useMemo, useState } from "react";

const a = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response: any) => {
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return [login, contextValue];
}