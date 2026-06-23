import { useEffect, useState } from "react";
import {
  ESTADOS_BR,
  hasErrors,
  isValidImageUrl,
  normalizePhotoUrls,
  sanitizeAnuncioForm,
  validateAnuncioForm,
} from "../utils/validations";

const CATEGORIAS = [
  { value: "aluguel", label: "Imóvel para aluguel" },
  { value: "venda", label: "Imóvel para venda" },
  { value: "produto", label: "Produto" },
  { value: "servico", label: "Serviço" },
];

const TAMANHOS = [
  { value: "pequeno", label: "Pequeno" },
  { value: "medio", label: "Médio" },
  { value: "grande", label: "Grande" },
];

const MODALIDADES = [
  { value: "presencial", label: "Presencial" },
  { value: "remoto", label: "Remoto" },
  { value: "hibrido", label: "Híbrido" },
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
  tamanho: "",
  modalidade: "",
  vat: false,
  imagens: [],
  fotoUrl: "",
};

function buildInitialForm(values = {}) {
  return {
    ...initialForm,
    ...values,
    preco: values.preco ?? "",
    negociavel: Boolean(values.negociavel),
    vat: Boolean(values.vat),
    imagens: normalizePhotoUrls(values.imagens),
    fotoUrl: "",
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AnuncioForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel = "Publicar anúncio",
}) {
  const [form, setForm] = useState(() => buildInitialForm(initialValues));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(buildInitialForm(initialValues));
    setErrors({});
  }, [initialValues]);

  function set(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "categoria") {
        if (!["aluguel", "venda", "produto"].includes(value)) next.tamanho = "";
        if (value !== "servico") next.modalidade = "";
      }

      return next;
    });
    setErrors((current) => ({ ...current, [field]: undefined, imagens: undefined }));
  }

  async function handleImagens(event) {
    const selecionados = Array.from(event.target.files ?? []);
    const invalidos = selecionados.filter((file) => !file.type.startsWith("image/"));
    const restantes = Math.max(0, 5 - form.imagens.length);
    const validos = selecionados.filter((file) => file.type.startsWith("image/")).slice(0, restantes);

    if (invalidos.length > 0) {
      setErrors((current) => ({ ...current, imagens: "Selecione apenas arquivos de imagem." }));
      event.target.value = "";
      return;
    }

    if (restantes === 0) {
      setErrors((current) => ({ ...current, imagens: "Você pode adicionar até 5 fotos." }));
      event.target.value = "";
      return;
    }

    const dataUrls = await Promise.all(validos.map(readFileAsDataUrl));
    setForm((current) => ({ ...current, imagens: [...current.imagens, ...dataUrls].slice(0, 5) }));
    setErrors((current) => ({ ...current, imagens: undefined }));
    event.target.value = "";
  }

  function addFotoUrl() {
    const fotoUrl = form.fotoUrl.trim();

    if (!fotoUrl) return;

    if (!isValidImageUrl(fotoUrl)) {
      setErrors((current) => ({ ...current, fotoUrl: "Informe uma URL de imagem válida." }));
      return;
    }

    if (form.imagens.length >= 5) {
      setErrors((current) => ({ ...current, fotoUrl: "Você pode adicionar até 5 fotos." }));
      return;
    }

    setForm((current) => {
      if (current.imagens.includes(fotoUrl)) {
        return { ...current, fotoUrl: "" };
      }

      return { ...current, imagens: [...current.imagens, fotoUrl], fotoUrl: "" };
    });
    setErrors((current) => ({ ...current, fotoUrl: undefined, imagens: undefined }));
  }

  function removeImagem(index) {
    setForm((current) => ({
      ...current,
      imagens: current.imagens.filter((_, itemIndex) => itemIndex !== index),
    }));
    setErrors((current) => ({ ...current, imagens: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateAnuncioForm(form);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    onSubmit?.(sanitizeAnuncioForm(form));
  }

  const mostrarTamanho = ["aluguel", "venda", "produto"].includes(form.categoria);
  const mostrarModalidade = form.categoria === "servico";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Título" error={errors.titulo} required>
        <input
          type="text"
          placeholder="Ex: Apartamento 2 quartos próximo ao centro"
          value={form.titulo}
          onChange={(event) => set("titulo", event.target.value)}
          className={input(errors.titulo)}
          maxLength={100}
          aria-invalid={Boolean(errors.titulo)}
        />
      </Field>

      <Field label="Categoria" error={errors.categoria} required>
        <select
          value={form.categoria}
          onChange={(event) => set("categoria", event.target.value)}
          className={input(errors.categoria)}
          aria-invalid={Boolean(errors.categoria)}
        >
          <option value="">Selecione...</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria.value} value={categoria.value}>
              {categoria.label}
            </option>
          ))}
        </select>
      </Field>

      {mostrarTamanho && (
        <Field label="Tamanho" error={errors.tamanho}>
          <select
            value={form.tamanho}
            onChange={(event) => set("tamanho", event.target.value)}
            className={input(errors.tamanho)}
          >
            <option value="">Selecione...</option>
            {TAMANHOS.map((tamanho) => (
              <option key={tamanho.value} value={tamanho.value}>
                {tamanho.label}
              </option>
            ))}
          </select>
        </Field>
      )}

      {mostrarModalidade && (
        <Field label="Modalidade" error={errors.modalidade}>
          <select
            value={form.modalidade}
            onChange={(event) => set("modalidade", event.target.value)}
            className={input(errors.modalidade)}
          >
            <option value="">Selecione...</option>
            {MODALIDADES.map((modalidade) => (
              <option key={modalidade.value} value={modalidade.value}>
                {modalidade.label}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Descrição" error={errors.descricao} required>
        <textarea
          placeholder="Descreva o seu anúncio com detalhes: estado de conservação, medidas, condições, etc."
          value={form.descricao}
          onChange={(event) => set("descricao", event.target.value)}
          className={`${input(errors.descricao)} resize-none`}
          rows={4}
          maxLength={1500}
          aria-invalid={Boolean(errors.descricao)}
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
            step="0.01"
            value={form.preco}
            onChange={(event) => set("preco", event.target.value)}
            className={input(errors.preco)}
            aria-invalid={Boolean(errors.preco)}
          />
        </Field>
        <div className="flex flex-col justify-end gap-2 pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.negociavel}
              onChange={(event) => set("negociavel", event.target.checked)}
              className="w-4 h-4 rounded accent-gray-800"
            />
            <span className="text-sm text-gray-600">Preço negociável</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.vat}
              onChange={(event) => set("vat", event.target.checked)}
              className="w-4 h-4 rounded accent-gray-800"
            />
            <span className="text-sm text-gray-600">Possui nota fiscal</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Cidade" error={errors.cidade} required>
          <input
            type="text"
            placeholder="Ex: Juazeiro do Norte"
            value={form.cidade}
            onChange={(event) => set("cidade", event.target.value)}
            className={input(errors.cidade)}
            aria-invalid={Boolean(errors.cidade)}
          />
        </Field>
        <Field label="Estado" error={errors.estado} required>
          <select
            value={form.estado}
            onChange={(event) => set("estado", event.target.value)}
            className={input(errors.estado)}
            aria-invalid={Boolean(errors.estado)}
          >
            <option value="">UF</option>
            {ESTADOS_BR.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="WhatsApp para contato" error={errors.contato} required>
        <input
          type="tel"
          placeholder="(88) 99999-0000"
          value={form.contato}
          onChange={(event) => set("contato", event.target.value)}
          className={input(errors.contato)}
          aria-invalid={Boolean(errors.contato)}
        />
      </Field>

      <div className="space-y-3">
        <Field label="URL da foto" error={errors.fotoUrl}>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              value={form.fotoUrl}
              onChange={(event) => set("fotoUrl", event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addFotoUrl();
                }
              }}
              className={input(errors.fotoUrl)}
              aria-invalid={Boolean(errors.fotoUrl)}
            />
            <button
              type="button"
              onClick={addFotoUrl}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
            >
              Adicionar
            </button>
          </div>
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
          {errors.imagens && <p className="text-xs text-red-500 mt-1">{errors.imagens}</p>}

          {form.imagens.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {form.imagens.map((src, index) => (
                <div key={`${src}-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImagem(index)}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80"
                    aria-label="Remover foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Salvando..." : submitLabel}
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
