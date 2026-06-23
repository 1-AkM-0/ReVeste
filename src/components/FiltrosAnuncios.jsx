const CATEGORIAS = [
  { value: "aluguel", label: "Aluguel"  },
  { value: "venda",   label: "Venda"    },
  { value: "produto", label: "Produto"  },
  { value: "servico", label: "Serviço"  },
];

const TAMANHOS = [
  { value: "pequeno", label: "Pequeno"  },
  { value: "medio",   label: "Médio"    },
  { value: "grande",  label: "Grande"   },
];

const MODALIDADES = [
  { value: "presencial", label: "Presencial" },
  { value: "remoto",     label: "Remoto"     },
  { value: "hibrido",    label: "Híbrido"    },
];

const VATS = [
  { value: "com_vat", label: "Com nota fiscal" },
  { value: "sem_vat", label: "Sem nota fiscal" },
];

const ORDENS = [
  { value: "recente",     label: "Mais recentes"  },
  { value: "menor_preco", label: "Menor preço"    },
  { value: "maior_preco", label: "Maior preço"    },
];

function GrupoFiltro({ titulo, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{titulo}</p>
      {children}
    </div>
  );
}

function Chips({ opcoes, valor, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {opcoes.map((op) => {
        const ativo = valor === op.value;
        return (
          <button
            key={op.value}
            type="button"
            onClick={() => onChange(ativo ? "" : op.value)}
            aria-pressed={ativo}
            className={[
              "px-3 py-1 text-xs rounded-full border transition-all",
              ativo
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
            ].join(" ")}
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

  const mostrarModalidade = !filtros.categoria || filtros.categoria === "servico";
  const mostrarTamanho    = !filtros.categoria || ["aluguel", "venda", "produto"].includes(filtros.categoria);

  return (
    <aside
      aria-label="Filtros"
      className={[
        isLateral
          ? "bg-white border border-gray-100 rounded-2xl p-5 space-y-5 self-start sticky top-4"
          : "bg-white border border-gray-100 rounded-2xl p-4",
      ].join(" ")}
    >

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          Filtros
          {temFiltrosAtivos && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-gray-900 text-white rounded-full">
              {quantidadeFiltrosAtivos}
            </span>
          )}
        </span>
        {temFiltrosAtivos && (
          <button
            type="button"
            onClick={limpar}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
          >
            Limpar tudo
          </button>
        )}
      </div>

      <div className={isLateral ? "space-y-5" : "flex flex-wrap gap-6"}>
        <GrupoFiltro titulo="Categoria">
          <Chips
            opcoes={CATEGORIAS}
            valor={filtros.categoria}
            onChange={(v) => {
              setFiltro("categoria", v);
              setFiltro("tamanho", "");
              setFiltro("modalidade", "");
            }}
          />
        </GrupoFiltro>

        {mostrarTamanho && (
          <GrupoFiltro titulo="Tamanho">
            <Chips
              opcoes={TAMANHOS}
              valor={filtros.tamanho}
              onChange={(v) => setFiltro("tamanho", v)}
            />
          </GrupoFiltro>
        )}

        {mostrarModalidade && (
          <GrupoFiltro titulo="Modalidade">
            <Chips
              opcoes={MODALIDADES}
              valor={filtros.modalidade}
              onChange={(v) => setFiltro("modalidade", v)}
            />
          </GrupoFiltro>
        )}

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
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 bg-white"
            disabled={!!filtros.busca}
            title={filtros.busca ? "Ordenação desativada durante busca por texto (usa relevância)" : ""}
          >
            {ORDENS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {filtros.busca && (
            <p className="text-xs text-gray-400 mt-1">Ordenando por relevância da busca.</p>
          )}
        </GrupoFiltro>
      </div>
    </aside>
  );
}
