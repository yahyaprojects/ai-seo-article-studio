"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiEye, FiEyeOff } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { UI_TEXT } from "@/lib/constants";

const REMEMBERED_USERNAME_KEY = "seo-demo:remembered-username";

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/admin");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/admin");

    const rememberedUsername = window.localStorage.getItem(REMEMBERED_USERNAME_KEY);
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberUser(true);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError(UI_TEXT.loginInvalid);
        return;
      }

      if (rememberUser && username.trim()) {
        window.localStorage.setItem(REMEMBERED_USERNAME_KEY, username.trim());
      } else {
        window.localStorage.removeItem(REMEMBERED_USERNAME_KEY);
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError(UI_TEXT.loginInvalid);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <Card className="grid gap-5">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl font-semibold text-foreground">{UI_TEXT.loginTitle}</h1>
          <p className="text-sm text-muted-foreground">{UI_TEXT.loginDescription}</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">{UI_TEXT.loginUserLabel}</span>
            <Input
              required
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              type="email"
              value={username}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">{UI_TEXT.loginPasswordLabel}</span>
            <div className="relative">
              <Input
                required
                autoComplete="current-password"
                className="pr-12"
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <label className="inline-flex items-center gap-3">
            <input
              checked={rememberUser}
              className="sr-only"
              onChange={(event) => setRememberUser(event.target.checked)}
              type="checkbox"
            />
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-sm border transition-all duration-150 ${
                rememberUser
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-transparent text-transparent"
              }`}
            >
              <FiCheck className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm text-muted-foreground">{UI_TEXT.loginRememberUserLabel}</span>
          </label>
          <Button disabled={isLoading} type="submit">
            {isLoading ? `${UI_TEXT.loginButton}...` : UI_TEXT.loginButton}
          </Button>
          {error ? <p className="text-sm text-primary">{error}</p> : null}
        </form>
      </Card>
    </section>
  );
}
