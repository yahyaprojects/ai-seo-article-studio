"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { UI_TEXT } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/admin");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/admin");
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
            <Input
              required
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
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
