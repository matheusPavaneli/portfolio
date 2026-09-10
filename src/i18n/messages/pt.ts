import type { Messages } from "./en";

export const pt: Messages = {
  meta: {
    title: "Matheus Pavaneli — engenheiro fullstack sênior e forward-deployed AI engineer",
    description:
      "Pego o que está quebrado, o que foi abandonado e o que ainda não existe — inclusive os sistemas de LLM que uma empresa está colocando em produção pela primeira vez — e devolvo uma arquitetura, com o número que ela moveu.",
    ogAlt: "Matheus Pavaneli — dossiê de engenharia",
  },

  a11y: {
    skipToContent: "Ir para o dossiê",
    mainNav: "Seções",
    openMenu: "Seções",
    language: "Idioma",
    toLight: "Clarear",
    toDark: "Escurecer",
    externalLink: "abre em nova aba",
  },

  nav: {
    index: "Índice",
    cases: "Casos",
    method: "Método",
    record: "Registro",
    contact: "Contato",
  },

  masthead: {
    role: "Engenheiro fullstack sênior · forward-deployed AI engineer",
    headline: "Me dê o sistema que ninguém quer assumir.",
    lede: "Pego o que está quebrado, o que foi abandonado e o que ainda não existe — inclusive os sistemas de LLM que uma empresa está colocando em produção pela primeira vez — e devolvo uma arquitetura, com o número que ela moveu.",
    readingsLabel: "Três deles",
    cta: "Começar uma conversa",
    location: "Maringá, Brasil (UTC-3) · remoto",
    scroll: "O dossiê inteiro está abaixo",
  },

  index: {
    eyebrow: "O dossiê",
    title: "Oito casos",
    lede: "Cada um deles é o sistema de outra pessoa, antes e depois.",
    colCase: "Caso",
    colReading: "Leitura",
    colYear: "Ano",
  },

  reading: {
    before: "antes",
    after: "depois",
    heldAt: "parado em",
    limit: "limite",
    count: "contagem",
    kindDelta: "delta",
    kindCeiling: "teto",
    kindCount: "contagem",
  },

  cases: {
    eyebrow: "Os casos",
    title: "O que cada um foi, de fato.",
    stack: "Stack",
    orchestration: {
      name: "Sistemas de LLM em produção",
      org: "Bernoulli Educação · EdTech, mais de 100 mil alunos",
      kicker: "A primeira feature de IA da empresa, construída para que nenhum fornecedor sozinho consiga derrubá-la",
      body: "Desenhei e entreguei a arquitetura de orquestração: um orquestrador roteando requisições entre agentes especializados, failover de provider para que a indisponibilidade de um fornecedor não derrube a feature, e uma camada MongoDB carregando retrieval de documentos, logs de execução dos agentes e um cache de resposta que corta o custo de inferência repetida. O provider não foi escolhido por reputação — cinco modelos foram testados em custo, latência e qualidade de saída, e os números escolheram um.",
      caption: "modelos avaliados em custo, latência e qualidade antes de um ser escolhido",
    },
    query: {
      name: "A query de dois segundos",
      org: "Bernoulli Educação",
      kicker: "O planner não estava lento. As estatísticas dele estavam velhas.",
      body: "Uma query central levava dois segundos e ninguém sabia dizer por quê. O EXPLAIN ANALYZE disse na cara: a divergência entre linhas estimadas e reais expunha um sequential scan escolhido no lugar de um índice que já existia. Atualizei as estatísticas, restaurei o uso correto do índice, ajustei os limiares de autovacuum para não voltar e documentei o método para o time — a correção vale menos do que a segunda vez em que alguém acha sozinho.",
      caption: "na query que vinha levando dois segundos",
    },
    seal: {
      name: "Seal",
      org: "Open-core · modo local sob Apache-2.0 no npm",
      kicker: "Aprovação como API: human-in-the-loop como infraestrutura, não como mudança de código",
      body: "Um gateway de aprovação para agentes de IA. Um proxy MCP intercepta tools/call e segura as chamadas de risco até um humano assinar, com um motor de política declarativo — aprovação por exceção, não por padrão — e elicitation e sampling relaiados nos dois sentidos. Cada decisão entra em uma trilha de auditoria encadeada por hash, verificável offline. O código do agente não muda para adotar: o proxy é a integração.",
      caption: "linhas de código do agente alteradas para colocar um humano no circuito",
    },
    nanquim: {
      name: "Nanquim",
      org: "SDK de checkout Pix · agnóstico de provider",
      kicker: "O mercado brasileiro entrega SDK de backend em sete linguagens e para no navegador",
      body: "Um checkout Pix embutível que roda no domínio do próprio lojista, dentro de um Shadow DOM, sem nenhuma dependência de runtime no navegador e sem requisição além do backend do lojista. Nenhuma credencial chega ao bundle, porque o SDK recebe funções e não chaves. Não existe onSuccess, porque a verdade de um pagamento é um webhook assinado e nunca o navegador. Estados ilegais são irrepresentáveis e o valor prometido é um invariante.",
      caption: "gzipado — um tamanho que o build se recusa a ultrapassar, não um número no README",
    },
    anchor: {
      name: "Anchor",
      org: "SaaS B2B · inteligência de retenção para agências de performance",
      kicker: "O churn aparece nas contas de anúncio semanas antes de alguém cancelar",
      body: "Uma plataforma que pontua a saúde do cliente a partir de sinais do Google Ads e do Meta Ads, aprende os pesos por cliente em vez de aplicar um modelo único a todo mundo, e escreve um brief semanal que o gestor de contas consegue executar. Multi-tenant com row-level security, cobrança via Stripe com gates de plano, e observabilidade desde o primeiro deploy — não depois do primeiro incidente.",
      caption: "de antecedência antes de um cliente cancelar",
    },
    artefacts: {
      name: "technology-art",
      org: "Ensaio conduzido por scroll · WebGL",
      kicker: "Oito artefatos, 3,3 milhões de anos, uma nuvem de pontos remontada em cada um deles",
      body: "Uma história da tecnologia contada por oito objetos, da pedra lascada às máquinas que estão aprendendo a julgar. Uma única nuvem de pontos WebGL é remontada na forma de cada era, o intervalo entre duas eras define a altura do silêncio antes dela, e um único acento percorre o espectro conforme se lê. As camadas pesadas esperam o primeiro movimento do leitor — é por isso que o artefato sobrevive à nota.",
      caption: "de Lighthouse no mobile, contra um teto de 100 — e 100 no desktop",
    },
    dashboard: {
      name: "O dashboard abandonado",
      org: "Jorrovi Calçados · sistemas financeiros e administrativos",
      kicker: "Herdado sem repasse, sem documentação, e com números que o negócio já estava usando para decidir",
      body: "Relatórios de receita, custo e fluxo de caixa usados do chão de operação até os donos, entregues sem nada junto. Fiz engenharia reversa, avaliei a dívida e defini a estratégia de migração sozinho; depois estabilizei em três frentes: matei os crashes, rastreei e corrigi os números que vinham sendo reportados errados, e cortei o tempo de carregamento. A migração correu de forma incremental com o sistema em uso diário — sem congelamento de features, sem reescrita big-bang, sem interrupção no fechamento financeiro. Promovido em seis meses.",
      caption: "migradas para React ao longo de quinze meses, com o sistema no ar o tempo todo",
    },
    image: {
      name: "A imagem de 1,9 GB",
      org: "Freelance · Workana",
      kicker: "Ninguém tinha documentado por que era tão grande, então o primeiro trabalho foi descobrir",
      body: "Uma imagem Docker de frontend que ninguém queria encostar, sem nenhuma documentação anterior. Diagnostiquei a causa em vez de cortar camadas no escuro e reconstruí o pipeline em multi-stage builds. Artefatos menores derrubaram custo de registry e de transferência em mais de 60%, além do tempo de build.",
      caption: "uma redução de 89%, de um pipeline reconstruído e não aparado",
    },
  },

  method: {
    eyebrow: "Método",
    title: "O que eu faço quando me entregam um sistema.",
    lede: "Seis regras, cada uma paga por um caso acima.",
    items: {
      instrument: {
        rule: "Leia o instrumento antes de chutar.",
        evidence: "O EXPLAIN ANALYZE dizia que o plano estava errado. Ninguém tinha olhado.",
      },
      vendor: {
        rule: "Assuma que o fornecedor cai.",
        evidence: "Failover de provider, para que uma queda não derrube a feature.",
      },
      gate: {
        rule: "Coloque o limite dentro do build.",
        evidence: "12,14 kB é um gate que a CI aplica, não uma afirmação no README.",
      },
      live: {
        rule: "Migre com o sistema no ar.",
        evidence: "Mais de 40 telas em quinze meses, com o sistema em uso diário.",
      },
      standard: {
        rule: "Escreva o padrão.",
        evidence: "Um padrão de code review hoje aplicado em todo serviço de backend.",
      },
      illegal: {
        rule: "Torne estados ilegais irrepresentáveis.",
        evidence: "Sem onSuccess no navegador: a verdade de um pagamento é um webhook assinado.",
      },
    },
  },

  record: {
    eyebrow: "Registro",
    title: "O resto, de forma compacta.",
    rolesLabel: "Cargos",
    skillsLabel: "Competências",
    skillGroups: {
      languages: "Linguagens e frameworks",
      ai: "Engenharia de IA",
      data: "Dados e mensageria",
      cloud: "Cloud e infraestrutura",
      architecture: "Arquitetura e APIs",
    },
    reposLabel: "Outros repositórios",
    languagesLabel: "Idiomas",
    educationLabel: "Formação",
    roles: {
      bernoulli: {
        title: "Software Engineer",
        detail:
          "Arquitetura de orquestração de LLM. Releases semanais em lote viraram deploy contínuo diário com suítes automatizadas. Autor do padrão de code review do time.",
      },
      eicode: {
        title: "Senior Fullstack Engineer · promovido de pleno",
        detail:
          "Dono técnico único de uma plataforma social greenfield: 12 módulos de feature, nenhum sênior acima de mim, e a direção técnica que outros três engenheiros seguiram. Engine de recomendação escrita do zero — TF-IDF com similaridade de cosseno, sem serviço de ML de terceiros. Líder técnico em contas internacionais, em inglês.",
      },
      freelance: {
        title: "Senior Fullstack Engineer · 5+ contratos simultâneos",
        detail:
          "Entregues em paralelo a posições full-time. Autenticação multi-provider construída do zero — e-mail, Google e Microsoft, 2FA, recuperação — sem nenhum incidente de auth reportado após o lançamento. Cobrança Stripe em produção para três plataformas, com webhooks idempotentes para que retentativas nunca cobrassem duas vezes.",
      },
      jorrovi: {
        title: "Junior Fullstack Engineer · promovido de trainee · meio período",
        detail:
          "O dashboard financeiro abandonado, acima. TypeScript adotado em toda a base após defender a decisão com stakeholders não técnicos, e deploys Kubernetes automatizados em dev, staging e produção.",
      },
    },
    repos: {
      depguard:
        "Pontuação preventiva de risco em dependências npm: metadados do registry, lifecycle scripts, avisos OSV e heurísticas de typosquatting.",
      envValidator:
        "Valida process.env na inicialização contra um schema tipado, coletando todos os erros de uma vez, com inferência e sem dependências.",
      azthorize: "API de autenticação com criptografia AES, construída para throughput.",
    },
    education: "Bacharelado em Engenharia de Software · Cruzeiro do Sul · em andamento, previsão 2029",
    languages: "Português nativo · Inglês C1 — usado diariamente em produção: cerimônias, code review, documentação técnica.",
  },

  contact: {
    eyebrow: "Contato",
    title: "O que você está construindo?",
    lede: "Aberto a posições de engenharia e a contratos em que alguém precisa assumir uma feature de IA de ponta a ponta. Respondo em até um dia.",
    emailLabel: "E-mail",
    formName: "Nome",
    formEmail: "E-mail",
    formMessage: "Mensagem",
    formNamePlaceholder: "Seu nome",
    formEmailPlaceholder: "voce@empresa.com",
    formMessagePlaceholder: "Qual é o sistema, e o que há de errado com ele?",
    formSend: "Enviar",
    formSending: "Enviando…",
    formSuccess: "Enviado. Respondo nesse endereço em até um dia.",
    formErrorNetwork: "Isso não chegou até mim — a requisição falhou antes de chegar. Escreva para matheuspavaneli@proton.me e cai no mesmo lugar.",
    formErrorInvalid: "Confira o campo destacado: preciso de um nome, um e-mail que funcione e uma mensagem.",
    formErrorEmail: "Esse e-mail não vai chegar até você — confira antes de enviar.",
    formDisabled: "O formulário não está configurado neste deploy. O e-mail funciona e chega na mesma caixa.",
    formDisabledCta: "Escrever para matheuspavaneli@proton.me",
    required: "obrigatório",
  },

  footer: {
    built: "Feito em Next.js como export estático. Paleta gerada e verificada em contraste antes de ser escrita.",
    source: "Código",
  },
};
