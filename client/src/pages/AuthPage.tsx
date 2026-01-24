import { useState } from "react";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { z } from "zod";
import { Loader2, Leaf, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Login schema - subset of fields
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-green-600 shadow-lg shadow-primary/20 mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2 tracking-tight">
            Greenspace
          </h1>
          <p className="text-muted-foreground text-lg">
            Turn your eco-actions into impact.
          </p>
        </div>

        <motion.div
          layout
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden p-6 sm:p-8"
        >
          <div className="flex gap-2 p-1 bg-muted/50 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                isLogin
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                !isLogin
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">
                    Username
                  </label>
                  <input
                    {...loginForm.register("username")}
                    className="w-full px-4 py-3 rounded-xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all duration-200"
                    placeholder="Enter your username"
                  />
                  {loginForm.formState.errors.username && (
                    <p className="text-xs text-destructive ml-1">
                      {loginForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...loginForm.register("password")}
                    className="w-full px-4 py-3 rounded-xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-destructive ml-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full mt-4 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">
                    Full Name
                  </label>
                  <input
                    {...registerForm.register("name")}
                    className="w-full px-4 py-3 rounded-xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all duration-200"
                    placeholder="John Doe"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-destructive ml-1">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1">
                      Username
                    </label>
                    <input
                      {...registerForm.register("username")}
                      className="w-full px-4 py-3 rounded-xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all duration-200"
                      placeholder="johndoe"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-xs text-destructive ml-1">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1">
                      Phone
                    </label>
                    <input
                      {...registerForm.register("phoneNumber")}
                      className="w-full px-4 py-3 rounded-xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all duration-200"
                      placeholder="123-456-7890"
                    />
                    {registerForm.formState.errors.phoneNumber && (
                      <p className="text-xs text-destructive ml-1">
                        {registerForm.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...registerForm.register("password")}
                    className="w-full px-4 py-3 rounded-xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-xs text-destructive ml-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full mt-4 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
