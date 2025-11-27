
import { CatalogType, CatalogFile } from '../types';

const DB_NAME = 'SpartanCatalogDB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

// Helper to open IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
        reject("IndexedDB not supported");
        return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveCatalogFile = async (file: CatalogFile): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Error saving catalog file to DB", e);
    alert("Erro ao salvar arquivo no banco de dados do navegador.");
    throw e;
  }
};

export const getCatalogFile = async (id: 'el_castor' | 'unger'): Promise<CatalogFile | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Error fetching catalog file", e);
    return null;
  }
};

export const EL_CASTOR_CONTEXT = `
==============================================================================
CATÁLOGO TÉCNICO COMPLETO EL CASTOR
==============================================================================

1. SISTEMA DE CODIFICAÇÃO POR CORES (CPA - APPCC/HACCP):
A letra final do código indica a cor:
- Branco (+W): Indústria Alimentícia / Serviços / Hotelaria
- Preto (+K): Indústria / Geral
- Vermelho (+R): Áreas de Alto Risco / Banheiros
- Laranja (+O): Hospitais e Clínicas
- Amarelo (+Y): Indústrias em Geral / Aviso
- Verde (+G): Áreas de Manipulação de Alimentos / Frutas / Verduras
- Azul (+B): Limpeza Profissional / Geral / Pescados
- Roxo (+P): Indústria Alimentícia (Alergênicos)
- Café (+T): Cuidado de Veículos / Áreas externas

2. CLASSIFICAÇÃO TÉCNICA DE FIBRA POR MATERIAL (RESISTÊNCIA):
LEGENDA: [E]=Excelente, [B]=Boa, [S]=Suficiente, [I]=Insuficiente.

| MATERIAL | Temp. Máx | Umidade | Ácidos | Álcalis | Petróleo | Observação |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **PBT (Poliéster)** | 120°C | E | B | E | E | Ideal para Alimentos (FDA) e Autoclave. |
| **NYLON** | 100°C | E | S | E | E | Alta resistência mecânica. |
| **POLIPROPILENO** | 80°C | E | E | E | S | Resistência química geral. |
| **PVC** | 53°C | E | E | B | B | Baixo custo, não usar em calor. |
| **TEFLÓN** | 260°C | E | E | E | E | Altíssima temperatura. |
| **AÇO INOX** | N/A | E | B | E | E | Não oxida. |

3. PRODUTOS EL CASTOR:

--- ESCOVAS MANUAIS E MULTIUSO (PBT - FDA) ---
* ESCOVA MULTIUSO (PUNHO CURTO) - REF 4002 (Cores: G,R,W,Y,B,O). 20,8cm.
* ESCOVA MULTIUSO (PUNHO LONGO) - REF 4102 (Cores: G,R,W,Y,B,O). 49,7cm. Máquinas profundas.
* ESCOVA LARGA DETALHADA - REF 4012 (Cores: G,R,W,Y,B,O). 17,8cm. Peças pequenas.
* ESCOVA ESTREITA DETALHADA - REF 4022 (Cores: G,R,W,Y,B,O). 22,86cm. Frestas.
* ESCOVA P/ TÁBUAS DE CORTE - REF 4302 (Cores: G,R,W,Y,B,O). 15cm.
* ESCOVA TIPO PRANCHA (FERRO) - REF 4312 (Cores: G,R,W,Y,B,O). 15,5cm. Pendura no balde.
* ESCOVA DE MÃO (BALCÃO) - REF 4402 (Cores: G,R,W,Y,B,O). 20,32cm.
* ESCOVA REDONDA ESTRELA - REF 4332 (Cores: G,R,W,Y,B,O). 10,3cm diâm. Potes redondos.
* ESCOVA DE BANCADA - REF 4601 (Macia) / 4602 (Média). 33cm.

--- TUBOS E TANQUES ---
* ESCOVA TUBOS (ROSCA 3/4") - REF 5325 (6,35cm) / 5330 (7,62cm). 360 graus.
* ESCOVA CURVADA (MEIA LUA) - REF 5401. Tubos aéreos externos.
* ESCOVA TANQUE OVAL - REF 4802. 25,4cm. 3 posições de ângulo.
* ESCOVA BAQUETA (INTERNA) - REF 5107W (1,9cm) a 5130W (7,6cm). Haste Inox.
* ESCOVA DETALHE CABO LONGO - REF 4641. Tipo escova de dentes gigante.

--- PISOS E ÁREA EXTERNA ---
* ESCOVA PISO 4501 (Macia) / 4502 (Média). Base PP.
* ESCOVA BI-LEVEL (DOIS NÍVEIS) - REF 4202. 25,4cm. Rodapés e piso.
* ESCOVA GIRATÓRIA - REF 4510. Articulada para cantos.
* ESCOVA ANGULAR - REF 4702. Tipo piaçava sintética.
* ESCOVA REJUNTES (TRIANGULAR) - REF 45T2. Cerdas em ponta.
* ESCOVA LIMPEZA DE BOTAS - REF 4632. Com fluxo de água.
* VASSOURA POLIÉSTER (RECICLADA) - REF 8302. Econômica.
* ESCOVA OMNI SWEEP - REF 4188. Cerdas mistas (grossa/fina).

--- DIVERSOS ---
* ESCOVA UNHAS - REF 4901.
* PÁS SANITÁRIAS (PP) - REF 9801 (Mão) / 9802 (Cabo). Antifaiscante, não oxida.
* ESPÁTULAS PP - REF 9201 (Peq) / 9202 (Méd). Não risca.
* RODOS: FI25 (Bancada), FI45/75 (Higiênico), UH50 (Ultra Higiênico Monobloco).
* CABOS: 1906-F (Fibra Vidro - Câmaras Frias), 1906-A (Alumínio), 1906E-A (Alumínio Euro).
* AUTOMOTIVA: 1609 (Carroceria), 1809 (Macio), 1810-B (Bi-level).
`;

export const UNGER_CONTEXT = `
==============================================================================
CATÁLOGO TÉCNICO COMPLETO UNGER
==============================================================================

PÁGINA 1: ARMAÇÕES E LUVAS
* ARMAÇÃO EM "T" - SWIVEL STRIP
  - SV350 (35cm) / SV450 (45cm).
  - Alumínio leve, ângulo ajustável em 7 posições. Cabo emborrachado.
* ARMAÇÃO EM "T" - ERGOTEC NINJA
  - NI350 (35cm) / NI450 (45cm) / NI550 (55cm).
  - Barra ergonômica, alumínio aeronáutico T6 (não dobra), vincos de retenção de água, trava giratória.
* LAVADOR COMPLETO (Armação + Luva)
  - WC250 (25cm) / WC350 (35cm) / WC450 (45cm).
  - Acompanha luva pelúcia. Armação com vincos.
* LUVA KLETT STRIPWASHER
  - KS350 (35cm). Pelúcia de um lado, textura velcro no verso para pano de microfibra.
* LUVA DO LAVADOR (Original)
  - WS250 (25cm) / WS350 (35cm) / WS450 (45cm).
  - Pelúcia e tecido sintético. Extremidades reforçadas.
* LUVA DO LAVADOR DE MICROFIBRA
  - NS250 (25cm) / NS350 (35cm) / NS450 (45cm) / NS550 (55cm).
  - Absorve 6x seu peso. Textura lateral para esfregação. 500 ciclos de lavagem.
* LUVA COM TEXTURA STRIPWASHER
  - RS350 (35cm) / RS450 (45cm). Microfibra com textura para esfregação extra. 20% mais retenção.
* LUVA BLACK SERIES
  - BS350 (35cm) / BS450 (45cm). Microfibra ultrafina. 20% mais retenção.

PÁGINA 2: VICE-VERSA (COMBOS)
* VICE-VERSA COMPLETO (Rodo + Luva)
  - VP250 (25cm) / VP350 (35cm) / VP450 (45cm).
  - 2 em 1. Guia removível inox.
* VICE-VERSA PRO (Versão Melhorada)
  - VV250 (25cm) / VV350 (35cm) / VV450 (45cm).
  - Mop de microfibra alta retenção. Lâmina removível para retoques. Lavável.
* LUVA DO VICE-VERSA PRO
  - VEP25 (25cm) / VEP35 (35cm). Alta absorção.
* RODO AUTO SQUEEGEE
  - AUSQ0 (20cm). Cabo plástico curto (53cm) + Rodo/Esfregão. Vidros de carros.

PÁGINA 3: CABOS E GUIAS (ERGOTEC NINJA)
* RODO ERGOTEC NINJA (CONJUNTO COMPLETO)
  - EN450 (45cm).
  - Base giratória, alumínio aeronáutico T6, trava TriLoc. Ângulo 40 graus.
* CABO FLEXÍVEL ERGOTEC NINJA
  - EN000. Cabo ergonômico bicomponente. Ajuste giratório.
* LÂMINA (GUIA) ERGOTEC NINJA CHANNEL
  - AC250 (25cm) / AC350 (35cm) / AC450 (45cm).
  - Alumínio aeronáutico. Marcação laser central. SmartClip nas pontas.
* PLUGUES ERGOTEC NINJA
  - PPLUG. Clipes finais de fixação para o Ninja.

PÁGINA 4: CABOS E GUIAS (TRADICIONAIS)
* CABO FIXAÇÃO ERGOTEC (Punho)
  - ETG00. Mola de liberação rápida. Ergonômico.
* CABO PARA GUIA REMOVÍVEL (Punho Inox)
  - PR000. Aço inoxidável com borracha. Clipes curvos nas pontas.
* GUIA REMOVÍVEL (Canal de Inox)
  - NE250 (25cm) / NE350 (35cm) / NE450 (45cm).
  - Aço inox, acompanha borracha macia.
* ADAPTADOR ANGULAR ERGOTEC SWIVEL-LOC
  - LS000 (0 graus) / LA000 (30 graus).
  - Para hastes telescópicas. Alcança ângulos difíceis.
* LÂMINAS DE BORRACHA
  - RT920 (92cm): Borracha Padrão.
  - RR45G (45cm): Borracha Verde Power (Deslizamento superior, durabilidade).
  - RG92H (92cm): Borracha Hard (Alta Temperatura/Climas quentes).

PÁGINA 5: EXTENSÕES TELESCÓPICAS
* EXTENSÃO TELESCÓPICA (ALUMÍNIO)
  - EZ250 (2,5m / 2 partes).
  - EZ370 (3,7m / 2 partes).
  - ED600 (6,0m / 3 partes).
  - ED750 (7,5m / 3 partes).
  - Travas ErgoTec, punhos Sure Grip.
* PONTEIRA ERGOTEC (CONE)
  - NCAN0. Adaptador de ponta com trava de segurança ("Click").

PÁGINA 6: SUPORTES E MOPS PARA VIDROS
* SUPORTE DE ALUMÍNIO PARA MOP (Pad Holder)
  - PHH20 (20cm). Velcro. Giratório.
* SUPORTE MANUAL ALUMÍNIO (Mão)
  - PHD20 (20cm).
* MOPS (REFIL) 20CM:
  - PHW20 (Lavagem): Fibras longas, sujeira pesada.
  - PHP20 (Polimento): Remoção de pó/graxa.
  - PHL20 (Limpeza): Microfibra padrão.
* ADAPTADOR HIFLO EURO THREAD
  - AFAET. Adaptador de rosca para conectar suportes a hastes.

PÁGINA 7: SISTEMA STINGRAY (VIDROS INTERNOS)
* APARELHO PORTÁTIL STINGRAY (Triângulo)
  - SRHBT. Bocal de spray protegido. Formato triangular.
* CABO EXTENSOR STINGRAY
  - SREPS (63cm) / SREPL (1,24m). Alumínio leve. Botão de ativação fácil.
* MOP MICROFIBRA STINGRAY
  - SRPD1. Triangular com elásticos. Lavagem e limpeza.
* FRASCO (BAG) PARA SOLUÇÃO
  - SRBT1. 150ml.

PÁGINAS 8-11: SISTEMA nLITE (ÁGUA PURA)
* FILTRO HYDROPOWER (Deionizador)
  - UHP3C. Tanque com resina.
  - HPB24: Refil de Resina (6L).
* HASTES nLITE (POLES):
  - CARBON 24K: CF86G (8,6m) / CF33G (3,2m). Fibra de carbono premium. Ultraleve.
  - HIMOD CARBON: UC35G (3,5m). Rigidez extrema.
  - ALUMÍNIO MASTER: AN60G (6m).
* ESCOVAS nLITE:
  - NLR40 (40cm) / NLR27 (27cm). Escovas de limpeza.
  - NUH41 (41cm). Híbrida para limpeza pesada.
  - NGS15 (15cm) / NGS30 (30cm). Adaptador angular.
* ACESSÓRIOS nLITE:
  - PWH35/45: Powerpad Handle.
  - NL25G / DLS25: Mangueiras (25m).
  - FTGOS / NLG20: Adaptadores angulares.

PÁGINA 13: RASPADORES E LÂMINAS (SAFETY & LEVES)
* ERGOTEC NINJA SCRAPER (RASPADOR 2 EM 1)
  - EN100 (10cm).
  - Cabeça ajustável 0° (mão) a 30° (cabo).
  - **Lâminas Compatíveis:** TR100 (Inox).
* ERGOTEC SCRAPER
  - EG100 (10cm) / EG150 (15cm).
  - Cabo leve, capa protetora.
  - **Lâminas Compatíveis:** TR100 (10cm) / TR150 (15cm).
* RASPADOR DE SEGURANÇA (SAFETY)
  - SR040 (4cm). Retrátil de inox.
  - **Lâmina Compatível:** SRB30 (Inox).
* MINI RASPADOR
  - SR500 (4cm). Plástico. Lâmina SRB30.

PÁGINA 14: RASPADORES PESADOS E DE CHAPA
* RASPADOR MULTIUSO 10CM
  - SH00C (10cm). Cabo curto ergonômico.
  - **Lâminas:** RB10C (Carbono) / RB100 (Inox).
* RASPADOR PESADO COM CABO (LONGO)
  - LH12C (10cm). Cabo de 1,4m aço. Cabeça angular.
  - **Lâminas:** RB10C / RB100.
* RASPADOR DE CHAPA 10CM
  - GS100. Punho robusto.
  - **Lâminas:** RB10C / RB100.
* LIMPADOR DE CHAPA (GRILL) 20CM
  - GSH40. Resistente a calor (350°C).
* RASPADOR MAX 10CM
  - STMAX. Cabo longo leve.
  - **Lâminas:** RB10C / RB100.

PÁGINA 16: PANOS MICROFIBRA
* MICROFIBRA 1500 LAVAGENS (40x38cm):
  - MF40B (Azul), MF40R (Vermelho), MF40J (Amarelo), MF400 (Verde).
  - Alta absorção, resistente.
* MICROFIBRA 200 LAVAGENS (40x40cm):
  - ME40B (Azul), ME40R (Vermelho), ME40J (Amarelo), ME400 (Verde).
  - Custo benefício.
* MICROFIBRA NINJA (MN40U): Cinza, abrasiva nos cantos.
* MICROFIBRA VIDROS (MF40L): Lisa, sem fiapos.

PÁGINA 17: CINTOS E BALDES
* THE BELT NINJA (UB000): Cinto ferramentas.
* CINTO ERGOTEC (BSTBT): Acolchoado.
* BOLSA ERGOTEC (BSPOU): 3 compartimentos.
* BALDE NINJA (BB020): Retangular para rodo.
* SPRAYER ON A BELT (SOABG): Pulverizador de cinto 1L.
* BALDE 12L (QB12B): Retangular compacto.

PÁGINA 18: REMOÇÃO DE PÓ (ALTO ACESSO)
* LIMPADOR FLEXÍVEL STARDUSTER (PXD7G): 75cm, plano.
* REFIL STARDUSTER: PS10W (Descartável) / PM05W (Lavável).
* MÃO MECÂNICA (PEGADOR): NN400 (45cm), NN900 (90cm), NN140 (1,4m).
* ESCOVA OVAL (WALB0): Paredes e ventiladores.
* ESCOVA TUBOS (PIPE0): Curva.
* ESPANADOR TEIAS (COBW0): Redondo.

PÁGINA 19: SUPORTE P/ MOP PISO E RODOS
* ARMAÇÃO MOP SMARTCOLOR (SV40G): 45cm.
* RODO COM REFORÇO (HM750/HM550): Borracha dupla.
* RODO SEM REFORÇO (MW450/MW550): Espuma.
* RODO SANITÁRIO COM ESCOVA (PB45A): Dupla função.

PÁGINA 20: CABOS DE ALUMÍNIO (PISO)
* EXTENSÃO 1,4M (AL140): Ponta cônica.
* CABO ROSCA ACME (AL14A): 1,47m. Zinco.
* CABO SECCIONADO (MS14G): 1,40m.

PÁGINA 21: UNGER EXCELLA (SISTEMA PISO)
* KIT EXCELLA 45CM (EFKT1): Cabo S com reservatório, mop e balde.
* MOP EXCELLA ACABAMENTO (EF40F): 51cm.
* MOCHILA EXCELLA (EFBAP): 5 Litros.

PÁGINA 22: ACESSÓRIOS BALDE
* BALDE 15L (QB220).
* TAMPA (QB080).
* RODÍZIOS (QB070).
* ESPREMEDOR METAL (QS010).

==============================================================================
TABELAS TÉCNICAS E COMPATIBILIDADE (RIGOROSO)
==============================================================================

1. TABELA DE LÂMINAS DE REPOSIÇÃO:
- RB100 (Inox 10cm) / RB10C (Carbono 10cm) -> Compatíveis com: EN100, GS100, SH00C, STMAX, LH12C.
- RB150 (Inox 15cm) / RB15C (Carbono 15cm) -> Compatíveis com: EN150.
- TR100 (Inox 10cm) -> Compatíveis com: EG100, EN100.
- TR150 (Inox 15cm) -> Compatíveis com: EG150.
- SRB30 (Inox 4cm) -> Compatíveis com: SR040, SR500.

2. ENCAIXES DE CABOS:
- Ergotec Locking Cone (Clique): Para Rodos Ninja, ErgoTec e Lavadores. (Segurança em altura).
- Rosca ACME: Para espanadores StarDuster e Cabos AL14A.
- Press Fit (Pressão): Para ferramentas universais.
`;

export const getCatalogContext = (type: CatalogType): string => {
  const baseInstructions = `
VOCÊ É UM ASSISTENTE VIRTUAL TÉCNICO ESPECIALISTA EM FERRAMENTAS DE LIMPEZA PROFISSIONAL.
Sua missão é consultar o catálogo técnico abaixo e recomendar a ferramenta exata.

DIRETRIZES DE PERSONA:
- NUNCA chame o usuário de "vendedor". Trate-o como "GESTOR".
- Seja técnico e consultivo.
- Se a descrição for vaga, GERE UM FORMULÁRIO DE CLARIFICAÇÃO.
`;

  if (type === 'el_castor') {
    return `${baseInstructions}\n\nCONTEXTO: APENAS PRODUTOS EL CASTOR.\n${EL_CASTOR_CONTEXT}`;
  }
  if (type === 'unger') {
    return `${baseInstructions}\n\nCONTEXTO: APENAS PRODUTOS UNGER.\n${UNGER_CONTEXT}`;
  }
  return `${baseInstructions}\n\nCONTEXTO: PRODUTOS EL CASTOR E UNGER (COMPARATIVO).\n${EL_CASTOR_CONTEXT}\n\n${UNGER_CONTEXT}`;
};
