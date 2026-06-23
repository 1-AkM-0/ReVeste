import { useState, useRef, useEffect } from "react";
import { sugestoes, highlight } from "../utils/search";

export default function Busca({
  value,
  onChange,
  onClear,
  anuncios = [],
  placeholder = "Buscar anúncios...",
}) {
  const [local, setLocal]       = useState(value ?? "");
  const [aberto, setAberto]     = useState(false);
  const [itemFoco, setItemFoco] = useState(-1);
  const debounceRef             = useRef(null);
  const inputRef                = useRef(null);
  const listRef                 = useRef(null);

  useEffect(() => { setLocal(value ?? ""); }, [value]);

  const lista = sugestoes(anuncios, local, 6);

  function handleChange(e) {
    const v = e.target.value;
    setLocal(v);
    setItemFoco(-1);
    setAberto(v.length >= 2);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { onChange?.(v); }, 250);
  }

  function aplicar(termo) {
    setLocal(termo);
    setAberto(false);
    setItemFoco(-1);
    clearTimeout(debounceRef.current);
    onChange?.(termo);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (!aberto || lista.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setItemFoco((i) => Math.min(i + 1, lista.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setItemFoco((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && itemFoco >= 0) {
      e.preventDefault();
      aplicar(lista[itemFoco]);
    } else if (e.key === "Escape") {
      setAberto(false);
      setItemFoco(-1);
    }
  }

  function handleClear() {
    setLocal("");
    setAberto(false);
    clearTimeout(debounceRef.current);
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  }

  useEffect(() => {
    function onClickFora(e) {
      if (!listRef.current?.contains(e.target) && e.target !== inputRef.current) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", onClickFora);
    return () => document.removeEventListener("mousedown", onClickFora);
  }, []);

  const listboxId = "busca-listbox";

  return (
    <div className="busca-wrapper">
      <div className="busca-input-wrap">
        <svg
          className="busca-icon"
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={aberto && lista.length > 0}
          aria-controls={listboxId}
          aria-activedescendant={itemFoco >= 0 ? `sugestao-${itemFoco}` : undefined}
          placeholder={placeholder}
          value={local}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => local.length >= 2 && setAberto(true)}
          className="busca-input"
        />

        {local && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpar busca"
            className="busca-clear"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {aberto && lista.length > 0 && (
        <ul
          id={listboxId}
          ref={listRef}
          role="listbox"
          aria-label="Sugestões de busca"
          className="busca-listbox"
        >
          {lista.map((sugestao, i) => {
            const partes = highlight(sugestao, local);
            return (
              <li
                key={sugestao}
                id={`sugestao-${i}`}
                role="option"
                aria-selected={i === itemFoco}
                onMouseDown={() => aplicar(sugestao)}
                onMouseEnter={() => setItemFoco(i)}
                className="busca-sugestao"
              >
                <svg
                  width="14" height="14"
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{ color: "#d1d5db", flexShrink: 0 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                </svg>
                <span>
                  {partes.map((p, j) =>
                    p.destaque
                      ? <mark key={j}>{p.texto}</mark>
                      : <span key={j}>{p.texto}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
