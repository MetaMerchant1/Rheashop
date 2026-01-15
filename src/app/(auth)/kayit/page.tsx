"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { TR } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Kayıt başarısız oldu");
        return;
      }

      // Auto login after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/giris");
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
        <CardTitle className="text-2xl">{TR.auth.registerTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Input
            label={TR.auth.name}
            type="text"
            placeholder="Ad Soyad"
            error={errors.name?.message}
            {...register("name")}
          />

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
            placeholder="En az 8 karakter"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label={TR.auth.confirmPassword}
            type="password"
            placeholder="Şifrenizi tekrar girin"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {TR.auth.registerButton}
          </Button>

          <p className="text-center text-sm text-stone-600">
            {TR.auth.hasAccount}{" "}
            <Link
              href="/giris"
              className="font-medium text-amber-700 hover:text-amber-800"
            >
              {TR.common.login}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
