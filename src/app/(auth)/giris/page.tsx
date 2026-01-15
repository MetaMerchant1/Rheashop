"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { TR } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{TR.auth.loginTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Input
            label={TR.auth.email}
            type="email"
            placeholder="ornek@email.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label={TR.auth.password}
            type="password"
            placeholder="********"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-500"
              />
              <span className="text-stone-600">{TR.auth.rememberMe}</span>
            </label>
            <Link
              href="/sifremi-unuttum"
              className="text-amber-700 hover:text-amber-800"
            >
              {TR.auth.forgotPassword}
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {TR.auth.loginButton}
          </Button>

          <p className="text-center text-sm text-stone-600">
            {TR.auth.noAccount}{" "}
            <Link
              href="/kayit"
              className="font-medium text-amber-700 hover:text-amber-800"
            >
              {TR.common.register}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
