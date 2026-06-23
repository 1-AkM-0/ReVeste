const CATEGORIAS = [
  { value: "camiseta",  label: "Camiseta"   },
  { value: "calca",     label: "Calça"      },
  { value: "vestido",   label: "Vestido"    },
  { value: "jaqueta",   label: "Jaqueta"    },
  { value: "calcado",   label: "Calçado"    },
  { value: "acessorio", label: "Acessório"  },
];

const TAMANHOS = [
  { value: "pp",  label: "PP"  },
  { value: "p",   label: "P"   },
  { value: "m",   label: "M"   },
  { value: "g",   label: "G"   },
  { value: "gg",  label: "GG"  },
  { value: "xgg", label: "XGG" },
];

const GENEROS = [
  { value: "masculino", label: "Masculino"  },
  { value: "feminino",  label: "Feminino"   },
  { value: "unissex",   label: "Unissex"    },
  { value: "infantil",  label: "Infantil"   },
];

const VATS = [
  { value: "com_vat", label: "Com nota fiscal" },
  { value: "sem_vat", label: "Sem nota fiscal" },
];

const ORDENS = [
  { value: "recente",     label: "Mais recentes" },
  { value: "menor_preco", label: "Menor preço"   },
  { value: "maior_preco", label: "Maior preço"   },
];

function GrupoFiltro({ titulo, children }) {
  return (
    <div className="filtro-grupo">
      <p>{titulo}</p>
      {children}
    </div>
  );
}

function Chips({ opcoes, valor, onChange }) {
  return (
    <div className="chips">
      {opcoes.map((op) => {
        const ativo = valor === op.value;
        return (
          <button
            key={op.value}
            type="button"
            onClick={() => onChange(ativo ? "" : op.value)}
            aria-pressed={ativo}
            className="chip"
          >
            {op.label}
          </button>
        );
      })}
    </div>
  );
}

export default function FiltrosAnuncios({
  filtros,
  setFiltro,
  limpar,
  temFiltrosAtivos,
  quantidadeFiltrosAtivos,
  layout = "lateral",
}) {
  const isLateral = layout === "lateral";

  return (
    <aside
      aria-label="Filtros"
      className={`filtros-aside${isLateral ? " lateral" : ""}`}
    >
      <div className="filtros-header">
        <span className="filtros-title">
          Filtros
          {temFiltrosAtivos && (
            <span className="filtros-count">{quantidadeFiltrosAtivos}</span>
          )}
        </span>

        {temFiltrosAtivos && (
          <button type="button" onClick={limpar} className="filtros-limpar">
            Limpar tudo
          </button>
        )}
      </div>

      <div className={isLateral ? "filtros-body-lateral" : "filtros-body-inline"}>
        <GrupoFiltro titulo="Categoria">
          <Chips
            opcoes={CATEGORIAS}
            valor={filtros.categoria}
            onChange={(v) => setFiltro("categoria", v)}
          />
        </GrupoFiltro>

        <GrupoFiltro titulo="Tamanho">
          <Chips
            opcoes={TAMANHOS}
            valor={filtros.tamanho}
            onChange={(v) => setFiltro("tamanho", v)}
          />
        </GrupoFiltro>

        <GrupoFiltro titulo="Gênero">
          <Chips
            opcoes={GENEROS}
            valor={filtros.genero}
            onChange={(v) => setFiltro("genero", v)}
          />
        </GrupoFiltro>

        <GrupoFiltro titulo="Nota fiscal (VAT)">
          <Chips
            opcoes={VATS}
            valor={filtros.vat}
            onChange={(v) => setFiltro("vat", v)}
          />
        </GrupoFiltro>

        <GrupoFiltro titulo="Ordenar por">
          <select
            value={filtros.ordem}
            onChange={(e) => setFiltro("ordem", e.target.value)}
            className="select-ordem"
            disabled={!!filtros.busca}
            title={filtros.busca ? "Ordenação desativada durante busca por texto (usa relevância)" : ""}
          >
            {ORDENS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {filtros.busca && (
            <p className="field-hint">Ordenando por relevância da busca.</p>
          )}
        </GrupoFiltro>
      </div>
    </aside>
  );
}
