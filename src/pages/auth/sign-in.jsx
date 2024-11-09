import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log("Login successful:", data);

      // Store token and email in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      setError("");

      // Navigate to the dashboard
      navigate("/dashboard/home");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Error during login:", error);
    }
  };

  return (
    <section
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/img/pattern.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Left Side - Welcome Message */}
        <div className="w-1/2 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 flex items-center justify-center p-12 text-blue-900">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">
              Ocean's Admin
            </Typography>
            <Typography className="text-lg">
              Login to access your admin account
            </Typography>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <Typography variant="h3" color="blue-gray" className="font-bold mb-1">
              Log in
            </Typography>
            <Typography color="blue-gray" className="text-md mt-1">
              Please sign in to your account
            </Typography>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email address"
              placeholder="you@example.com"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b border-gray-300"
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b border-gray-300"
            />
            <div className="flex justify-between items-center mb-4">
              <Checkbox label="Keep me logged in" />
              <Link to="/forgot-password" className="text-blue-600 text-sm">
                Forgot password?
              </Link>
            </div>
            {error && (
              <Typography color="red" className="text-center mb-4">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg py-3 rounded-lg"
            >
              Log In
            </Button>
          </form>
          {/* <Typography color="blue-gray" className="text-center mt-6 text-sm">
            Don’t have an account?{" "}
            <Link to="/auth/sign-up" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </Typography> */}
        </div>
      </div>
    </section>
  );
}

export default SignIn;
