import { motion } from "framer-motion";
import { Users, Cpu, TrendingUp, Clock, Image } from "lucide-react";

const teamMembers = [
  { name: "Thiago", manual: 20 },
  { name: "Raphael", manual: 20 },
  { name: "Rodrigo", manual: 10 },
  { name: "Matheus", manual: 20 },
];

const MACHINES = 4;
const BATCH_HOURS = 13.5;
const IMAGES_PER_MACHINE = 500;
const WORK_HOURS = 8;

const manualHourly = teamMembers.reduce((s, m) => s + m.manual, 0);
const manualDaily = manualHourly * WORK_HOURS;
const pixelForgeDaily = MACHINES * IMAGES_PER_MACHINE;
const pixelForgeHourly = Math.round(pixelForgeDaily / BATCH_HOURS);
const multiplier = (pixelForgeDaily / manualDaily).toFixed(1);

const metrics = [
  { icon: Image,  label: "Imgs / hora",  before: manualHourly,  after: pixelForgeHourly },
  { icon: Clock,  label: "Imgs / dia",   before: manualDaily,   after: pixelForgeDaily  },
  { icon: Users,  label: "Pessoas",      before: 4,             after: 0,  afterLabel: "Auto" },
  { icon: Cpu,    label: "Máquinas",     before: 0,             after: MACHINES, beforeLabel: "—" },
];

// barras agrupadas: cada entrada tem manual + pixelforge
const barData = [
  ...teamMembers.map((m) => ({
    label: m.name,
    manual: m.manual * WORK_HOURS,
    forge: 0,
  })),
  ...Array.from({ length: MACHINES }, (_, i) => ({
    label: `Máq. ${i + 1}`,
    manual: 0,
    forge: IMAGES_PER_MACHINE,
  })),
];

const BAR_MAX = IMAGES_PER_MACHINE;

const MetricsSection = () => {
  return (
    <section id="impacto" className="relative h-full flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="relative flex-1 overflow-y-auto container mx-auto px-6 py-8">

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Impacto <span className="text-gradient-forge">real no time</span>
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
            Processo manual vs Pixel Forge em lote overnight — 4 máquinas, 13,5h de processamento.
          </p>
        </motion.div>

        {/* Layout principal: esquerda cards | direita gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Coluna esquerda — multiplier + cards */}
          <div className="flex flex-col gap-4">

            {/* Multiplier */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-primary/30 bg-primary/5 py-4 px-6 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Ganho de produtividade
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{pixelForgeDaily.toLocaleString("pt-BR")}</span>
                  {" "}vs{" "}
                  <span className="text-foreground font-medium">{manualDaily}</span>
                  {" "}imgs/dia
                </p>
              </div>
              <div className="text-5xl font-bold font-display text-gradient-forge leading-none">
                {multiplier}×
              </div>
            </motion.div>

            {/* Metric cards 2×2 */}
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <m.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
                    {m.label}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <div className="text-center">
                      <div className="text-[10px] text-muted-foreground mb-0.5">Antes</div>
                      <div className="text-base font-bold text-muted-foreground">
                        {m.beforeLabel ?? m.before}
                      </div>
                    </div>
                    <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
                    <div className="text-center">
                      <div className="text-[10px] text-muted-foreground mb-0.5">Depois</div>
                      <div className="text-base font-bold text-gradient-forge">
                        {m.afterLabel ?? m.after}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Coluna direita — gráfico agrupado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <h3 className="text-sm font-semibold font-display mb-0.5">
              Produção diária por colaborador / máquina
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Barras agrupadas — manual (esmaecido) vs Pixel Forge (destaque)
            </p>

            <div className="space-y-3">
              {barData.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-16 text-xs text-muted-foreground text-right shrink-0">
                    {row.label}
                  </span>

                  <div className="flex-1 flex flex-col gap-1">
                    {/* Barra manual */}
                    {row.manual > 0 ? (
                      <div className="h-3 rounded-full bg-muted/40 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(row.manual / BAR_MAX) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, delay: 0.15 + i * 0.06 }}
                          className="h-full rounded-full bg-muted-foreground/30"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                          {row.manual}
                        </span>
                      </div>
                    ) : (
                      <div className="h-3 rounded-full bg-muted/20 flex items-center px-2">
                        <span className="text-[10px] text-muted-foreground/40">—</span>
                      </div>
                    )}

                    {/* Barra Pixel Forge */}
                    {row.forge > 0 ? (
                      <div className="h-3 rounded-full bg-muted/40 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(row.forge / BAR_MAX) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, delay: 0.2 + i * 0.06 }}
                          className="h-full rounded-full bg-primary/70"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-primary font-medium">
                          {row.forge}
                        </span>
                      </div>
                    ) : (
                      <div className="h-3 rounded-full bg-muted/20 flex items-center px-2">
                        <span className="text-[10px] text-muted-foreground/40">—</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Totais */}
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Manual total:{" "}
                <span className="text-foreground font-semibold">{manualDaily} imgs</span>
              </span>
              <span className="text-primary font-medium">
                Pixel Forge total:{" "}
                <span className="font-semibold">{pixelForgeDaily.toLocaleString("pt-BR")} imgs</span>
              </span>
            </div>

            {/* Legenda */}
            <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                Processo manual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary/70" />
                Pixel Forge (overnight)
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;