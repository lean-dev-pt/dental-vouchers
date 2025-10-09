import { TutorialStep } from "./tutorial-step";

export function ConnectSupabaseSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Criar projeto Supabase">
        <p>
          Aceda a{" "}
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="font-bold hover:underline text-foreground/80"
            rel="noreferrer"
          >
            database.new
          </a>{" "}
          e crie um novo projeto Supabase.
        </p>
      </TutorialStep>

      <TutorialStep title="Declarar variáveis de ambiente">
        <p>
          Renomeie o ficheiro{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            .env.example
          </span>{" "}
          na sua aplicação Next.js para{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            .env.local
          </span>{" "}
          e preencha com os valores das{" "}
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="font-bold hover:underline text-foreground/80"
            rel="noreferrer"
          >
            Definições API do seu projeto Supabase
          </a>
          .
        </p>
      </TutorialStep>

      <TutorialStep title="Reiniciar o servidor de desenvolvimento Next.js">
        <p>
          Poderá precisar de fechar o servidor de desenvolvimento Next.js e executar{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            npm run dev
          </span>{" "}
          novamente para carregar as novas variáveis de ambiente.
        </p>
      </TutorialStep>

      <TutorialStep title="Atualizar a página">
        <p>
          Poderá precisar de atualizar a página para o Next.js carregar as novas
          variáveis de ambiente.
        </p>
      </TutorialStep>
    </ol>
  );
}
