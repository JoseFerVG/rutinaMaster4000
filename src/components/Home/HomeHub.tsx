import React from 'react';
import { ArrowRight, Layers, Calculator, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const HomeHub: React.FC = () => {
  const { goToCategory } = useAppStore();

  const categories = [
    {
      id: 'routines' as const,
      title: 'Arquitectura de Rutinas & Protocolos',
      badge: '2 Herramientas Activas',
      badgeType: 'active',
      icon: Layers,
      description:
        'Motores algorítmicos para diseño de planes de hipertrofia con mapa anatómico interactivo y periodización cardiovascular por zonas fisiológicas.',
      toolsList: [
        { name: 'Protocolos de Hipertrofia & Fuerza', desc: 'Mapa anatómico HD, selección de secundarios y exportación Excel' },
        { name: 'Planificador de Cardio & Resistencia', desc: 'Running, Ciclismo, Remo, Natación, HIIT y Concurrente' }
      ]
    },
    {
      id: 'calculators' as const,
      title: 'Calculadoras Biomecánicas & Fisiológicas',
      badge: '12 Calculadoras Activas',
      badgeType: 'active',
      icon: Calculator,
      description:
        'Suite cuantitativa interactiva de cálculo cinemático, estimación ponderada de 1RM, ciclos de sueño, TDEE desglosado, hidratación y suplementación.',
      toolsList: [
        { name: 'Readiness Hooper, Ciclos de Sueño & FC Karvonen', desc: 'Monitoreo de fatiga, ritmos circadianos y 5 zonas cardíacas' },
        { name: '1RM Peso Muerto, Press Banca & Pliegues Cutáneos', desc: 'Modelos Epley, Brzycki, Wathan y Jackson-Pollock' },
        { name: 'Calorías, TDEE, Cafeína, Creatina & Magnesio', desc: 'ISSN, EFSA y partición energética con cálculo en tiempo real' }
      ]
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10 animate-fadeIn">
      {/* Hero Welcome Header */}
      <div className="space-y-3 text-center sm:text-left max-w-2xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-zinc-600 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-zinc-900" />
          <span>PORTAL DE HERRAMIENTAS · V2.0</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Kinetic Biomechanics
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
          Selecciona una categoría de herramientas para configurar, calcular y exportar tus protocolos de entrenamiento con rigor científico.
        </p>
      </div>

      {/* Category Selection Grid (2 Main Types) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => goToCategory(cat.id)}
              className="group cursor-pointer bg-white border border-zinc-200/90 hover:border-zinc-900/60 rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-elevated transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              {/* Category Top Banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      cat.badgeType === 'active'
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-zinc-950 group-hover:text-zinc-800 transition-colors">
                    {cat.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Sub-tools Included Preview */}
                <div className="pt-2 border-t border-zinc-100 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                    Herramientas Incluidas:
                  </span>
                  <div className="space-y-1.5">
                    {cat.toolsList.map((tool, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 bg-zinc-50/70 p-2 rounded-lg border border-zinc-100">
                        <span className="font-mono text-[10px] text-zinc-400 mt-0.5">0{idx + 1}</span>
                        <div>
                          <span className="font-semibold text-zinc-900 block">{tool.name}</span>
                          <span className="text-[11px] text-zinc-500">{tool.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-950 group-hover:text-zinc-700">
                <span>Acceder a la categoría</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
