import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="container max-w-lg mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-lg text-muted-foreground">
          Sign in to manage your recipes and clients
        </p>
      </div>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        theme="light"
      />
    </div>
  );
};

export default AuthPage;