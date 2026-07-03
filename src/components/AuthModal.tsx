import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { X, Mail, Phone, User, Lock, Eye, EyeOff, ShieldCheck, Zap, Activity } from "lucide-react";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
  } = useAuth();

  const { language, t } = useLanguage();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg("");
    setSuccessMsg("");
    setEmailOrPhone("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleTabSwitch = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!emailOrPhone.trim() || !password) {
      setErrorMsg(language === "cn" ? "请填入所有必填项。" : "Please fill in all fields.");
      return;
    }

    if (authModalTab === "register") {
      if (!username.trim()) {
        setErrorMsg(language === "cn" ? "请输入用户昵称。" : "Please fill in username.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg(language === "cn" ? "密码长度必须大于 6 位。" : "Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(language === "cn" ? "两次输入的密码不一致。" : "Passwords do not match.");
        return;
      }

      setLoading(true);
      const res = await register(emailOrPhone, username, password);
      setLoading(false);

      if (res.success) {
        setSuccessMsg(t.authSuccessRegister);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        if (res.error === "user_exists") {
          setErrorMsg(language === "cn" ? "该邮箱或手机号已被注册。" : "This email or phone number is already registered.");
        } else {
          setErrorMsg(language === "cn" ? "注册失败，请稍后重试。" : "Registration failed. Please try again.");
        }
      }
    } else {
      setLoading(true);
      const res = await login(emailOrPhone, password);
      setLoading(false);

      if (res.success) {
        setSuccessMsg(t.authSuccessLogin);
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        if (res.error === "invalid_credentials") {
          setErrorMsg(language === "cn" ? "账号或密码错误，请重试。" : "Invalid account or password.");
        } else {
          setErrorMsg(language === "cn" ? "登录失败，请稍后重试。" : "Login failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div 
        id="auth-modal-card" 
        className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col transition-all"
      >
        {/* Top brand-accent strip */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-orange-600 to-zinc-900" />

        {/* Close button */}
        <button
          id="btn-close-auth-modal"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pt-8 pb-6">
          {/* Header & App Branding */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-950 text-white mb-3">
              <Zap className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="font-sans text-xl font-extrabold text-zinc-900 tracking-tight">
              {authModalTab === "login" ? t.authLogin : t.authRegister}
            </h3>
            <p className="mt-1.5 font-sans text-xs text-zinc-500">
              {language === "cn" 
                ? "自智 AI 容器云会员与算力分发体系" 
                : "AI Solopreneur Compute & Container Account"}
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex rounded-lg bg-zinc-100 p-1 mb-6 border border-zinc-200">
            <button
              id="auth-tab-login"
              onClick={() => handleTabSwitch("login")}
              className={`flex-1 py-2 text-center font-sans text-xs font-semibold rounded-md transition-all cursor-pointer ${
                authModalTab === "login"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {language === "cn" ? "安全登录" : "Sign In"}
            </button>
            <button
              id="auth-tab-register"
              onClick={() => handleTabSwitch("register")}
              className={`flex-1 py-2 text-center font-sans text-xs font-semibold rounded-md transition-all cursor-pointer ${
                authModalTab === "register"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {language === "cn" ? "新户注册" : "Register"}
            </button>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-sans flex items-start gap-2">
              <span className="font-bold flex-shrink-0">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-sans flex items-start gap-2">
              <span className="font-bold flex-shrink-0">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Phone Field */}
            <div>
              <label className="block font-sans text-xs font-semibold text-zinc-700 mb-1.5">
                {t.authEmail} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  {emailOrPhone.trim().length > 0 && !emailOrPhone.includes("@") && /^[0-9+\s-]*$/.test(emailOrPhone) ? (
                    <Phone className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </span>
                <input
                  id="auth-input-email"
                  type="text"
                  required
                  placeholder={language === "cn" ? "请输入您的邮箱 或 手机号" : "e.g., name@domain.com or phone number"}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-2.5 font-sans text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all text-zinc-900"
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 px-1">
                <span>{language === "cn" ? "✓ 自动识别账号类型" : "✓ Auto-detects type"}</span>
                <span className="text-orange-600 font-semibold">
                  {language === "cn" ? "支持手机号与邮箱注册" : "Supports Phone / Email"}
                </span>
              </div>
            </div>

            {/* Username (Only for Register) */}
            {authModalTab === "register" && (
              <div>
                <label className="block font-sans text-xs font-semibold text-zinc-700 mb-1.5">
                  {t.authUsername} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    id="auth-input-username"
                    type="text"
                    required
                    placeholder={language === "cn" ? "例如：极客阿强" : "e.g., SoloBuilder"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 font-sans text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all text-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block font-sans text-xs font-semibold text-zinc-700 mb-1.5">
                {t.authPassword} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="auth-input-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={language === "cn" ? "不少于 6 位字符" : "At least 6 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-10 py-2.5 font-sans text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all text-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Only for Register) */}
            {authModalTab === "register" && (
              <div>
                <label className="block font-sans text-xs font-semibold text-zinc-700 mb-1.5">
                  {t.authConfirmPassword} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="auth-input-confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={language === "cn" ? "请再次输入密码" : "Repeat your password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 font-sans text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all text-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-zinc-950 hover:bg-zinc-900 text-white font-sans text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-orange-400" />
                  {authModalTab === "login" ? t.authLoginBtn : t.authRegisterBtn}
                </>
              )}
            </button>
          </form>

          {/* Switch Tab Prompt */}
          <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
            <button
              id="auth-tab-switch-prompt"
              onClick={() => handleTabSwitch(authModalTab === "login" ? "register" : "login")}
              className="font-sans text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
            >
              {authModalTab === "login" ? t.authNoAccount : t.authHaveAccount}
            </button>
          </div>

          {/* Secure SSL notice */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-mono">
            <Activity className="h-3 w-3 text-emerald-500" />
            <span>SSL 256-bit Secure Compute Handshake</span>
          </div>
        </div>
      </div>
    </div>
  );
}
