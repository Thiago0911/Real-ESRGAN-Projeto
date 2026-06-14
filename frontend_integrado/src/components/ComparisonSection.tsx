import { motion } from "framer-motion";
import {
Check,
X,
Minus,
Sparkles,
} from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

type FeatureStatus =
| "yes"
| "partial"
| "no";

type ToolFeature = {
label: string;
status: FeatureStatus;
};

type Tool = {
name: string;
tag: string | null;
price: string;
priceDetail: string;
highlight: boolean;
features: ToolFeature[];
};

const tools: Tool[] = [
{
name: "Pixel Forge",
tag: "Desenvolvido para a PMZ",
price: "Sem mensalidade",
priceDetail:
"utiliza a infraestrutura atual",
highlight: true,
features: [
{
label:
"Sem cobrança por imagem processada",
status: "yes",
},
{
label:
"Aumento de resolução em 4×",
status: "yes",
},
{
label:
"Remoção automática de fundo",
status: "yes",
},
{
label:
"Processamento de imagens em lote",
status: "yes",
},
{
label:
"Processamento executado localmente",
status: "yes",
},
{
label:
"Imagens permanecem na máquina",
status: "yes",
},
{
label:
"Fluxo adaptado à operação PMZ",
status: "yes",
},
{
label:
"Execução noturna automatizada",
status: "yes",
},
],
},
{
name: "Pixlr Premium",
tag: null,
price: "US$ 9,99",
priceDetail:
"por mês · 1.000 créditos",
highlight: false,
features: [
{
label:
"Uso condicionado aos créditos do plano",
status: "partial",
},
{
label:
"Aumento de resolução com IA",
status: "yes",
},
{
label:
"Remoção automática de fundo",
status: "yes",
},
{
label:
"Processamento de imagens em lote",
status: "partial",
},
{
label:
"Processamento executado localmente",
status: "no",
},
{
label:
"Imagens permanecem somente na máquina",
status: "no",
},
{
label:
"Fluxo adaptado à operação PMZ",
status: "no",
},
{
label:
"Execução noturna integrada à PMZ",
status: "no",
},
],
},
{
name: "Claid Pro",
tag: null,
price: "US$ 49",
priceDetail:
"por mês · 2.000 créditos",
highlight: false,
features: [
{
label:
"Uso condicionado aos créditos do plano",
status: "partial",
},
{
label:
"Aumento de resolução com IA",
status: "yes",
},
{
label:
"Remoção automática de fundo",
status: "yes",
},
{
label:
"Processamento de imagens em lote",
status: "yes",
},
{
label:
"Processamento executado localmente",
status: "no",
},
{
label:
"Imagens permanecem somente na máquina",
status: "no",
},
{
label:
"Fluxo adaptado à operação PMZ",
status: "no",
},
{
label:
"Execução noturna integrada à PMZ",
status: "partial",
},
],
},
];

function FeatureIcon({
status,
highlight,
}: {
status: FeatureStatus;
highlight: boolean;
}) {
if (status === "yes") {
return (
<Check
className={`h-4 w-4 mt-0.5 shrink-0 ${
          highlight
            ? "text-primary"
            : "text-green-600"
        }`}
/>
);
}

if (status === "partial") {
return ( <Minus className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
);
}

return ( <X className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/40" />
);
}

const ComparisonSection = () => {
return ( <section
   id="comparativo"
   className="relative h-screen flex items-center overflow-hidden"
 > <SectionBackground
     showOrb={false}
     imageOpacity={0.2}
     gridOpacity={0.1}
   />


  <div className="container relative z-10 mx-auto px-6 py-6">
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
      }}
      className="text-center mb-6"
    >
      <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
        Mais que economia:{" "}
        <span className="text-gradient-forge">
          controle e escala
        </span>
      </h2>

      <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
        Uma solução desenvolvida para
        a operação PMZ, sem
        mensalidade, sem cobrança por
        imagem e com processamento
        local.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch max-w-6xl mx-auto">
      {tools.map((tool, index) => (
        <motion.div
          key={tool.name}
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
          }}
          className={`relative rounded-2xl border p-5 flex flex-col transition-all duration-300 ${
            tool.highlight
              ? "border-primary/50 bg-primary/5 shadow-[0_0_40px_-10px] shadow-primary/20"
              : "border-border bg-card/60 backdrop-blur-sm"
          }`}
        >
          {tool.highlight &&
            tool.tag && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-forge-gradient px-3 py-1 text-xs font-semibold text-primary-foreground whitespace-nowrap">
                  <Sparkles className="h-3 w-3" />

                  {tool.tag}
                </span>
              </div>
            )}

          <div className="mb-3 mt-1">
            <h3
              className={`text-lg font-bold font-display ${
                tool.highlight
                  ? "text-gradient-forge"
                  : "text-foreground"
              }`}
            >
              {tool.name}
            </h3>

            <div className="mt-2 flex items-baseline gap-1">
              <span
                className={`text-2xl font-bold ${
                  tool.highlight
                    ? "text-gradient-forge"
                    : "text-foreground"
                }`}
              >
                {tool.price}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              {tool.priceDetail}
            </p>
          </div>

          <div className="border-t border-border mb-3" />

          <ul className="space-y-2.5 flex-1">
            {tool.features.map(
              (feature) => (
                <li
                  key={feature.label}
                  className="flex items-start gap-2.5"
                >
                  <FeatureIcon
                    status={
                      feature.status
                    }
                    highlight={
                      tool.highlight
                    }
                  />

                  <span
                    className={`text-xs leading-snug ${
                      feature.status ===
                      "no"
                        ? "text-muted-foreground/50"
                        : "text-foreground"
                    }`}
                  >
                    {feature.label}
                  </span>
                </li>
              )
            )}
          </ul>

          {tool.highlight && (
            <div className="mt-4 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-center">
              <p className="text-xs font-semibold text-primary">
                Pronto para validação
                interna
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
        delay: 0.4,
      }}
      className="mt-5 space-y-2 text-center"
    >
      <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-green-600" />
          Disponível
        </span>

        <span className="flex items-center gap-1.5">
          <Minus className="h-3.5 w-3.5 text-amber-500" />
          Disponível parcialmente
        </span>

        <span className="flex items-center gap-1.5">
          <X className="h-3.5 w-3.5 text-muted-foreground/40" />
          Não disponível no fluxo
          avaliado
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground max-w-4xl mx-auto">
        Preços públicos consultados
        em junho de 2026 e sujeitos a
        alterações, câmbio, impostos
        e consumo de créditos. O
        Pixel Forge não possui
        mensalidade ou cobrança por
        imagem, mas utiliza
        infraestrutura, energia e
        suporte internos.
      </p>
    </motion.div>
  </div>
</section>


);
};

export default ComparisonSection;
