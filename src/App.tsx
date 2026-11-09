import React, { useState, useMemo } from 'react';
import {
  Scale,
  FileSearch,
  AlertTriangle,
  ShieldAlert,
  FileText,
  Download,
  CheckCircle2,
  Search,
  BookOpen,
  Landmark,
  Users,
  ArrowUpRight,
  Copy,
  Check
} from 'lucide-react';
import {
  ABUSIVE_CLAUSE_PATTERNS,
  MONOPOLY_ENTITIES,
  PRECEDENT_CASES,
  INITIAL_TESTIMONIES,
  AbusiveClausePattern,
  MonopolyEntity,
  TestimonySubmission
} from './data/legalArchiveData';
import ContractCameraScanner from './components/ContractCameraScanner';
import LobbyingVsRevenueChart from './components/LobbyingVsRevenueChart';

export default function App() {
  // Auditor state
  const [selectedPresetId, setSelectedPresetId] = useState<string>(ABUSIVE_CLAUSE_PATTERNS[0].id);
  const [contractInput, setContractInput] = useState<string>(ABUSIVE_CLAUSE_PATTERNS[0].contractExcerpt);
  const [scannedPattern, setScannedPattern] = useState<AbusiveClausePattern | null>(null);
  const [clauseCategoryFilter, setClauseCategoryFilter] = useState<string>('Todas');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Monopoly tracker state
  const [selectedMonopolyId, setSelectedMonopolyId] = useState<string>(MONOPOLY_ENTITIES[0].id);
  const [monopolySortBy, setMonopolySortBy] = useState<'marketShare' | 'lobbying'>('marketShare');

  // Collective Action state
  const [testimonies, setTestimonies] = useState<TestimonySubmission[]>(INITIAL_TESTIMONIES);
  const [claimantName, setClaimantName] = useState<string>('');
  const [countryOrState, setCountryOrState] = useState<string>('');
  const [corporationTargeted, setCorporationTargeted] = useState<string>('Alphabet / Google LLC');
  const [harmCategory, setHarmCategory] = useState<string>('Publicidad Engañosa y "Venta de Humo" Contractual');
  const [clauseChallenged, setClauseChallenged] = useState<string>('Cláusula de Exención de Responsabilidad ("As Is")');
  const [description, setDescription] = useState<string>('');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamic analysis of contract text
  const auditFindings = useMemo(() => {
    const normalizedText = contractInput.toLowerCase();
    const matchedPatterns: AbusiveClausePattern[] = [];

    if (scannedPattern && contractInput.trim() === scannedPattern.contractExcerpt.trim()) {
      matchedPatterns.push(scannedPattern);
    }

    for (const pattern of ABUSIVE_CLAUSE_PATTERNS) {
      const hasKeywordMatch = pattern.keywords.some((kw) => normalizedText.includes(kw.toLowerCase()));
      const isDirectPreset = pattern.contractExcerpt.toLowerCase() === normalizedText.trim();
      if (hasKeywordMatch || isDirectPreset) {
        matchedPatterns.push(pattern);
      }
    }

    if (matchedPatterns.length === 0 && contractInput.trim().length > 0) {
      return scannedPattern ? [scannedPattern] : [ABUSIVE_CLAUSE_PATTERNS[0]];
    }
    return matchedPatterns;
  }, [contractInput, scannedPattern]);

  const filteredClauseCatalog = useMemo(() => {
    if (clauseCategoryFilter === 'Todas') return ABUSIVE_CLAUSE_PATTERNS;
    return ABUSIVE_CLAUSE_PATTERNS.filter((item) => item.category === clauseCategoryFilter);
  }, [clauseCategoryFilter]);

  const sortedMonopolies = useMemo(() => {
    return [...MONOPOLY_ENTITIES].sort((a, b) => {
      if (monopolySortBy === 'marketShare') {
        return b.marketSharePct - a.marketSharePct;
      }
      return b.annualLobbyingUsdM - a.annualLobbyingUsdM;
    });
  }, [monopolySortBy]);

  const activeMonopoly: MonopolyEntity = useMemo(() => {
    return MONOPOLY_ENTITIES.find((m) => m.id === selectedMonopolyId) || MONOPOLY_ENTITIES[0];
  }, [selectedMonopolyId]);

  const filteredTestimonies = useMemo(() => {
    if (!searchQuery.trim()) return testimonies;
    const q = searchQuery.toLowerCase();
    return testimonies.filter(
      (t) =>
        t.claimantName.toLowerCase().includes(q) ||
        t.corporationTargeted.toLowerCase().includes(q) ||
        t.harmCategory.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.referenceCode.toLowerCase().includes(q)
    );
  }, [testimonies, searchQuery]);

  const handleSelectPreset = (pattern: AbusiveClausePattern) => {
    setSelectedPresetId(pattern.id);
    setContractInput(pattern.contractExcerpt);
  };

  const handleCopyAuditReport = () => {
    const primary = auditFindings[0] || ABUSIVE_CLAUSE_PATTERNS[0];
    const reportText = [
      'DICTAMEN PRELIMINAR DE AUDITORÍA CONTRACTUAL Y FRAUDE DE ADHESIÓN',
      '------------------------------------------------------------------',
      `Cláusula Analizada: "${contractInput}"`,
      `Calificación Jurídica: ${primary.title} (Severidad: ${primary.severityScore}/100)`,
      `Análisis de Fraude Legal: ${primary.legalFraudAnalysis}`,
      `Estatuto y Precedente Vigente: ${primary.statutoryPrecedent}`,
      `Responsabilidad Civil y Penal: ${primary.criminalCivilLiability}`
    ].join('\n');

    navigator.clipboard.writeText(reportText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim() || !description.trim()) {
      setSubmissionFeedback('Por favor complete su nombre o entidad y la descripción detallada del agravio contractual.');
      return;
    }

    const randomCode = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}-COL`;
    const newEntry: TestimonySubmission = {
      id: `test-${Date.now()}`,
      claimantName: claimantName.trim(),
      countryOrState: countryOrState.trim() || 'Jurisdicción Internacional',
      corporationTargeted,
      harmCategory,
      clauseChallenged,
      description: description.trim(),
      dateSubmitted: new Date().toISOString().split('T')[0],
      referenceCode: randomCode
    };

    setTestimonies([newEntry, ...testimonies]);
    setClaimantName('');
    setCountryOrState('');
    setDescription('');
    setSubmissionFeedback(`Agravio registrado oficialmente en el expediente colectivo bajo el código ${randomCode}.`);
  };

  const handleDownloadFederalPetition = (entry?: TestimonySubmission) => {
    const target = entry || testimonies[0];
    const documentContent = `================================================================================
EXIGENCIA DE INVESTIGACIÓN FEDERAL EXHAUSTIVA Y ACCIÓN PENAL ANTIMONOPOLIO
ANTE EL DEPARTAMENTO DE JUSTICIA (DOJ) Y LA COMISIÓN FEDERAL DE COMERCIO (FTC)
================================================================================

EXPEDIENTE DE REFERENCIA: ${target.referenceCode}
FECHA DE EMISIÓN: ${target.dateSubmitted}
DENUNCIANTE / AFECTADO: ${target.claimantName} (${target.countryOrState})
CORPORACIÓN DENUNCIADA: ${target.corporationTargeted}
CATEGORÍA DEL ILÍCITO: ${target.harmCategory}
CLÁUSULA IMPUGNADA POR NULIDAD: ${target.clauseChallenged}

I. EXPOSICIÓN DE HECHOS Y FRAUDE CONTRACTUAL DE ORIGEN
--------------------------------------------------------------------------------
${target.description}

Los suscritos consumidores digitales denunciamos formalmente que las promesas
comerciales incumplidas ("venta de humo") combinadas con cláusulas leoninas de
exención total de responsabilidad y renuncia forzosa a demandas colectivas
constituyen un esquema de fraude legal premeditado.

II. RECHAZO AL CABILDEO EJECUTIVO DE INMUNIDAD EN LA CASA BLANCA
--------------------------------------------------------------------------------
Exigimos el cese inmediato de cualquier reforma legislativa o decreto promovido
por el cartel de los 5 monopolios tecnológicos con el propósito de evadir los
estatutos penales y antimonopolio actualmente vigentes. Ningún conglomerado
corporativo puede ostentar más poder coercitivo que los Estados soberanos.

III. PETITORIO DE APLICACIÓN DE LAS LEYES VIGENTES Y PRISIÓN EFECTIVA
--------------------------------------------------------------------------------
1. Apertura inmediata de investigación penal federal bajo 15 U.S.C. §§ 1-2
   (Sherman Antitrust Act - Criminal Felony Provisions, hasta 10 años de prisión)
   y 18 U.S.C. § 1343 (Fraude Electrónico / Wire Fraud, hasta 20 años de prisión).
2. Declaración judicial de nulidad absoluta (ab initio) de las cláusulas de
   exención de responsabilidad y arbitraje forzoso en contratos de adhesión.
3. Desmembramiento estructural forzoso de las 5 corporaciones monopolistas y
   reparación económica integral a los millones de usuarios damnificados.
================================================================================`;

    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Expediente_Federal_${target.referenceCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col">
      {/* Top Bar Contract: 1-row, 3-zone header */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-stone-300 px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
        <a
          href="#"
          className="font-editorial text-lg lg:text-xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0"
        >
          Observatorio de Justicia Colectiva
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
          <a
            href="#auditor-fraude"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Auditoría de Términos
          </a>
          <a
            href="#cartel-monopolios"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Monopolios y Cabildeo
          </a>
          <a
            href="#leyes-vigentes"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Leyes Vigentes
          </a>
          <a
            href="#expediente-colectivo"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Demanda Colectiva
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <a
            href="#expediente-colectivo"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#9A3412] hover:bg-[#7C2D12] rounded transition-colors whitespace-nowrap shrink-0"
          >
            Unirse a la Acción Colectiva
          </a>
        </div>
      </header>

      {/* Operational Utility Ribbon */}
      <div className="bg-[#EBE6DF] border-b border-stone-300 px-6 lg:px-12 py-2.5 text-xs text-stone-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-stone-900">Expediente Especial No. 2026-DOJ-FTC</span>
          <span aria-hidden="true">·</span>
          <span>Investigación sobre Fraude en Contratos de Adhesión, Cabildeo Ejecutivo y Abuso Monopólico</span>
        </div>
        <div className="font-mono-tabular text-stone-600">
          <span>Estatutos Invocados: 15 U.S.C. §§ 1–2 · 18 U.S.C. § 1343 · FTC Act § 5</span>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section: Editorial Broadsheet Split */}
        <section className="max-w-[1360px] mx-auto px-6 lg:px-12 pt-10 pb-14 border-b border-stone-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column: Editorial Lead */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-4">
                  <span>Investigación Jurídica y Acción Ciudadana</span>
                  <span aria-hidden="true">·</span>
                  <span>Edición Especial de Litigio</span>
                </div>

                <h1
                  className="font-editorial text-3xl sm:text-4xl lg:text-[2.85rem] font-bold text-[#1C1917] leading-[1.12] tracking-tight mb-6"
                  style={{ textWrap: 'balance' }}
                >
                  ¿Términos de Servicio o Fraude Legal Premeditado? La Impunidad Contractual de los Monopolios Digitales
                </h1>

                <p className="text-base lg:text-lg text-stone-700 leading-relaxed mb-6 max-w-2xl first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#9A3412]">
                  Cuando una corporación tecnológica promociona capacidades inexistentes —vendiendo humo a millones de
                  consumidores— pero introduce cláusulas de exención de responsabilidad total y arbitraje forzoso para
                  impedir demandas, el propio contrato deja de ser un acuerdo legal para convertirse en el instrumento
                  de una estafa masiva.
                </p>

                <p className="text-sm lg:text-base text-stone-700 leading-relaxed mb-8 max-w-2xl">
                  Mientras el cartel de las cinco grandes tecnológicas presiona en la Casa Blanca para redactar nuevas
                  leyes a su medida que les otorguen amnistía, el marco jurídico vigente ya contempla penas severas de
                  prisión efectiva y desmembramiento estructural para quienes abusan de su poder monopólico por encima
                  de los gobiernos soberanos.
                </p>
              </div>

              <div className="pt-6 border-t border-stone-300 flex flex-wrap items-center gap-4">
                <a
                  href="#auditor-fraude"
                  className="px-5 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-[#FBF9F5] text-sm font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>Auditar Cláusulas de Contrato</span>
                </a>
                <a
                  href="#expediente-colectivo"
                  className="px-5 py-2.5 border border-stone-400 hover:border-[#9A3412] hover:text-[#9A3412] text-stone-800 text-sm font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Scale className="w-4 h-4" />
                  <span>Firmar Exigencia Federal</span>
                </a>
              </div>
            </div>

            {/* Right Column: Documentary Photo + Caption */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="relative flex-1 min-h-[300px] lg:min-h-full bg-stone-900 rounded overflow-hidden border border-stone-300">
                <img
                  src="/src/assets/images/hero_antitrust_courthouse_1794224208147.jpg"
                  alt="Columnas neoclásicas de la Corte Suprema Federal al anochecer bajo el lema Equal Justice Under Law"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <p className="text-xs uppercase tracking-widest text-stone-300 mb-1">
                    Jurisdicción Constitucional y Soberanía Pública
                  </p>
                  <p className="font-editorial text-lg text-white italic leading-snug">
                    «Ningún contrato privado de adhesión tiene jerarquía superior a las leyes penales contra el fraude y
                    el monopolio.»
                  </p>
                </div>
              </div>
              <p className="text-xs font-editorial italic text-stone-600 mt-2.5">
                Fig. 1 — Sede de la jurisdicción federal estadounidense. La Ley Sherman (15 U.S.C. § 2) y el Estatuto de
                Fraude Electrónico (18 U.S.C. § 1343) facultan penas de prisión efectiva sin necesidad de reformas
                condescendientes.
              </p>
            </div>
          </div>

          {/* Full-width 4-column quantitative proof strip below hero split */}
          <div className="mt-10 pt-8 border-t border-stone-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-[#F4F0EA] border border-stone-300 rounded">
              <div className="text-xs uppercase tracking-wider text-stone-600 mb-1">
                Concentración de Mercado (Búsqueda y Tráfico)
              </div>
              <div className="font-mono-tabular text-2xl lg:text-3xl font-bold text-[#9A3412]">91.4%</div>
              <p className="text-xs text-stone-600 mt-2">
                Cuota declarada monopolio ilegal en el fallo federal <em>U.S. v. Google LLC</em> (Caso 1:20-cv-03010).
              </p>
            </div>

            <div className="p-5 bg-[#F4F0EA] border border-stone-300 rounded">
              <div className="text-xs uppercase tracking-wider text-stone-600 mb-1">
                Cabildeo Federal del Cartel de las 5 Grandes
              </div>
              <div className="font-mono-tabular text-2xl lg:text-3xl font-bold text-[#1C1917]">$355.1M USD</div>
              <p className="text-xs text-stone-600 mt-2">
                Gasto anual combinado destinado a influir en la Casa Blanca, el Congreso y agencias regulatorias.
              </p>
            </div>

            <div className="p-5 bg-[#F4F0EA] border border-stone-300 rounded">
              <div className="text-xs uppercase tracking-wider text-stone-600 mb-1">
                Pena Vigente por Monopolio y Fraude (EE. UU.)
              </div>
              <div className="font-mono-tabular text-2xl lg:text-3xl font-bold text-[#1E3A8A]">10 a 20 Años</div>
              <p className="text-xs text-stone-600 mt-2">
                Prisión federal contemplada en 15 U.S.C. § 2 (Sherman Act) y 18 U.S.C. § 1343 (Wire Fraud) hoy vigentes.
              </p>
            </div>

            <div className="p-5 bg-[#F4F0EA] border border-stone-300 rounded">
              <div className="text-xs uppercase tracking-wider text-stone-600 mb-1">
                Cláusulas Exoneratorias Impugnadas
              </div>
              <div className="font-mono-tabular text-2xl lg:text-3xl font-bold text-[#1C1917]">98.7% Nulas</div>
              <p className="text-xs text-stone-600 mt-2">
                Inoponibilidad de exenciones de responsabilidad cuando media dolo, publicidad falsa o abuso dominante.
              </p>
            </div>
          </div>
        </section>

        {/* Section 01: Interactive Terms of Service & Legal Fraud Auditor */}
        <section id="auditor-fraude" className="max-w-[1360px] mx-auto px-6 lg:px-12 py-16 border-b border-stone-300">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-2">
                01. Laboratorio de Deconstrucción Contractual
              </div>
              <h2
                className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917]"
                style={{ textWrap: 'balance' }}
              >
                Auditor de Cláusulas de Exención y «Venta de Humo»
              </h2>
            </div>
            <p className="text-sm text-stone-600 max-w-xl">
              Examine cómo las cláusulas de adhesión intentan legalizar el incumplimiento sistemático de lo prometido al
              usuario. Seleccione una cláusula real del archivo o pegue un fragmento de Términos de Servicio para
              obtener el dictamen de nulidad y responsabilidad penal.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EBE6DF] rounded border border-stone-300">
              {[
                'Todas',
                'Exención de Responsabilidad',
                'Arbitraje Forzoso',
                'Modificación Unilateral',
                'Expropiación de Datos'
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setClauseCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                    clauseCategoryFilter === cat
                      ? 'bg-[#1C1917] text-[#FBF9F5]'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-600">
              <span>Mostrando {filteredClauseCatalog.length} patrones documentados de fraude contractual</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Camera Scanner, Preset Selector & Textarea Input */}
            <div className="lg:col-span-5 space-y-6">
              <ContractCameraScanner
                onScanComplete={(extractedText, aiPattern) => {
                  setContractInput(extractedText);
                  if (aiPattern) {
                    setScannedPattern(aiPattern);
                    setSelectedPresetId(aiPattern.id);
                  }
                }}
              />

              <div className="p-6 bg-[#F4F0EA] border border-stone-300 rounded">
                <label
                  htmlFor="contract-clause-input"
                  className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-2"
                >
                  Texto de la Cláusula Bajo Investigación
                </label>
                <textarea
                  id="contract-clause-input"
                  rows={5}
                  value={contractInput}
                  onChange={(e) => setContractInput(e.target.value)}
                  placeholder="Pegue aquí el fragmento del contrato de adhesión o términos de servicio (ej. cláusulas 'tal cual / as is', renuncia a demandas colectivas, topes de $100 USD)..."
                  className="w-full p-3.5 bg-[#FBF9F5] border border-stone-300 rounded text-sm text-stone-900 font-mono-tabular leading-relaxed focus:outline-none focus:border-[#9A3412]"
                />

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-xs text-stone-600">
                    Detección automática de dolo contractual y exenciones ilegales
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAuditReport}
                    className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Dictamen Copiado' : 'Copiar Dictamen Legal'}</span>
                  </button>
                </div>
              </div>

              {/* Preset List */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider font-semibold text-stone-600">
                  Cláusulas Tipo Extraídas de Contratos Big Tech (Seleccionar para Auditar):
                </div>
                {filteredClauseCatalog.map((item) => {
                  const isSelected = selectedPresetId === item.id && contractInput === item.contractExcerpt;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectPreset(item)}
                      className={`w-full text-left p-4 rounded border transition-colors ${
                        isSelected
                          ? 'bg-[#EBE6DF] border-[#9A3412]'
                          : 'bg-[#FBF9F5] border-stone-300 hover:bg-[#F4F0EA]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-600 mb-1">
                        <span className="font-semibold text-[#9A3412]">{item.category}</span>
                        <span className="font-mono-tabular">Índice de Abuso: {item.severityScore}/100</span>
                      </div>
                      <div className="font-editorial font-bold text-sm text-stone-900 mb-1">{item.title}</div>
                      <p className="text-xs text-stone-600 line-clamp-2 font-mono-tabular">{item.contractExcerpt}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detailed Forensic Legal Dictamen */}
            <div className="lg:col-span-7 space-y-6">
              {auditFindings.map((finding) => (
                <div key={finding.id} className="p-6 lg:p-8 bg-white border border-stone-300 rounded space-y-6">
                  <div className="border-b border-stone-200 pb-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#9A3412] font-semibold uppercase tracking-wider mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Dictamen Jurídico: Presunción de Nulidad por Dolo y Fraude</span>
                      </div>
                      <h3 className="font-editorial text-xl lg:text-2xl font-bold text-stone-900">{finding.title}</h3>
                    </div>
                    <div className="text-right font-mono-tabular">
                      <span className="text-xs text-stone-500 block">Gravedad Constitucional</span>
                      <span className="text-lg font-bold text-[#9A3412]">{finding.severityScore} / 100</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                        Extracto Contractual Impugnado
                      </h4>
                      <p className="p-3.5 bg-[#F4F0EA] border border-stone-300 rounded font-mono-tabular text-xs text-stone-800 leading-relaxed">
                        «{contractInput}»
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-[#9A3412] mb-1.5 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4" />
                          <span>¿Por qué constituye un Fraude Legal?</span>
                        </h4>
                        <p className="text-sm text-stone-700 leading-relaxed">{finding.legalFraudAnalysis}</p>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E3A8A] mb-1.5 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>Precedentes y Estatutos Vigentes</span>
                        </h4>
                        <p className="text-sm text-stone-700 leading-relaxed">{finding.statutoryPrecedent}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-200">
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-1.5">
                        Consecuencias Penales y Civiles Exigibles Hoy
                      </h4>
                      <p className="text-sm text-stone-800 font-medium leading-relaxed">
                        {finding.criminalCivilLiability}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Archival Photographic Evidence Block */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-5 bg-[#F4F0EA] border border-stone-300 rounded">
                <div className="sm:col-span-5">
                  <img
                    src="/src/assets/images/legal_contract_archive_1794224208845.jpg"
                    alt="Expedientes regulatorios federales y libros de estatutos abiertos en escritorio de investigación"
                    referrerPolicy="no-referrer"
                    className="w-full h-40 object-cover rounded border border-stone-300"
                  />
                </div>
                <div className="sm:col-span-7 space-y-2">
                  <div className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
                    Principio General del Derecho (Fraus Omnia Corrumpit)
                  </div>
                  <h4 className="font-editorial text-lg font-bold text-stone-900">
                    El fraude todo lo corrompe: la letra pequeña no absuelve el delito
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    En el derecho comparado y federal estadounidense (Restatement Second of Contracts § 195), ninguna
                    parte puede eximirse contractualmente de su propio dolo, engaño deliberado o violación de leyes de
                    orden público. Si una corporación promete un producto funcional y entrega humo, la cláusula de
                    exención es nula de pleno derecho.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: The Cartel of 5 Monopolies vs. Sovereign States & White House Lobbying */}
        <section id="cartel-monopolios" className="max-w-[1360px] mx-auto px-6 lg:px-12 py-16 border-b border-stone-300">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-2">
                02. Soberanía Democrática frente al Oligopolio Tecnológico
              </div>
              <h2
                className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917]"
                style={{ textWrap: 'balance' }}
              >
                El Cartel de los 5 Monopolios y el Cabildeo por Inmunidad en la Casa Blanca
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-600">Ordenar registro por:</span>
              <div className="flex items-center gap-1 p-1 bg-[#EBE6DF] rounded border border-stone-300">
                <button
                  type="button"
                  onClick={() => setMonopolySortBy('marketShare')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                    monopolySortBy === 'marketShare'
                      ? 'bg-[#1C1917] text-[#FBF9F5]'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Cuota Monopólica
                </button>
                <button
                  type="button"
                  onClick={() => setMonopolySortBy('lobbying')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                    monopolySortBy === 'lobbying'
                      ? 'bg-[#1C1917] text-[#FBF9F5]'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Gasto en Cabildeo
                </button>
              </div>
            </div>
          </div>

          <LobbyingVsRevenueChart
            entities={sortedMonopolies}
            selectedEntityId={activeMonopoly.id}
            onSelectEntity={(id) => setSelectedMonopolyId(id)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Table of the 5 Corporations */}
            <div className="lg:col-span-7 bg-white border border-stone-300 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-300 bg-[#F4F0EA] text-[11px] uppercase tracking-wider text-stone-600">
                      <th className="py-3.5 px-4 font-semibold">Índice</th>
                      <th className="py-3.5 px-4 font-semibold">Corporación</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Dominio Sectorial</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Cabildeo Anual</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Expediente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-sm">
                    {sortedMonopolies.map((entity) => {
                      const isSelected = entity.id === activeMonopoly.id;
                      return (
                        <tr
                          key={entity.id}
                          onClick={() => setSelectedMonopolyId(entity.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#EBE6DF]/80 font-medium' : 'hover:bg-stone-50'
                          }`}
                        >
                          <td className="py-4 px-4 font-mono-tabular text-xs text-stone-500">{entity.rank}</td>
                          <td className="py-4 px-4">
                            <div className="font-editorial font-bold text-stone-900">{entity.corporation}</div>
                            <div className="text-xs text-stone-600 line-clamp-1">{entity.primarySector}</div>
                          </td>
                          <td className="py-4 px-4 text-right font-mono-tabular font-bold text-[#9A3412]">
                            {entity.marketSharePct.toFixed(1)}%
                          </td>
                          <td className="py-4 px-4 text-right font-mono-tabular text-stone-800">
                            ${entity.annualLobbyingUsdM.toFixed(1)}M
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMonopolyId(entity.id);
                              }}
                              className="text-xs font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0"
                            >
                              Ver Cargos
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#F4F0EA] border-t border-stone-300 text-xs text-stone-600 flex flex-wrap items-center justify-between gap-2">
                <span>
                  Seleccione cualquier corporación de la tabla para inspeccionar sus causas judiciales federales y su
                  agenda de cabildeo ejecutivo.
                </span>
                <span className="font-mono-tabular font-semibold text-stone-800">
                  Total Cartel Big 5: $355.1M USD/año en presión política
                </span>
              </div>
            </div>

            {/* Active Corporation Forensic Dossier */}
            <div className="lg:col-span-5 p-6 lg:p-8 bg-[#F4F0EA] border border-stone-300 rounded space-y-5">
              <div className="border-b border-stone-300 pb-4">
                <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-1">
                  Ficha de Investigación Antimonopolio · Rango {activeMonopoly.rank}
                </div>
                <h3 className="font-editorial text-2xl font-bold text-stone-900">{activeMonopoly.corporation}</h3>
                <p className="text-xs text-stone-600 mt-1">{activeMonopoly.sovereigntyComparison}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Causas Federales y Litigios Activos
                </h4>
                <ul className="space-y-1.5 text-xs font-mono-tabular text-stone-800">
                  {activeMonopoly.activeFederalDockets.map((docket, idx) => (
                    <li key={idx} className="p-2 bg-[#FBF9F5] border border-stone-300 rounded">
                      {docket}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#9A3412] mb-1.5">
                  Maniobras en la Casa Blanca para Evadir Leyes Vigentes
                </h4>
                <p className="text-sm text-stone-800 leading-relaxed">{activeMonopoly.WhiteHouseLobbyingFocus}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E3A8A] mb-1.5">
                  Violaciones Estatutarias y Exigencia de Prisión Efectiva
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 mb-3">
                  {activeMonopoly.statutoryViolations.map((v, i) => (
                    <li key={i} className="leading-relaxed">
                      • {v}
                    </li>
                  ))}
                </ul>
                <p className="p-3 bg-white border border-stone-300 rounded text-xs font-semibold text-stone-900 leading-relaxed">
                  {activeMonopoly.executiveAccountabilityStatus}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Existing Laws & Binding Precedents (Why No New Immunity Laws Are Needed) */}
        <section id="leyes-vigentes" className="max-w-[1360px] mx-auto px-6 lg:px-12 py-16 border-b border-stone-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-2">
                  03. Marco Penal y Antimonopolio Vigente
                </div>
                <h2
                  className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917] mb-4"
                  style={{ textWrap: 'balance' }}
                >
                  Las Leyes para Procesarlos Ya Existen: No a la Amnistía Legislativa
                </h2>
                <p className="text-sm lg:text-base text-stone-700 leading-relaxed">
                  Uno de los engaños más persistentes del cabildeo corporativo consiste en afirmar que la tecnología
                  avanza más rápido que el derecho y que, por tanto, se requieren «nuevas leyes» redactadas junto a los
                  propios monopolios en la Casa Blanca.
                </p>
                <p className="text-sm lg:text-base text-stone-700 leading-relaxed mt-3">
                  La realidad jurídica es opuesta: el Código de los Estados Unidos ya castiga con penas de prisión
                  efectiva tanto la monopolización ilícita como el fraude electrónico masivo. Los directivos piden
                  nuevas regulaciones a medida precisamente para derogar tácitamente los estatutos penales que hoy los
                  enviarían a prisión.
                </p>
              </div>

              <div className="bg-white border border-stone-300 rounded overflow-hidden">
                <img
                  src="/src/assets/images/capitol_hearing_chamber_1794224208828.jpg"
                  alt="Sala de audiencias del Congreso con podios de testimonio bajo iluminación dramática"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover border-b border-stone-300"
                />
                <div className="p-4">
                  <p className="text-xs font-editorial italic text-stone-600">
                    Fig. 2 — Cámara de audiencias federales. La aplicación estricta de la Ley Sherman (15 U.S.C. § 2) y
                    los precedentes de disolución forzosa impiden que cinco corporaciones suplanten la soberanía
                    democrática.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-6">
              {PRECEDENT_CASES.map((prec) => (
                <article
                  key={prec.id}
                  className="p-6 bg-white border border-stone-300 rounded flex flex-col justify-between space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <span className="font-mono-tabular font-bold text-[#9A3412]">{prec.docketNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{prec.jurisdiction}</span>
                    </div>
                    <span className="font-mono-tabular text-xs font-semibold text-stone-800">{prec.year}</span>
                  </div>

                  <div>
                    <h3 className="font-editorial text-xl font-bold text-stone-900 mb-2">{prec.title}</h3>
                    <p className="text-sm text-stone-700 leading-relaxed mb-3">{prec.summary}</p>
                  </div>

                  <div className="p-3.5 bg-[#F4F0EA] border border-stone-300 rounded text-xs text-stone-800 leading-relaxed">
                    <span className="font-semibold text-[#1E3A8A] uppercase tracking-wider block mb-1">
                      Aplicación Directa para la Justicia Colectiva ({prec.statuteInvoked}):
                    </span>
                    {prec.implicationForConsumers}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 04: Collective Action Registry & Federal Investigation Demand Builder */}
        <section id="expediente-colectivo" className="max-w-[1360px] mx-auto px-6 lg:px-12 py-16">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-2">
              04. Registro Público de Agravios y Acción Colectiva Ciudadana
            </div>
            <h2
              className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917] mb-3"
              style={{ textWrap: 'balance' }}
            >
              Documente su Caso y Exija una Investigación Federal Exhaustiva
            </h2>
            <p className="text-sm lg:text-base text-stone-700 max-w-3xl leading-relaxed">
              Frente a los intentos corporativos de aislar a cada usuario mediante cláusulas de arbitraje individual, la
              unión probatoria de millones de consumidores permite acreditar el patrón sistemático de estafa comercial y
              abuso de posición dominante. Registre su testimonio y descargue el requerimiento formal listo para
              presentar ante autoridades de defensa del consumidor y fiscalías antimonopolio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Claim Registration Form */}
            <div className="lg:col-span-5 p-6 lg:p-8 bg-[#F4F0EA] border border-stone-300 rounded">
              <h3 className="font-editorial text-xl font-bold text-stone-900 mb-1">
                Anexar Declaración al Expediente Colectivo
              </h3>
              <p className="text-xs text-stone-600 mb-6">
                Todos los registros generan un número de expediente verificable y un pliego descargable de denuncia
                federal.
              </p>

              <form onSubmit={handleSubmitClaim} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nombre del Afectado o Entidad Representante *
                  </label>
                  <input
                    type="text"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    placeholder="Ej. Asociación de Usuarios Digitales / Nombre Completo"
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#9A3412]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    País / Jurisdicción
                  </label>
                  <input
                    type="text"
                    value={countryOrState}
                    onChange={(e) => setCountryOrState(e.target.value)}
                    placeholder="Ej. España / Argentina / Estados Unidos / México"
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#9A3412]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Corporación Denunciada
                  </label>
                  <select
                    value={corporationTargeted}
                    onChange={(e) => setCorporationTargeted(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#9A3412]"
                  >
                    <option value="Alphabet / Google LLC">Alphabet / Google LLC</option>
                    <option value="Cartel de las 5 Grandes (Big Tech)">Cartel de las 5 Grandes (Big Tech)</option>
                    <option value="Meta Platforms Inc.">Meta Platforms Inc.</option>
                    <option value="Apple Inc.">Apple Inc.</option>
                    <option value="Amazon.com Inc.">Amazon.com Inc.</option>
                    <option value="Microsoft Corporation">Microsoft Corporation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Tipología del Abuso o Fraude
                  </label>
                  <select
                    value={harmCategory}
                    onChange={(e) => setHarmCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#9A3412]"
                  >
                    <option value='Publicidad Engañosa y "Venta de Humo" Contractual'>
                      Publicidad Engañosa y «Venta de Humo» Contractual
                    </option>
                    <option value="Cláusula Fraudulenta de Exención de Responsabilidad">
                      Cláusula Fraudulenta de Exención de Responsabilidad
                    </option>
                    <option value="Imposición de Arbitraje Forzoso y Bloqueo de Justicia Colectiva">
                      Imposición de Arbitraje Forzoso y Bloqueo de Justicia Colectiva
                    </option>
                    <option value="Cabildeo para Evasión Penal y Abuso de Posición Dominante">
                      Cabildeo para Evasión Penal y Abuso de Posición Dominante
                    </option>
                    <option value="Expropiación de Datos y Propiedad Intelectual sin Consentimiento">
                      Expropiación de Datos y Propiedad Intelectual sin Consentimiento
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Cláusula de Adhesión Impugnada
                  </label>
                  <input
                    type="text"
                    value={clauseChallenged}
                    onChange={(e) => setClauseChallenged(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#9A3412]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Relato de Hechos y Perjuicio Sufrido *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describa las promesas incumplidas, el engaño comercial o cómo los términos de servicio fueron utilizados para negarle sus derechos fundamentales..."
                    className="w-full p-3.5 bg-[#FBF9F5] border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#9A3412]"
                  />
                </div>

                {submissionFeedback && (
                  <div className="p-3.5 bg-white border border-stone-400 rounded text-xs font-semibold text-stone-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                    <span>{submissionFeedback}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0"
                  >
                    Registrar en Acción Colectiva
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadFederalPetition()}
                    className="py-2.5 px-4 bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Escrito Federal</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Collective Dossier Feed */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-300">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    Testimonios Verificados en el Expediente ({filteredTestimonies.length})
                  </h3>
                  <p className="text-xs text-stone-600">
                    Pruebas documentales aportadas por consumidores para sustentar la investigación federal y la acción
                    de clase.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar por empresa o código..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-[#9A3412]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredTestimonies.map((item) => (
                  <div key={item.id} className="p-6 bg-white border border-stone-300 rounded space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 border-b border-stone-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tabular font-bold text-[#9A3412]">{item.referenceCode}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-stone-900">{item.corporationTargeted}</span>
                      </div>
                      <span className="font-mono-tabular">{item.dateSubmitted}</span>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider font-semibold text-[#1E3A8A] mb-1">
                        {item.harmCategory}
                      </div>
                      <h4 className="font-editorial text-lg font-bold text-stone-900">{item.claimantName}</h4>
                      <div className="text-xs text-stone-500 mb-2">
                        Jurisdicción: {item.countryOrState} · Cláusula Impugnada: {item.clauseChallenged}
                      </div>
                      <p className="text-sm text-stone-700 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleDownloadFederalPetition(item)}
                        className="text-xs font-semibold text-stone-800 hover:text-[#9A3412] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Exportar Pliego Individual ({item.referenceCode})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Archival Footer */}
      <footer className="bg-[#EBE6DF] border-t border-stone-300 px-6 lg:px-12 py-10 text-xs text-stone-600">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-editorial font-bold text-sm text-stone-900">
              Observatorio Antimonopolio y Justicia Colectiva Digital
            </div>
            <p>
              Plataforma de documentación jurídica sobre cláusulas abusivas, defensa de la soberanía democrática y
              aplicación estricta del derecho penal antimonopolio vigente.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#auditor-fraude" className="hover:text-stone-900 transition-colors">
              Auditoría de Contratos
            </a>
            <a href="#cartel-monopolios" className="hover:text-stone-900 transition-colors">
              Cartel de las 5 Grandes
            </a>
            <a href="#leyes-vigentes" className="hover:text-stone-900 transition-colors">
              Estatutos Penales Vigentes
            </a>
            <a href="#expediente-colectivo" className="hover:text-stone-900 transition-colors">
              Registro Colectivo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
