import "./styles.css";
import { auth, googleProvider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();
  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, googleProvider);
    const authInfo = {
      userId: results.user?.uid || "",
      name: results.user?.displayName || "",
      profilePhoto: results.user?.photoURL || "",
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("expense-tracker");
  };

  if (isAuth) return <Navigate to="/expense-tracker" />;

  return (
    <div className="login-page">
      <p>Sign In with Google to Continue</p>
      <button
        className="login-with-google-btn"
        onClick={() => signInWithGoogle()}
      >
        Sign In with Google
      </button>
    </div>
  );
};
