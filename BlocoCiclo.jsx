import React, { useState, useMemo, useRef, useEffect } from "react";

/*
  Bloco de ESTUDO no CICLO.
  - "Conteúdo estudado": filtro pesquisável do edital, SELEÇÃO ÚNICA (1 conteúdo por bloco).
  - Opção de marcar o CONTEÚDO em si como CONCLUÍDO (não só a sessão).

  >>> Troque o objeto EDITAIS pelos tópicos reais. Estrutura:
        { "Matéria": ["1. item", "1.1 subitem", ...] }
      Se a matéria já vem do ciclo, passe por prop: <BlocoCiclo materia="Português" />
      e remova o <select> de matéria.
*/

const EDITAIS = {
  "Direito Constitucional": [
    "1. Constituição: conceito, classificação e aplicabilidade das normas",
    "2. Princípios fundamentais (arts. 1º a 4º)",
    "3. Direitos e garantias fundamentais",
    "3.1 Direitos e deveres individuais e coletivos",
    "3.2 Direitos sociais",
    "3.3 Nacionalidade",
    "3.4 Direitos políticos e partidos políticos",
    "4. Organização do Estado",
    "5. Organização dos Poderes",
    "5.1 Poder Legislativo: processo legislativo",
    "5.2 Poder Executivo",
    "5.3 Poder Judiciário",
    "6. Controle de constitucionalidade",
  ],
  "Língua Portuguesa": [
    "1. Compreensão e interpretação de textos",
    "2. Tipologia e gêneros textuais",
    "3. Ortografia oficial",
    "4. Acentuação gráfica",
    "5. Classes de palavras",
    "6.1 Concordância verbal e nominal",
    "6.2 Regência verbal e nominal",
    "7. Pontuação",
    "8. Crase",
    "9. Semântica: sinonímia, antonímia, polissemia",
  ],
  "Raciocínio Lógico": [
    "1. Estruturas lógicas",
    "2. Lógica de argumentação",
    "3. Lógica proposicional: conectivos e tabelas-verdade",
    "4. Equivalências e negações (De Morgan)",
    "5. Diagramas lógicos",
    "6. Análise combinatória",
    "7. Probabilidade",
  ],
  "Direito Administrativo": [
    "1. Princípios da Administração Pública",
    "2. Poderes administrativos",
    "3. Atos administrativos",
    "4. Licitações (Lei 14.133/2021)",
    "5. Contratos administrativos",
    "6. Agentes públicos e Lei 8.112/1990",
    "7. Improbidade administrativa (Lei 8.429/1992)",
  ],
};

const norm = (s) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const FORMAS = ["Teoria", "Questões", "Videoaula", "Lei seca", "Revisão", "Resumo"];

export default function BlocoCiclo() {
  const materias = Object.keys(EDITAIS);
  const [materia, setMateria] = useState(materias[0]);
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [selecionado, setSelecionado] = useState(null); // SELEÇÃO ÚNICA
  const [concluido, setConcluido] = useState(false);     // conteúdo concluído
  const [destaque, setDestaque] = useState(0);
  const [minutos, setMinutos] = useState("");
  const [formas, setFormas] = useState([]);
  const [obs, setObs] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setAberto(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const trocarMateria = (m) => {
    setMateria(m); setSelecionado(null); setConcluido(false); setBusca(""); setAberto(false);
  };

  const topicos = EDITAIS[materia] || [];
  const filtrados = useMemo(() => {
    const q = norm(busca);
    return topicos.filter((t) => q === "" || norm(t).includes(q));
  }, [busca, topicos]);

  useEffect(() => setDestaque(0), [busca, aberto, materia]);

  const escolher = (t) => {        // substitui (único)
    setSelecionado(t);
    setConcluido(false);
    setBusca("");
    setAberto(false);
  };
  const limpar = () => { setSelecionado(null); setConcluido(false); setAberto(true); };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setAberto(true); setDestaque((d) => Math.min(d + 1, filtrados.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setDestaque((d) => Math.max(d - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtrados[destaque]) escolher(filtrados[destaque]); }
    else if (e.key === "Escape") setAberto(false);
  };

  const toggleForma = (f) =>
    setFormas((arr) => (arr.includes(f) ? arr.filter((x) => x !== f) : [...arr, f]));

  const styles = `
    .bc-wrap{ --bg:#F3ECD9; --card:#FBF7EC; --ink:#3D2B23; --muted:#8B7355;
      --line:#CBB89A; --maroon:#7A1E1E; --maroon-d:#5E1616; --soft:#EFE3CC;
      --green:#3E6B47; --green-soft:#E4EEDF;
      background:var(--bg); padding:26px 24px; border:1px dashed var(--maroon);
      border-radius:10px; color:var(--ink); max-width:1040px;
      font-family:Georgia,'Times New Roman',serif; }
    .bc-label{ font-family:'JetBrains Mono','SFMono-Regular',Consolas,Menlo,monospace;
      font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted);
      margin:0 0 7px 2px; font-weight:600; }
    .bc-row{ display:flex; gap:22px; align-items:flex-start; flex-wrap:wrap; }
    .bc-min{ width:118px; } .bc-min input{ width:100%; }
    .bc-input{ width:100%; box-sizing:border-box; background:var(--card);
      border:1.5px solid var(--line); border-radius:7px; padding:9px 12px;
      font-family:Georgia,serif; font-size:15px; color:var(--ink); outline:none;
      transition:border-color .15s, box-shadow .15s; }
    .bc-input:focus{ border-color:var(--maroon); box-shadow:0 0 0 3px rgba(122,30,30,.12); }
    .bc-combo{ position:relative; }
    .bc-drop{ position:absolute; z-index:30; top:calc(100% + 6px); left:0; right:0;
      background:var(--card); border:1.5px solid var(--line); border-radius:9px;
      box-shadow:0 14px 34px rgba(61,43,35,.18); max-height:280px; overflow:auto; padding:5px; }
    .bc-drophead{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.14em;
      text-transform:uppercase; color:var(--muted); padding:6px 10px 4px; }
    .bc-opt{ padding:9px 11px; border-radius:6px; cursor:pointer; font-size:14.5px;
      display:flex; align-items:center; gap:9px; line-height:1.3; }
    .bc-opt:hover, .bc-opt.on{ background:var(--soft); }
    .bc-opt .dot{ color:var(--maroon); font-family:'JetBrains Mono',monospace; font-weight:700; }
    .bc-empty{ padding:14px 12px; color:var(--muted); font-style:italic; font-size:14px; }

    /* conteúdo selecionado (único) */
    .bc-sel{ display:flex; align-items:center; gap:12px; background:var(--card);
      border:1.5px solid var(--maroon); border-radius:9px; padding:11px 13px; }
    .bc-sel.done{ border-color:var(--green); background:var(--green-soft); }
    .bc-sel .mark{ flex:0 0 auto; width:24px; height:24px; border-radius:6px;
      border:2px solid var(--maroon); display:flex; align-items:center; justify-content:center;
      font-size:14px; color:#fff; background:transparent; }
    .bc-sel.done .mark{ background:var(--green); border-color:var(--green); }
    .bc-sel .txt{ flex:1; font-size:15px; line-height:1.35; }
    .bc-sel.done .txt{ color:var(--green); }
    .bc-sel .chg{ all:unset; cursor:pointer; font-family:'JetBrains Mono',monospace;
      font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted);
      border-bottom:1px dotted var(--muted); flex:0 0 auto; }
    .bc-sel .chg:hover{ color:var(--maroon); border-color:var(--maroon); }

    /* toggle concluído */
    .bc-done{ display:flex; align-items:center; gap:10px; margin-top:11px; cursor:pointer;
      user-select:none; width:fit-content; }
    .bc-check{ width:22px; height:22px; border-radius:6px; border:2px solid var(--line);
      background:var(--card); display:flex; align-items:center; justify-content:center;
      font-size:14px; color:#fff; transition:all .14s; }
    .bc-done.on .bc-check{ background:var(--green); border-color:var(--green); }
    .bc-done .lab{ font-size:14.5px; }
    .bc-done.on .lab{ color:var(--green); font-weight:600; }
    .bc-hint{ font-size:12.5px; color:var(--muted); font-style:italic; margin:8px 0 0 2px; }

    .bc-pill{ background:var(--card); border:1.4px solid var(--line); color:var(--ink);
      border-radius:999px; padding:6px 16px; font-size:14px; cursor:pointer;
      font-family:Georgia,serif; transition:all .14s; }
    .bc-pill:hover{ border-color:var(--maroon); }
    .bc-pill.on{ background:var(--maroon); border-color:var(--maroon); color:#F8F0E3; }
    .bc-sels{ display:flex; gap:9px; flex-wrap:wrap; }
    .bc-area{ width:100%; box-sizing:border-box; min-height:74px; resize:vertical; }
    .bc-btns{ display:flex; gap:12px; margin-top:6px; }
    .bc-btn{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.1em;
      text-transform:uppercase; font-weight:700; padding:11px 18px; border-radius:7px; cursor:pointer; transition:all .14s; }
    .bc-btn.prim{ background:var(--maroon); color:#F8F0E3; border:1.5px solid var(--maroon); }
    .bc-btn.prim:hover{ background:var(--maroon-d); }
    .bc-btn.ghost{ background:transparent; color:var(--maroon); border:1.5px solid var(--maroon); }
    .bc-btn.ghost:hover{ background:var(--soft); }
    .bc-select{ background:var(--card); border:1.5px solid var(--line); border-radius:7px;
      padding:9px 34px 9px 12px; font-family:Georgia,serif; font-size:15px; color:var(--ink);
      cursor:pointer; outline:none; appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A1E1E' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 12px center; }
    .bc-section{ margin-bottom:20px; }
  `;

  return (
    <div className="bc-wrap" ref={wrapRef}>
      <style>{styles}</style>

      <div className="bc-section bc-row">
        <div className="bc-min">
          <p className="bc-label">Minutos estudados</p>
          <input className="bc-input" inputMode="numeric" placeholder="0"
            value={minutos} onChange={(e) => setMinutos(e.target.value.replace(/\D/g, ""))} />
        </div>
        <div>
          <p className="bc-label">Matéria do ciclo</p>
          <select className="bc-select" value={materia} onChange={(e) => trocarMateria(e.target.value)}>
            {materias.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="bc-section">
        <p className="bc-label">Conteúdo estudado — item do edital</p>

        {!selecionado ? (
          <div className="bc-combo">
            <input
              className="bc-input"
              placeholder={`Filtrar e escolher 1 conteúdo de ${materia}…`}
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setAberto(true); }}
              onFocus={() => setAberto(true)}
              onKeyDown={onKey}
            />
            {aberto && (
              <div className="bc-drop">
                <div className="bc-drophead">{materia} · {filtrados.length} item(ns)</div>
                {filtrados.length === 0 ? (
                  <div className="bc-empty">Nenhum item do edital corresponde à busca.</div>
                ) : (
                  filtrados.map((t, i) => (
                    <div key={t}
                      className={"bc-opt" + (i === destaque ? " on" : "")}
                      onMouseEnter={() => setDestaque(i)}
                      onClick={() => escolher(t)}>
                      <span className="dot">›</span><span>{t}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={"bc-sel" + (concluido ? " done" : "")}>
              <span className="mark">{concluido ? "✓" : ""}</span>
              <span className="txt">{selecionado}</span>
              <button className="chg" onClick={limpar}>Trocar</button>
            </div>

            <div className={"bc-done" + (concluido ? " on" : "")}
              onClick={() => setConcluido((c) => !c)} role="checkbox" aria-checked={concluido}>
              <span className="bc-check">{concluido ? "✓" : ""}</span>
              <span className="lab">{concluido ? "Conteúdo concluído" : "Marcar conteúdo como concluído"}</span>
            </div>
            <p className="bc-hint">
              “Concluído” marca o conteúdo inteiro do edital como finalizado — diferente de apenas registrar a sessão de hoje no ciclo.
            </p>
          </>
        )}
      </div>

      <div className="bc-section">
        <p className="bc-label">Forma de estudo</p>
        <div className="bc-sels">
          {FORMAS.map((f) => (
            <button key={f} className={"bc-pill" + (formas.includes(f) ? " on" : "")}
              onClick={() => toggleForma(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bc-section">
        <p className="bc-label">Observação</p>
        <textarea className="bc-input bc-area" placeholder="dúvidas, o que revisar…"
          value={obs} onChange={(e) => setObs(e.target.value)} />
      </div>

      <div className="bc-btns">
        <button className="bc-btn prim">✓ Estudado (desmarcar)</button>
        <button className="bc-btn ghost">Fechar</button>
      </div>
    </div>
  );
}
