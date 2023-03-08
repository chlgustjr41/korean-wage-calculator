import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../database/authentication/firebaseAuthentifcation";
import { useAuthState } from "react-firebase-hooks/auth";

export interface IAlreadyLoggedInRouteProps {
  children: any;
}

const AlreadyLoggedInRoute: React.FunctionComponent<
  IAlreadyLoggedInRouteProps
> = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const [exitLoading, setExitLoading] = useState(true);

  useEffect(() => {
    setExitLoading(true);
    if (loading) return;
    else if (user) {
      navigate("/calculator");
    } else {
      setExitLoading(false);
    }
  }, [user, loading]);

  return <>{!exitLoading && !loading && children}</>;
};

export default AlreadyLoggedInRoute;
