import React, { useState } from "react";

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading animation

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading animation

    const endpoint = isLogin ? "login/" : "register/";
    const payload = isLogin ? { username, password } : { username, password, email };

    // Artificial short delay to make the transition look smooth and natural
    setTimeout(() => {
      fetch(`http://127.0.0.1:8000/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => { throw new Error(err.error || "Authentication failed"); });
          }
          return res.json();
        })
        .then((data) => {
          const token = data.access;
          const user = data.username || username;
          
          localStorage.setItem("token", token);
          localStorage.setItem("username", user);
          
          onAuthSuccess(user);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false); // Stop loading if error occurs
        });
    }, 800); // 800ms elegant delay for visual effect
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        
        {/* Top subtle ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-teal-500/50 blur-sm"></div>

        <h2 className="text-3xl font-bold text-center text-teal-400 mb-6 tracking-tight">
          {isLogin ? "Sign In to Platform" : "Create Student Account"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">Username</label>
            <input
              type="text"
              required
              disabled={loading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:border-teal-500 disabled:opacity-50 transition"
              placeholder="Enter your username"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:border-teal-500 disabled:opacity-50 transition"
                placeholder="student@example.com"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:border-teal-500 disabled:opacity-50 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-gray-950 font-semibold rounded-xl transition duration-200 cursor-pointer text-sm mt-2 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLogin ? "Login" : "Register"}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "New to the platform?" : "Already have an account?"}{" "}
          <button
            disabled={loading}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-teal-400 hover:underline cursor-pointer font-medium disabled:opacity-50"
          >
            {isLogin ? "Create an account" : "Sign In here"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;