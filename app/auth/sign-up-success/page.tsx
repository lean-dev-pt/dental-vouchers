import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Obrigado por se registar!
              </CardTitle>
              <CardDescription>Verifique o seu email para confirmar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Registou-se com sucesso. Por favor, verifique o seu email para
                confirmar a sua conta antes de entrar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
