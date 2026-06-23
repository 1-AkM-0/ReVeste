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
  { value: "camiseta", label: "Camiseta" },
  { value: "calca", label: "Calça" },
  { value: "vestido", label: "Vestido" },
  { value: "saia", label: "Saia" },
  { value: "shorts", label: "Shorts" },
  { value: "jaqueta", label: "Jaqueta" },
  { value: "calcado", label: "Calçado" },
  { value: "acessorio", label: "Acessório" },
];

const TAMANHOS = [
  { value: "PP", label: "PP" },
  { value: "P", label: "P" },
  { value: "M", label: "M" },
  { value: "G", label: "G" },
  { value: "GG", label: "GG" },
  { value: "XGG", label: "XGG" },
];

const initialForm = {
  titulo: "",
  marca: "",
  categoria: "",
  descricao: "",
  preco: "",
  negociavel: false,
  contato: "",
  cidade: "",
  estado: "",
  tamanho: "",
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
  const [form, setForm]     = useState(() => buildInitialForm(initialValues));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(buildInitialForm(initialValues));
    setErrors({});
  }, [initialValues]);

  function set(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "categoria" && !value) {
        next.tamanho = "";
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field]: undefined, imagens: undefined }));
  }

  async function handleImagens(event) {
    const selecionados = Array.from(event.target.files ?? []);
    const invalidos    = selecionados.filter((f) => !f.type.startsWith("image/"));
    const restantes    = Math.max(0, 5 - form.imagens.length);
    const validos      = selecionados.filter((f) => f.type.startsWith("image/")).slice(0, restantes);

    if (invalidos.length > 0) {
      setErrors((cur) => ({ ...cur, imagens: "Selecione apenas arquivos de imagem." }));
      event.target.value = "";
      return;
    }
    if (restantes === 0) {
      setErrors((cur) => ({ ...cur, imagens: "Você pode adicionar até 5 fotos." }));
      event.target.value = "";
      return;
    }

    const dataUrls = await Promise.all(validos.map(readFileAsDataUrl));
    setForm((cur) => ({ ...cur, imagens: [...cur.imagens, ...dataUrls].slice(0, 5) }));
    setErrors((cur) => ({ ...cur, imagens: undefined }));
    event.target.value = "";
  }

  function addFotoUrl() {
    const fotoUrl = form.fotoUrl.trim();
    if (!fotoUrl) return;

    if (!isValidImageUrl(fotoUrl)) {
      setErrors((cur) => ({ ...cur, fotoUrl: "Informe uma URL de imagem válida." }));
      return;
    }
    if (form.imagens.length >= 5) {
      setErrors((cur) => ({ ...cur, fotoUrl: "Você pode adicionar até 5 fotos." }));
      return;
    }

    setForm((cur) => {
      if (cur.imagens.includes(fotoUrl)) return { ...cur, fotoUrl: "" };
      return { ...cur, imagens: [...cur.imagens, fotoUrl], fotoUrl: "" };
    });
    setErrors((cur) => ({ ...cur, fotoUrl: undefined, imagens: undefined }));
  }

  function removeImagem(index) {
    setForm((cur) => ({
      ...cur,
      imagens: cur.imagens.filter((_, i) => i !== index),
    }));
    setErrors((cur) => ({ ...cur, imagens: undefined }));
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

  const mostrarTamanho = Boolean(form.categoria);

  return (
    <form onSubmit={handleSubmit} noValidate className="form-space">
      <Field label="Título" error={errors.titulo} required>
        <input
          type="text"
          placeholder="Ex: Jaqueta Jeans Vintage"
          value={form.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          className={`input${errors.titulo ? " error" : ""}`}
          maxLength={100}
          aria-invalid={Boolean(errors.titulo)}
        />
      </Field>

      <Field label="Categoria" error={errors.categoria} required>
        <select
          value={form.categoria}
          onChange={(e) => set("categoria", e.target.value)}
          className={`input${errors.categoria ? " error" : ""}`}
          aria-invalid={Boolean(errors.categoria)}
        >
          <option value="">Selecione...</option>
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Marca">
        <input
          type="text"
          placeholder="Ex: Nike, Adidas, Zara, Renner..."
          value={form.marca || ""}
          onChange={(e) => set("marca", e.target.value)}
          className="input"
        />
      </Field>

      {mostrarTamanho && (
        <Field label="Tamanho" error={errors.tamanho}>
          <select
            value={form.tamanho}
            onChange={(e) => set("tamanho", e.target.value)}
            className={`input${errors.tamanho ? " error" : ""}`}
          >
            <option value="">Selecione...</option>
            {TAMANHOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Descrição" error={errors.descricao} required>
        <textarea
          placeholder="Informe marca, tamanho, cor, tecido, estado de conservação e demais detalhes da peça."
          value={form.descricao}
          onChange={(e) => set("descricao", e.target.value)}
          className={`input${errors.descricao ? " error" : ""}`}
          rows={4}
          maxLength={1500}
          aria-invalid={Boolean(errors.descricao)}
        />
        <p className="char-count">{form.descricao.length}/1500</p>
      </Field>

      <div className="grid-2">
        <Field label="Preço (R$)" error={errors.preco}>
          <input
            type="number"
            placeholder="0,00"
            min={0}
            step="0.01"
            value={form.preco}
            onChange={(e) => set("preco", e.target.value)}
            className={`input${errors.preco ? " error" : ""}`}
            aria-invalid={Boolean(errors.preco)}
          />
        </Field>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "0.5rem", paddingBottom: "0.25rem" }}>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.negociavel}
              onChange={(e) => set("negociavel", e.target.checked)}
            />
            Preço negociável
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.vat}
              onChange={(e) => set("vat", e.target.checked)}
            />
              Possui etiqueta original
          </label>
        </div>
      </div>

      <div className="grid-2">
        <Field label="Cidade" error={errors.cidade} required>
          <input
            type="text"
            placeholder="Ex: Juazeiro do Norte"
            value={form.cidade}
            onChange={(e) => set("cidade", e.target.value)}
            className={`input${errors.cidade ? " error" : ""}`}
            aria-invalid={Boolean(errors.cidade)}
          />
        </Field>

        <Field label="Estado" error={errors.estado} required>
          <select
            value={form.estado}
            onChange={(e) => set("estado", e.target.value)}
            className={`input${errors.estado ? " error" : ""}`}
            aria-invalid={Boolean(errors.estado)}
          >
            <option value="">UF</option>
            {ESTADOS_BR.map((uf) => (
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
          className={`input${errors.contato ? " error" : ""}`}
          aria-invalid={Boolean(errors.contato)}
        />
      </Field>

      {/* Fotos */}
      <div className="form-space" style={{ gap: "0.75rem" }}>
        <Field label="URL da foto" error={errors.fotoUrl}>
          <div className="url-add-row">
            <input
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              value={form.fotoUrl}
              onChange={(e) => set("fotoUrl", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFotoUrl(); } }}
              className={`input${errors.fotoUrl ? " error" : ""}`}
              aria-invalid={Boolean(errors.fotoUrl)}
            />
            <button
              type="button"
              onClick={addFotoUrl}
              className="btn btn-ghost"
            >
              Adicionar
            </button>
          </div>
        </Field>

        <div>
          <p className="fotos-label">
            Fotos <span>(até 5)</span>
          </p>
          <label className="foto-upload-label">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true" style={{ color: "#9ca3af" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span>Clique para selecionar fotos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImagens}
            />
          </label>
          {errors.imagens && <p className="field-error" style={{ marginTop: "0.25rem" }}>{errors.imagens}</p>}

          {form.imagens.length > 0 && (
            <div className="fotos-previews">
              {form.imagens.map((src, index) => (
                <div key={`${src}-${index}`} className="foto-preview">
                  <img src={src} alt="" />
                  <button
                    type="button"
                    onClick={() => removeImagem(index)}
                    className="foto-remove"
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
        className="btn btn-primary btn-full btn-lg"
      >
        {loading ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="field-required">*</span>}
      </label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
