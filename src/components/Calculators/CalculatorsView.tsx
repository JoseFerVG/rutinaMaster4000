import React from 'react';
import { Calculator } from 'lucide-react';

export const CalculatorsView: React.FC = () => {
  const tools = [
    {
      id: '1rm',
      name: 'Estimador de 1RM & Cargas de Trabajo',
      desc: 'Cálculo de repetición máxima mediante fórmulas Epley, Brzycki y Wathan con percentiles de fatiga y RPE.',
      status: 'Operativo'
    },
    {
      id: 'hr_zones',
      name: 'Calculadora de Zonas Cardíacas (Karvonen)',
      desc: 'Determinación de Z1 a Z5 basada en frecuencia cardíaca de reserva (HRR) y modelos Tanaka / Gellish.',
      status: 'Operativo'
    },
    {
      id: 'macros_tdee',
      name: 'Gasto Energético & Partición de Macronutrientes',
      desc: 'Modelos Mifflin-St Jeor / Katch-McArdle y ratios de carbohidratos, grasas y proteínas (ISSN).',
      status: 'Operativo'
    },
    {
      id: 'readiness',
      name: 'Readiness & Índice de Hooper',
      desc: 'Control psicométrico de fatiga, calidad de sueño, dolor muscular y ratio de carga aguda:crónica (ACWR).',
      status: 'Operativo'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            SUITE DE HERRAMIENTAS
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
          Calculadoras Biomecánicas
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 max-w-xl">
          Módulo de cálculo cinemático y fisiológico para optimización de cargas, zonas de entrenamiento y partición energética.
        </p>
      </div>

      {/* Grid of Planned Calculators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-subtle space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-950 text-white border border-zinc-950 font-medium">
                {tool.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-zinc-900">
              {tool.name}
            </h3>

            <p className="text-xs text-zinc-500 leading-relaxed">
              {tool.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
