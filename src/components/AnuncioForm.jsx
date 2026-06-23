import { useState } from "react";

const CATEGORIAS = [
  { value: "aluguel", label: "Imóvel para aluguel" },
  { value: "venda", label: "Imóvel para venda" },
  { value: "produto", label: "Produto" },
  { value: "servico", label: "Serviço" },
];

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const initialForm = {
  titulo: "",
  categoria: "",
  descricao: "",
  preco: "",
  negociavel: false,
  contato: "",
  cidade: "",
  estado: "",
  imagens: [],
};

export default function AnuncioForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState([]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleImagens(e) {
    const files = Array.from(e.target.files).slice(0, 5);
    setForm((f) => ({ ...f, imagens: files }));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function removeImagem(index) {
    const novas = form.imagens.filter((_, i) => i !== index);
    setForm((f) => ({ ...f, imagens: novas }));
    setPreviews(novas.map((f) => URL.createObjectURL(f)));
  }

  function validate() {
    const errs = {};
    if (!form.titulo.trim()) errs.titulo = "Informe um título.";
    if (!form.categoria) errs.categoria = "Selecione uma categoria.";
    if (!form.descricao.trim()) errs.descricao = "Descreva o anúncio.";
    if (!form.contato.trim()) errs.contato = "Informe um contato.";
    if (!form.cidade.trim()) errs.cidade = "Informe a cidade.";
    if (!form.estado) errs.estado = "Selecione o estado.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit?.(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Título" error={errors.titulo} required>
        <input
          type="text"
          placeholder="Ex: Apartamento 2 quartos próximo ao centro"
          value={form.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          className={input(errors.titulo)}
          maxLength={100}
        />
      </Field>

      <Field label="Categoria" error={errors.categoria} required>
        <select
          value={form.categoria}
          onChange={(e) => set("categoria", e.target.value)}
          className={input(errors.categoria)}
        >
          <option value="">Selecione...</option>
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Descrição" error={errors.descricao} required>
        <textarea
          placeholder="Descreva o seu anúncio com detalhes: estado de conservação, medidas, condições, etc."
          value={form.descricao}
          onChange={(e) => set("descricao", e.target.value)}
          className={input(errors.descricao) + " resize-none"}
          rows={4}
          maxLength={1500}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {form.descricao.length}/1500
        </p>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preço (R$)" error={errors.preco}>
          <input
            type="number"
            placeholder="0,00"
            min={0}
            value={form.preco}
            onChange={(e) => set("preco", e.target.value)}
            className={input(errors.preco)}
          />
        </Field>
        <div className="flex flex-col justify-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.negociavel}
              onChange={(e) => set("negociavel", e.target.checked)}
              className="w-4 h-4 rounded accent-gray-800"
            />
            <span className="text-sm text-gray-600">Preço negociável</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Cidade" error={errors.cidade} required>
          <input
            type="text"
            placeholder="Ex: Juazeiro do Norte"
            value={form.cidade}
            onChange={(e) => set("cidade", e.target.value)}
            className={input(errors.cidade)}
          />
        </Field>
        <Field label="Estado" error={errors.estado} required>
          <select
            value={form.estado}
            onChange={(e) => set("estado", e.target.value)}
            className={input(errors.estado)}
          >
            <option value="">UF</option>
            {ESTADOS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="WhatsApp para contato" error={errors.contato} required>
        <input
          type="tel"
          placeholder="(88) 99999-0000"
          value={form.contato}
          onChange={(e) => set("contato", e.target.value)}
          className={input(errors.contato)}
        />
      </Field>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fotos <span className="text-gray-400 font-normal">(até 5)</span>
        </label>
        <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-sm text-gray-500">Clique para selecionar fotos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImagens}
          />
        </label>

        {previews.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImagem(i)}
                  className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Publicando..." : "Publicar anúncio"}
      </button>
    </form>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function input(error) {
  return [
    "w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors",
    error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100",
  ].join(" ");
}
