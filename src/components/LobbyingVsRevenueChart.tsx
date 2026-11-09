import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { MonopolyEntity } from '../data/legalArchiveData';

interface LobbyingVsRevenueChartProps {
  entities: MonopolyEntity[];
  selectedEntityId: string;
  onSelectEntity: (id: string) => void;
}

export default function LobbyingVsRevenueChart({
  entities,
  selectedEntityId,
  onSelectEntity
}: LobbyingVsRevenueChartProps) {
  const [viewMode, setViewMode] = useState<'dual' | 'lobbying' | 'revenue'>('dual');

  const chartData = entities.map((item) => {
    const lobbyingPerBillionRev = Number(((item.annualLobbyingUsdM / item.annualRevenueUsdB) * 1000).toFixed(1));
    return {
      id: item.id,
      name: item.shortName,
      fullName: item.corporation,
      lobbyingM: item.annualLobbyingUsdM,
      revenueB: item.annualRevenueUsdB,
      marketSharePct: item.marketSharePct,
      lobbyingPerBillionRev
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
      <div className="p-4 bg-[#FBF9F5] border border-stone-400 rounded shadow-sm text-xs space-y-2 max-w-xs">
        <div className="border-b border-stone-300 pb-1.5">
          <div className="font-editorial font-bold text-sm text-stone-900">{data.fullName}</div>
          <div className="text-[11px] text-stone-600">
            Cuota de Dominio Sectorial: <span className="font-mono-tabular font-semibold">{data.marketSharePct}%</span>
          </div>
        </div>

        <div className="space-y-1 font-mono-tabular">
          <div className="flex items-center justify-between gap-4">
            <span className="text-stone-600">Gasto Anual Cabildeo:</span>
            <span className="font-bold text-[#9A3412]">${data.lobbyingM.toFixed(1)}M USD</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-stone-600">Ingresos Anuales Brutos:</span>
            <span className="font-bold text-[#1E3A8A]">${data.revenueB.toFixed(1)}B USD</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-stone-200">
            <span className="text-stone-600">Intensidad Política:</span>
            <span className="font-semibold text-stone-900">
              ${(data.lobbyingM / data.revenueB).toFixed(2)}M por cada $1B
            </span>
          </div>
        </div>

        <div className="text-[11px] text-stone-500 italic pt-0.5">
          Haga clic en la barra para inspeccionar el expediente federal de {data.name}.
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8 p-6 bg-white border border-stone-300 rounded space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-1">
            Análisis Cuantitativo de Captura Regulatoria
          </div>
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900">
            Escala de Presión Política ($M USD en Cabildeo) frente a Ingresos Anuales ($B USD)
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Comparativa de los recursos destinados a bloquear leyes antimonopolio en la Casa Blanca y el Congreso frente
            a la facturación anual de las 5 grandes tecnológicas.
          </p>
        </div>

        {/* Interactive Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#EBE6DF] rounded border border-stone-300 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('dual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'dual' ? 'bg-[#1C1917] text-[#FBF9F5]' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            Cabildeo vs. Ingresos
          </button>
          <button
            type="button"
            onClick={() => setViewMode('lobbying')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'lobbying' ? 'bg-[#1C1917] text-[#FBF9F5]' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            Solo Cabildeo ($M)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('revenue')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'revenue' ? 'bg-[#1C1917] text-[#FBF9F5]' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            Solo Ingresos ($B)
          </button>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="w-full h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 24, left: 8, bottom: 8 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                const clickedId = state.activePayload[0].payload.id;
                if (clickedId) onSelectEntity(clickedId);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#292524', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#D6D3D1' }}
              tickLine={false}
            />

            {(viewMode === 'dual' || viewMode === 'lobbying') && (
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#9A3412"
                tick={{ fill: '#9A3412', fontSize: 11 }}
                tickFormatter={(val) => `$${val}M`}
                axisLine={{ stroke: '#D6D3D1' }}
                tickLine={false}
                domain={[0, 100]}
              />
            )}

            {(viewMode === 'dual' || viewMode === 'revenue') && (
              <YAxis
                yAxisId="right"
                orientation={viewMode === 'revenue' ? 'left' : 'right'}
                stroke="#1E3A8A"
                tick={{ fill: '#1E3A8A', fontSize: 11 }}
                tickFormatter={(val) => `$${val}B`}
                axisLine={{ stroke: '#D6D3D1' }}
                tickLine={false}
                domain={[0, 700]}
              />
            )}

            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F5F4' }} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              formatter={(value) => <span className="text-stone-800 font-medium">{value}</span>}
            />

            {(viewMode === 'dual' || viewMode === 'lobbying') && (
              <Bar
                yAxisId="left"
                dataKey="lobbyingM"
                name="Gasto Anual en Cabildeo ($M USD)"
                fill="#9A3412"
                radius={[3, 3, 0, 0]}
                cursor="pointer"
                maxBarSize={48}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-lob-${entry.id}`}
                    fill={entry.id === selectedEntityId ? '#9A3412' : '#C2410C'}
                    opacity={entry.id === selectedEntityId ? 1 : 0.78}
                  />
                ))}
              </Bar>
            )}

            {(viewMode === 'dual' || viewMode === 'revenue') && (
              <Bar
                yAxisId="right"
                dataKey="revenueB"
                name="Ingresos Anuales Brutos ($B USD)"
                fill="#1E3A8A"
                radius={[3, 3, 0, 0]}
                cursor="pointer"
                maxBarSize={48}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-rev-${entry.id}`}
                    fill={entry.id === selectedEntityId ? '#1E3A8A' : '#3B82F6'}
                    opacity={entry.id === selectedEntityId ? 1 : 0.72}
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Quantitative Footnote */}
      <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
        <div>
          <span>
            Asimetría de Escala: El Cartel de las 5 Grandes factura{' '}
            <strong className="font-mono-tabular text-stone-900">$1,788.6B USD</strong> anuales y destina{' '}
            <strong className="font-mono-tabular text-[#9A3412]">$355.1M USD</strong> a cabildeo directo para frenar
            procesos penales.
          </span>
        </div>
        <div className="font-mono-tabular text-stone-500">
          Seleccione cualquier barra del gráfico para cargar su expediente judicial
        </div>
      </div>
    </div>
  );
}
