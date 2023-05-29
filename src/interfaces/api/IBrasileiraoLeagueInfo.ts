type FaixaClassificacao = {
  cor: string;
  id: number;
  nome: string;
};

type Equipe = {
  aproveitamento: number;
  derrotas: number;
  empates: number;
  equipe_id: number;
  escudo: string;
  faixa_classificacao: {
    cor: string;
  };
  faixa_classificacao_cor: string;
  gols_contra: number;
  gols_pro: number;
  jogos: number;
  nome_popular: string;
  ordem: number;
  pontos: number;
  saldo_gols: number;
  sigla: string;
  ultimos_jogos: string[];
  variacao: number;
  vitorias: number;
};

type Rodada = {
  atual: number;
  ultima: number;
};

type Edicao = {
  data_fim: string;
  data_inicio: string;
  localizacao: string;
  nome: string;
  regulamento: string;
};

type Jogo = {
  data_realizacao: string;
  equipes: {
    mandante: {
      escudo: string;
      id: number;
      nome_popular: string;
      sigla: string;
    };
    visitante: {
      escudo: string;
      id: number;
      nome_popular: string;
      sigla: string;
    };
  };
  hora_realizacao: string;
  id: number;
  placar_oficial_mandante: number;
  placar_oficial_visitante: number;
  placar_penaltis_mandante: number | null;
  placar_penaltis_visitante: number | null;
  sede: {
    nome_popular: string;
  };
  transmissao: {
    label: string;
    url: string;
  };
};

export type TabelaGE = {
  classificacao: Equipe[];
  rodada: Rodada;
  edicao: Edicao;
  faixas_classificacao: FaixaClassificacao[];
  lista_jogos: Jogo[];
};