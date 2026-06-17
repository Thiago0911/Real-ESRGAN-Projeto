import { motion } from "framer-motion";
import {
Check,
Minus,
Sparkles,
X,
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
tag: "Solução interna da PMZ",
price: "Sem licença recorrente",
priceDetail:
"Utiliza infraestrutura interna disponível",
highlight: true,
features: [
{
label:
"Sem cobrança por imagem ou consumo de créditos",
status: "yes",
},
{
label:
"Aumento de resolução em até 4×",
status: "yes",
},
{
label:
"Remoção de fundo e processamento em lote",
status: "yes",
},
{
label:
"Processamento local com maior privacidade",
status: "yes",
},
{
label:
"Fluxo adaptado à operação da PMZ",
status: "yes",
},
{
label:
"Execução noturna integrada ao processo",
status: "yes",
},
],
},
{
name: "Pixlr Premium",
tag: null,
price: "US$ 9,99",
priceDetail:
"Por mês · plano sujeito a créditos",
highlight: false,
features: [
{
label:
"Uso condicionado ao plano e aos créditos",
status: "partial",
},
{
label:
"Aumento de resolução com IA",
status: "yes",
},
{
label:
"Remoção de fundo e processamento em lote",
status: "partial",
},
{
label:
"Processamento local com maior privacidade",
status: "no",
},
{
label:
"Fluxo adaptado à operação da PMZ",
status: "no",
},
{
label:
"Execução noturna integrada ao processo",
status: "no",
},
],
},
{
name: "Claid Pro",
tag: null,
price: "US$ 49",
priceDetail:
"Por mês · plano sujeito a créditos",
highlight: false,
features: [
{
label:
"Uso condicionado ao plano e aos créditos",
status: "partial",
},
{
label:
"Aumento de resolução com IA",
status: "yes",
},
{
label:
"Remoção de fundo e processamento em lote",
status: "yes",
},
{
label:
"Processamento local com maior privacidade",
status: "no",
},
{
label:
"Fluxo adaptado à operação da PMZ",
status: "no",
},
{
label:
"Execução noturna integrada ao processo",
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
className={`mt-0.5 h-4 w-4 shrink-0 ${
          highlight
            ? "text-primary"
            : "text-green-600 dark:text-green-400"
        }`}
/>
);
}

if (status === "partial") {
return ( <Minus className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
);
}

return ( <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
);
}

const ComparisonSection = () => {
return ( <section
   id="comparativo"
   className="relative flex min-h-screen items-center overflow-hidden py-8 sm:py-10"
 > <SectionBackground
     showOrb={false}
     imageOpacity={0.2}
     gridOpacity={0.1}
   />


  <div className="container relative z-10 mx-auto px-6">
    {/* CABEÇALHO */}
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
      className="mx-auto mb-6 max-w-4xl text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Comparativo de alternativas
      </p>

      <h2 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
        Comparativo de custo e{" "}
        <span className="text-gradient-forge">
          aderência operacional
        </span>
      </h2>

      <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Enquanto soluções externas dependem de
        assinaturas, créditos e processamento em
        nuvem, o Pixel Forge foi desenvolvido para
        operar localmente e acompanhar o fluxo real
        da PMZ.
      </p>
    </motion.div>

    {/* CARDS */}
    <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
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
          className={`relative flex flex-col rounded-2xl border p-5 transition-all duration-300 ${
            tool.highlight
              ? "border-primary/50 bg-primary/5 shadow-[0_0_40px_-10px] shadow-primary/20"
              : "border-border bg-card/60 backdrop-blur-sm"
          }`}
        >
          {/* BADGE PIXEL FORGE */}
          {tool.highlight &&
            tool.tag && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-forge-gradient px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="h-3 w-3" />

                  {tool.tag}
                </span>
              </div>
            )}

          {/* TÍTULO E PREÇO */}
          <div className="mb-3 mt-1">
            <h3
              className={`font-display text-lg font-bold ${
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

            <p className="mt-1 text-xs text-muted-foreground">
              {tool.priceDetail}
            </p>
          </div>

          <div className="mb-3 border-t border-border" />

          {/* FUNCIONALIDADES */}
          <ul className="flex flex-1 flex-col gap-3">
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

          {/* DESTAQUE DO PROTÓTIPO */}
          {tool.highlight && (
            <div className="mt-4 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-center">
              <p className="text-xs font-semibold text-primary">
                Protótipo funcional pronto para
                piloto
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>

    {/* LEGENDA E OBSERVAÇÃO */}
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
          <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          Disponível
        </span>

        <span className="flex items-center gap-1.5">
          <Minus className="h-3.5 w-3.5 text-amber-500" />
          Disponível parcialmente
        </span>

        <span className="flex items-center gap-1.5">
          <X className="h-3.5 w-3.5 text-muted-foreground/40" />
          Não disponível no fluxo avaliado
        </span>
      </div>

      <p className="mx-auto max-w-4xl text-[11px] leading-relaxed text-muted-foreground">
        Valores públicos consultados em junho de
        2026 e sujeitos a alterações, câmbio,
        impostos, limites dos planos e consumo de
        créditos. O Pixel Forge não exige licença
        ou API recorrente, mas utiliza
        infraestrutura, energia, manutenção e
        suporte internos.
      </p>
    </motion.div>
  </div>
</section>


);
};

export default ComparisonSection;
