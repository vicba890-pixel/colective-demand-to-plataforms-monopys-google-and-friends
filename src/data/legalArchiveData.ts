export interface AbusiveClausePattern {
  id: string;
  title: string;
  category: 'Exención de Responsabilidad' | 'Arbitraje Forzoso' | 'Modificación Unilateral' | 'Publicidad Engañosa' | 'Expropiación de Datos';
  contractExcerpt: string;
  keywords: string[];
  legalFraudAnalysis: string;
  statutoryPrecedent: string;
  criminalCivilLiability: string;
  severityScore: number;
}

export interface MonopolyEntity {
  id: string;
  rank: string;
  corporation: string;
  primarySector: string;
  marketSharePct: number;
  annualLobbyingUsdM: number;
  sovereigntyComparison: string;
  activeFederalDockets: string[];
  statutoryViolations: string[];
  WhiteHouseLobbyingFocus: string;
  executiveAccountabilityStatus: string;
}

export interface PrecedentCase {
  id: string;
  docketNumber: string;
  year: string;
  title: string;
  jurisdiction: string;
  statuteInvoked: string;
  summary: string;
  implicationForConsumers: string;
}

export interface TestimonySubmission {
  id: string;
  claimantName: string;
  countryOrState: string;
  corporationTargeted: string;
  harmCategory: string;
  clauseChallenged: string;
  description: string;
  dateSubmitted: string;
  referenceCode: string;
}

export const ABUSIVE_CLAUSE_PATTERNS: AbusiveClausePattern[] = [
  {
    id: 'cl-01',
    title: 'Exención Absoluta por Fallo Prometido y "Venta de Humo" Comercial',
    category: 'Exención de Responsabilidad',
    contractExcerpt:
      'EL PROVEEDOR OFRECE EL SERVICIO "TAL CUAL" (AS IS) Y "SEGÚN DISPONIBILIDAD", RECHAZANDO TODA GARANTÍA EXPRESA O IMPLÍCITA SOBRE LA VERACIDAD DE LAS CAPACIDADES PROMOCIONADAS EN CAMPAÑAS PUBLICITARIAS O DEMOSTRACIONES COMERCIALES.',
    keywords: [
      'tal cual',
      'as is',
      'sin garantía',
      'no garantiza',
      'exención de responsabilidad',
      'bajo su propio riesgo',
      'disponibilidad',
      'errores o interrupciones'
    ],
    legalFraudAnalysis:
      'Constituye un fraude contractual de origen cuando la empresa promociona agresivamente capacidades técnicas inexistentes ("venta de humo") para captar usuarios e inversiones, pero inserta en la letra pequeña una renuncia total a cumplir lo prometido en su oferta pública.',
    statutoryPrecedent:
      'FTC Act Sección 5 (15 U.S.C. § 45) sobre Prácticas Engañosas y Doctrina de Inoponibilidad de Cláusulas Exoneratorias por Dolo o Fraude (Restatement Second of Contracts § 195).',
    criminalCivilLiability:
      'Invalidez radical (nulidad de pleno derecho) de la cláusula por dolo inductivo; responsabilidad penal corporativa e individual bajo 18 U.S.C. § 1343 (Wire Fraud) si existe intención deliberada de defraudar mediante promesas falsas.',
    severityScore: 96
  },
  {
    id: 'cl-02',
    title: 'Renuncia Forzosa a Demandas Colectivas y Arbitraje Privado Secreto',
    category: 'Arbitraje Forzoso',
    contractExcerpt:
      'USTED Y LA EMPRESA ACUERDAN QUE CUALQUIER DISPUTA SE RESOLVERÁ EXCLUSIVAMENTE MEDIANTE ARBITRAJE INDIVIDUAL VINCULANTE Y RENUNCIAN EXPRESAMENTE AL DERECHO DE PARTICIPAR EN DEMANDAS DE ACCIÓN COLECTIVA O JUICIOS CON JURADO.',
    keywords: [
      'arbitraje',
      'acción colectiva',
      'demanda colectiva',
      'renuncia',
      'class action',
      'individualmente',
      'jurado'
    ],
    legalFraudAnalysis:
      'Diseñada específicamente para blindar a la corporación frente a millones de micro-estafas simultáneas. Al prohibir la unión procesal de los afectados, el costo individual de litigar supera el daño directo, garantizando impunidad fáctica al monopolio.',
    statutoryPrecedent:
      'Doctrina de Inconsciencia Contractual (Unconscionability - UCC § 2-302) y Directiva 93/13/CEE sobre Cláusulas Abusivas en Contratos con Consumidores.',
    criminalCivilLiability:
      'Inaplicabilidad judicial cuando el contrato de adhesión encubre prácticas monopólicas violatorias de la Ley Sherman (15 U.S.C. § 1-2) o fraude masivo al consumidor.',
    severityScore: 94
  },
  {
    id: 'cl-03',
    title: 'Tope Indemnizatorio Irrisorio frente a Daños Patrimoniales Masivos',
    category: 'Exención de Responsabilidad',
    contractExcerpt:
      'EN NINGÚN CASO LA RESPONSABILIDAD TOTAL DE LA CORPORACIÓN POR TODOS LOS DAÑOS, PÉRDIDAS Y CAUSAS DE ACCIÓN SUPERARÁ EL MONTO PAGADO POR EL USUARIO EN LOS ÚLTIMOS DOCE MESES O CIEN DÓLARES ($100.00 USD).',
    keywords: [
      'responsabilidad total',
      'en ningún caso',
      'daños indirectos',
      'lucro cesante',
      'cien dólares',
      'limitación de responsabilidad',
      'pérdida de datos'
    ],
    legalFraudAnalysis:
      'Permite destruir negocios enteros, bloquear cuentas arbitrariamente o incumplir contratos críticos manteniendo el beneficio ilícito y limitando el castigo a una cifra simbólica.',
    statutoryPrecedent:
      'Código Civil y Comercial (Nulidad de dispensa anticipada del dolo) y Precedentes Federales sobre Cláusulas Leoninas en Contratos de Adhesión Digital.',
    criminalCivilLiability:
      'Nulidad absoluta de los topes indemnizatorios frente a negligencia grave, incumplimiento doloso o abuso de posición dominante.',
    severityScore: 91
  },
  {
    id: 'cl-04',
    title: 'Modificación Unilateral Retroactiva de Condiciones y Precios',
    category: 'Modificación Unilateral',
    contractExcerpt:
      'NOS RESERVAMOS EL DERECHO DE MODIFICAR, SUSPENDER O DISCONTINUAR ESTOS TÉRMINOS O CUALQUIER CARACTERÍSTICA DEL SERVICIO EN CUALQUIER MOMENTO Y A NUESTRA EXCLUSIVA DISCRECIÓN, SIENDO EL USO CONTINUADO PRUEBA DE ACEPTACIÓN.',
    keywords: [
      'modificar',
      'exclusiva discreción',
      'cualquier momento',
      'sin previo aviso',
      'uso continuado',
      'suspender o discontinuar'
    ],
    legalFraudAnalysis:
      'Convierte el contrato bilateral en una ficción jurídica (Illusory Promise): el usuario queda atado a todas las obligaciones mientras la corporación se reserva el derecho de vaciar de contenido su prestación tras haber capturado el mercado.',
    statutoryPrecedent:
      'Jurisprudencia Federal sobre "Illusory Contracts" (In re Zappos.com, Inc., Customer Data Security Breach Litigation).',
    criminalCivilLiability:
      'Declaración de contrato ilusorio e inexigible contra el consumidor; restitución íntegra de cobros e intervención regulatoria federal.',
    severityScore: 88
  },
  {
    id: 'cl-05',
    title: 'Apropiación Perpetua e Irrevocable de Propiedad Intelectual y Datos',
    category: 'Expropiación de Datos',
    contractExcerpt:
      'AL UTILIZAR EL SERVICIO, USTED OTORGA UNA LICENCIA MUNDIAL, PERPETUA, IRREVOCABLE, LIBRE DE REGALÍAS Y SUB-LICENCIABLE PARA USAR, REPRODUCIR Y ENTRENAR SISTEMAS AUTOMATIZADOS CON SU CONTENIDO Y METADATOS.',
    keywords: [
      'licencia mundial',
      'perpetua',
      'irrevocable',
      'libre de regalías',
      'entrenar',
      'contenido del usuario',
      'propiedad intelectual'
    ],
    legalFraudAnalysis:
      'Expropiación encubierta del trabajo intelectual y la privacidad de millones de ciudadanos bajo la apariencia de un servicio gratuito o de suscripción, consolidando barreras de entrada infranqueables para competidores.',
    statutoryPrecedent:
      'Doctrina de Abuso de Explotación Antimonopolio (Sherman Act § 2) y Normativas de Protección de Datos Fundamentales.',
    criminalCivilLiability:
      'Desinversión forzosa de activos de datos obtenidos ilícitamente, destrucción de modelos entrenados sin consentimiento informado real y sanciones pecuniarias sobre facturación global.',
    severityScore: 89
  }
];

export const MONOPOLY_ENTITIES: MonopolyEntity[] = [
  {
    id: 'mono-alphabet',
    rank: '01',
    corporation: 'Alphabet / Google LLC',
    primarySector: 'Búsqueda Web, Publicidad Digital, Sistema Operativo Móvil e IA',
    marketSharePct: 91.4,
    annualLobbyingUsdM: 74.8,
    sovereigntyComparison: 'Capitalización bursátil superior al PIB nominal combinado de 145 Estados soberanos.',
    activeFederalDockets: [
      'U.S. v. Google LLC (1:20-cv-03010 - Monopolio en Búsqueda)',
      'U.S. v. Google LLC (1:23-cv-00108 - Monopolio AdTech)',
      'In re Digital Advertising Consumidor Class Action'
    ],
    statutoryViolations: [
      'Sherman Antitrust Act Sección 2 (15 U.S.C. § 2 - Mantenimiento ilegal de monopolio)',
      'FTC Act Sección 5 (Prácticas comerciales desleales y publicidad engañosa de capacidades técnicas)',
      'Obstrucción y destrucción sistemática de registros internos (Chat auto-eliminado en litigios federales)'
    ],
    WhiteHouseLobbyingFocus:
      'Cabildeo intensivo en la Casa Blanca y agencias federales para aprobar marcos regulatorios "a medida" que otorguen inmunidad retroactiva y desplacen las leyes penales y antimonopolio vigentes.',
    executiveAccountabilityStatus:
      'Exigencia de aplicación de penas privativas de libertad bajo 15 U.S.C. § 2 (hasta 10 años de prisión para directivos responsables) y 18 U.S.C. § 1343 por fraude electrónico masivo.'
  },
  {
    id: 'mono-meta',
    rank: '02',
    corporation: 'Meta Platforms Inc.',
    primarySector: 'Redes Sociales, Mensajería Instantánea y Vigilancia Publicitaria',
    marketSharePct: 78.2,
    annualLobbyingUsdM: 68.4,
    sovereigntyComparison: 'Control directo del flujo informativo diario de 3.980 millones de ciudadanos globales.',
    activeFederalDockets: [
      'FTC v. Meta Platforms, Inc. (1:20-cv-03590 - Adquisiciones depredadoras)',
      'Litigios Multidistritales por Daño Deliberado a Consumidores (MDL No. 3047)'
    ],
    statutoryViolations: [
      'Clayton Act Sección 7 (Adquisición anticompetitiva para neutralizar rivales)',
      'Ocultamiento doloso de auditorías internas sobre daños al usuario y métricas publicitarias infladas'
    ],
    WhiteHouseLobbyingFocus:
      'Presión ejecutiva para bloquear leyes federales de privacidad de datos y blindar cláusulas de exención bajo escudos federales de preempción estatal.',
    executiveAccountabilityStatus:
      'Investigación por falso testimonio ante el Congreso (18 U.S.C. § 1001) y responsabilidad penal ejecutiva por fraude en métricas comerciales.'
  },
  {
    id: 'mono-apple',
    rank: '03',
    corporation: 'Apple Inc.',
    primarySector: 'Ecosistema Móvil Cerrado, Distribución de Software y Pasarelas de Pago',
    marketSharePct: 61.8,
    annualLobbyingUsdM: 59.2,
    sovereigntyComparison: 'Liquidez y valoración equivalentes a las mayores economías del G7.',
    activeFederalDockets: [
      'U.S. & Plaintiff States v. Apple Inc. (2:24-cv-04055 - Monopolio de Ecosistema Smartphone)'
    ],
    statutoryViolations: [
      'Sherman Act Sección 2 (Impuesto monopólico del 30% y degradación deliberada de interoperabilidad)',
      'Acuerdos de exclusividad multimillonarios para impedir motores de búsqueda alternativos'
    ],
    WhiteHouseLobbyingFocus:
      'Intervención ante el Ejecutivo para frenar mandatos de interoperabilidad abierta y desestimar cargos por colusión horizontal.',
    executiveAccountabilityStatus:
      'Responsabilidad estatutaria por pactos restrictivos del comercio (15 U.S.C. § 1) y restitución forzosa a desarrolladores y consumidores.'
  },
  {
    id: 'mono-amazon',
    rank: '04',
    corporation: 'Amazon.com Inc.',
    primarySector: 'Comercio Electrónico Dominante, Logística y Nube (AWS)',
    marketSharePct: 82.5,
    annualLobbyingUsdM: 81.6,
    sovereigntyComparison: 'Control de infraestructura crítica gubernamental y comercial superior a bancos centrales regionales.',
    activeFederalDockets: [
      'FTC & 17 States v. Amazon.com, Inc. (2:23-cv-01495 - Prácticas punitivas y algoritmos de precios)',
      'FTC v. Amazon (Patrones Oscuros y Suscripciones Engañosas)'
    ],
    statutoryViolations: [
      'Sherman Act Secciones 1 y 2 (Algoritmos de fijación tácita de precios e inflación artificial al consumidor)',
      'Restore Online Shoppers Confidence Act (ROSCA - Trampas contractuales de cancelación)'
    ],
    WhiteHouseLobbyingFocus:
      'Cabildeo en contrataciones de seguridad nacional para obtener trato preferencial frente a investigaciones del Departamento de Justicia (DOJ).',
    executiveAccountabilityStatus:
      'Persecución penal bajo estatutos vigentes de manipulación de mercado y destrucción de evidencia algorítmica.'
  },
  {
    id: 'mono-microsoft',
    rank: '05',
    corporation: 'Microsoft Corporation',
    primarySector: 'Software Corporativo, Infraestructura Cloud y Consolidación de IA',
    marketSharePct: 86.1,
    annualLobbyingUsdM: 71.1,
    sovereigntyComparison: 'Dependencia estructural de sistemas estatales, defensa y sector financiero global.',
    activeFederalDockets: [
      'Investigación Federal FTC/DOJ por Contratos de Empaquetamiento Forzoso (Bundling) y Adquisiciones Encubiertas de IA'
    ],
    statutoryViolations: [
      'Clayton Act Sección 3 y Sherman Act Sección 1 (Ventas atadas y bloqueo de licencias en la nube)',
      'Evasión de control de fusiones mediante pseudo-contrataciones y licencias exclusivas'
    ],
    WhiteHouseLobbyingFocus:
      'Diseño de órdenes ejecutivas y comités asesores federales para consolidar un oligopolio regulatorio que excluya competidores abiertos y exima de responsabilidad legal.',
    executiveAccountabilityStatus:
      'Aplicación estricta de sanciones penales y desmembramiento estructural (Structural Breakup) conforme a precedentes históricos.'
  }
];

export const PRECEDENT_CASES: PrecedentCase[] = [
  {
    id: 'prec-01',
    docketNumber: '15 U.S.C. §§ 1–2',
    year: '1890 / Vigente',
    title: 'Sherman Antitrust Act — Sanciones Penales de Prisión Efectiva',
    jurisdiction: 'Legislación Federal de los Estados Unidos (Vigente)',
    statuteInvoked: '15 U.S.C. § 1 y § 2 (Criminal Felony Provisions)',
    summary:
      'La ley vigente ya tipifica como delito grave (felony) toda conspiración para restringir el comercio o monopolizar cualquier parte del comercio interestatal. No se requieren "nuevas leyes" indulgentes: el estatuto actual contempla penas de hasta 10 años de prisión federal para personas físicas (ejecutivos y directores) y multas corporativas masivas.',
    implicationForConsumers:
      'Desmiente la narrativa corporativa de que existe un "vacío legal". Los fiscales federales tienen hoy la potestad legal para procesar penalmente a los ejecutivos que ordenan prácticas monopólicas.'
  },
  {
    id: 'prec-02',
    docketNumber: '18 U.S.C. § 1343',
    year: '1952 / Vigente',
    title: 'Estatuto Federal de Fraude Electrónico (Wire Fraud)',
    jurisdiction: 'Código Penal Federal de EE. UU.',
    statuteInvoked: '18 U.S.C. § 1343 (Penalidad hasta 20 años de prisión)',
    summary:
      'Establece que quien haya ideado o intente idear cualquier esquema o artificio para defraudar, o para obtener dinero o propiedad por medio de pretensiones, representaciones o promesas falsas o fraudulentas transmitidas por medios electrónicos, incurrirá en pena de prisión de hasta 20 años.',
    implicationForConsumers:
      'Cuando una corporación tecnológica vende humo conscientemente (prometiendo capacidades falsas en sus productos o términos) para cobrar suscripciones o captar datos, ninguna cláusula de "exención de responsabilidad" civil puede anular la comisión del delito penal de fraude electrónico.'
  },
  {
    id: 'prec-03',
    docketNumber: 'Caso No. 1:20-cv-03010',
    year: '2024',
    title: 'United States v. Google LLC (Sentencia Federal de Monopolio)',
    jurisdiction: 'Tribunal de Distrito de EE. UU. para el Distrito de Columbia',
    statuteInvoked: 'Sección 2 de la Ley Sherman',
    summary:
      'Sentencia histórica en la que un tribunal federal dictaminó formalmente que Google es un monopolista ilegal que ha abusado de su poder para mantener su dominio en motores de búsqueda y publicidad de texto, además de señalar la destrucción sistemática de comunicaciones internas relevantes.',
    implicationForConsumers:
      'Constituye cosa juzgada y prueba prima facie (15 U.S.C. § 16) que facilita a millones de consumidores y afectados presentar demandas colectivas por daños triples (Treble Damages).'
  },
  {
    id: 'prec-04',
    docketNumber: '221 U.S. 1 / 552 F. Supp. 131',
    year: '1911 / 1982',
    title: 'Standard Oil Co. v. United States & United States v. AT&T',
    jurisdiction: 'Corte Suprema de EE. UU. / Tribunal Federal D.C.',
    statuteInvoked: 'Disolución Estructural Antimonopolio',
    summary:
      'Precedentes vinculantes que demuestran que ningún conglomerado privado puede acumular más poder coercitivo que los gobiernos soberanos. Cuando las multas resultan ineficaces, la ley ordena la fragmentación forzosa (breakup) de la corporación en entidades independientes.',
    implicationForConsumers:
      'Respalda la exigencia de prohibir que un cartel de 5 corporaciones controle la infraestructura digital mundial.'
  }
];

export const INITIAL_TESTIMONIES: TestimonySubmission[] = [
  {
    id: 'test-101',
    claimantName: 'Carlos M. Mendoza (Representante PyME Digital)',
    countryOrState: 'Madrid, España / Jurisdicción UE-EE.UU.',
    corporationTargeted: 'Alphabet / Google LLC',
    harmCategory: 'Publicidad Engañosa y "Venta de Humo" Contractual',
    clauseChallenged: 'Sección 14: Exclusión de Garantías y Limitación de Responsabilidad',
    description:
      'Contratamos servicios empresariales basados en demostraciones técnicas y promesas comerciales explícitas que resultaron inexistentes en producción. Al reclamar el reembolso y los daños operativos, la empresa invocó una cláusula de adhesión que la exime de cumplir sus propias promesas publicitarias.',
    dateSubmitted: '2026-11-08',
    referenceCode: 'EXP-2026-8841-COL'
  },
  {
    id: 'test-102',
    claimantName: 'Elena R. Vance (Asociación de Consumidores Digitales)',
    countryOrState: 'California, Estados Unidos',
    corporationTargeted: 'Cartel de las 5 Grandes (Big Tech)',
    harmCategory: 'Imposición de Arbitraje Forzoso y Bloqueo de Justicia Colectiva',
    clauseChallenged: 'Cláusula de Renuncia a Acción de Clase (Class Action Waiver)',
    description:
      'Millones de cuentas fueron afectadas por cobros opacos y extracción no consentida de datos privados. El contrato impide acudir a tribunales ordinarios en grupo, obligando a arbitrajes individuales cuyo costo supera el reclamo para asegurar la impunidad corporativa.',
    dateSubmitted: '2026-11-07',
    referenceCode: 'EXP-2026-8839-COL'
  },
  {
    id: 'test-103',
    claimantName: 'Dr. Javier Morales (Observatorio de Soberanía Tecnológica)',
    countryOrState: 'Ciudad de México / Coalición Transnacional',
    corporationTargeted: 'Alphabet / Google LLC & Microsoft Corp.',
    harmCategory: 'Cabildeo para Evasión Penal y Abuso de Posición Dominante',
    clauseChallenged: 'Modificación Unilateral y Expropiación de Propiedad Intelectual',
    description:
      'Documentamos cómo los términos de servicio fueron alterados unilateralmente para absorber repositorios y documentos privados sin compensación, mientras sus cabilderos exigen nuevas leyes ejecutivas que neutralicen los estatutos penales de fraude vigentes.',
    dateSubmitted: '2026-11-05',
    referenceCode: 'EXP-2026-8812-COL'
  }
];
