
import LoginForm from "@/components/auth/login-form/LoginForm";
import { Montserrat } from "next/font/google";
const fontLogo = Montserrat({
  subsets: ["latin"],
  weight: ["900"],
});

export default function LoginPage() {
  return (

    <div>
    
        <LoginForm />
        
    
    </div>
  );
}