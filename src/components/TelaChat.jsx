import { useRef, useState, useEffect } from "react";
import { FaTrash, FaPaperclip, FaPaperPlane, FaUsers, FaArrowLeft } from "react-icons/fa";
import logo from "../assets/logo.png";

function TelaChat({
  nome,
  imagem, // Sua foto que vem do cadastro
  mensagem,
  mensagens,
  usuariosSala,
  isMobile,
  setMensagem,
  handleEnviar,
  imagemMensagem,
  setImagemMensagem,
  handleApagarMensagem,
  ultimoAutorAtivo,
  usuarioDigitando,
  conversaAtiva,
  setConversaAtiva,
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [imagemAberta, setImagemAberta] = useState(null);
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);

  const timerPressRef = useRef(null);
  const fimMensagensRef = useRef(null);

  const textareaRef = useRef(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    fimMensagensRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, usuarioDigitando]);

  // --- NOVO HOOK: AJUSTE AUTOMÁTICO DE ALTURA ---
useEffect(() => {
  if (textareaRef.current) {
    // Reseta para calcular a altura real do conteúdo
    textareaRef.current.style.height = "auto";
    // Define a nova altura baseada no conteúdo (limitada pelo CSS)
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
}, [mensagem]); // Roda sempre que o texto da "mensagem" mudar

  function handleImagemMensagem(e) {
    const file = e.target.files[0];
    if (file) {
      setImagemMensagem(URL.createObjectURL(file));
    }
  }

  function iniciarPress(id, autor) {
    if (autor !== nome) return;
    timerPressRef.current = setTimeout(() => {
      setMensagemSelecionada(id);
    }, 600);
  }

  function cancelarPress() {
    if (timerPressRef.current) {
      clearTimeout(timerPressRef.current);
      timerPressRef.current = null;
    }
  }

  const mensagensFiltradas = mensagens.filter((msg) => {
    if (!conversaAtiva) return !msg.destinatario;
    return (
      (msg.autor === nome && msg.destinatario === conversaAtiva) ||
      (msg.autor === conversaAtiva && msg.destinatario === nome)
    );
  });

  return (
    <div
      onClick={() => setMensagemSelecionada(null)}
      style={{
        height: "100dvh", // d-vh evita problemas com o teclado do celular
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #08b33e 0%, #dfe7df 100%)",
        overflow: "hidden",
      }}
    >
      {/* --- CABEÇALHO SUPERIOR (FIXO) --- */}
      <div style={{
        padding: "10px 16px",
        background: "#08b33e",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 10,
        color: "#fff"
      }}>
        <div 
          onClick={() => isMobile && setMenuAberto(true)}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: isMobile ? "pointer" : "default" }}
        >
          {/* Sua Foto no Topo Esquerdo */}
          <div style={{ 
            width: "42px", height: "42px", borderRadius: "50%", 
            border: "2px solid #fff", overflow: "hidden", background: "#eee" 
          }}>
            <img src={imagem || logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Perfil" />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Mudado de "Todos (Grupo)" para "Todos do grupo" */}
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>
              {conversaAtiva || "Todos do grupo"}
            </span>
            <span style={{ fontSize: "11px", opacity: 0.9 }}>
              {conversaAtiva ? "Conversa Privada" : "Sala Aberta"}
            </span>
          </div>
        </div>

        {/* Ícone de Usuários para Mobile */}
        {isMobile && <FaUsers size={22} onClick={() => setMenuAberto(true)} style={{ cursor: "pointer" }} />}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        
{/* --- MENU LATERAL (SALA DE PARTICIPANTES) --- */}
<div style={{
  position: isMobile ? "fixed" : "static",
  left: 0, 
  // Mantém o efeito de descida:
  top: (menuAberto || !isMobile) ? 0 : "-100%", 
  
  width: isMobile ? "100%" : "300px", 
  height: isMobile ? "auto" : "100%", 
  maxHeight: isMobile ? "85vh" : "100%", 
  
  // VOLTANDO PARA O BRANCO SÓLIDO:
  background: "#ffffff", 
  
  zIndex: 100,
  transition: "top 0.4s ease-in-out", 
  
  display: "flex",
  flexDirection: "column",
  boxShadow: isMobile ? "0 4px 20px rgba(0,0,0,0.15)" : "4px 0 15px rgba(0,0,0,0.05)",
  padding: "20px",
  
  // Arredondamento nas bordas de baixo para o efeito de "aba"
  borderBottomLeftRadius: isMobile ? "25px" : "0",
  borderBottomRightRadius: isMobile ? "25px" : "0",
  boxSizing: "border-box"
}}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <img src={logo} alt="Logo" style={{ width: "100px" }} />
      {/* Seta indicando o fechamento para cima */}
      {isMobile && <FaArrowLeft onClick={() => setMenuAberto(false)} color="#08b33e" style={{ transform: "rotate(90deg)", cursor: "pointer" }} />}
  </div>
  
  <h3 style={{ fontSize: "18px", color: "#2f3447", marginBottom: "15px" }}>Participantes</h3>
  
  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Opção para voltar ao Grupo */}
    <div 
      onClick={() => { setConversaAtiva(null); setMenuAberto(false); }}
      style={{
        padding: "12px", 
        borderRadius: "12px", 
        cursor: "pointer",
        background: !conversaAtiva ? "#dcfce7" : "#f8f9fa",
        fontWeight: !conversaAtiva ? "bold" : "normal",
        display: "flex", 
        alignItems: "center", 
        gap: "10px",
        border: !conversaAtiva ? "1px solid #08b33e" : "1px solid transparent"
      }}
    >
      <div style={{ 
        width: "35px", 
        height: "35px", 
        borderRadius: "50%", 
        background: "#08b33e", 
        color: "#fff", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <FaUsers size={16}/>
      </div>
      
      {/* AJUSTADO: De "Todos participantes" para "Todos do grupo" */}
      Voltar ao grupo 
    </div>

      {/* Lista de Usuários */}
      {usuariosSala.map((usuario) => (
        <div
          key={usuario.id}
          onClick={() => { if(!usuario.voce) { setConversaAtiva(usuario.nome); setMenuAberto(false); } }}
          style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "12px",
            background: conversaAtiva === usuario.nome ? "#dcfce7" : "#f8f9fa",
            cursor: !usuario.voce ? "pointer" : "default",
            border: usuario.nome === ultimoAutorAtivo ? "1px solid #22c55e" : "1px solid transparent"
          }}
        >
          {/* CONTAINER DA FOTO COM POSIÇÃO RELATIVA PARA A BOLINHA */}
          <div style={{ 
            width: "38px", 
            height: "38px", 
            borderRadius: "50%", 
            background: "#cfd8cf", 
            flexShrink: 0,
            position: "relative" // --- ESSENCIAL PARA A BOLINHA VERDE ---
          }}>
            {/* Foto ou Inicial */}
            {usuario.foto ? (
              <img src={usuario.foto} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} alt={usuario.nome} />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                {usuario.nome.charAt(0)}
              </div>
            )}

            {/* INDICADOR ONLINE (BOLINHA VERDE) */}
            <div style={{
              position: "absolute",
              bottom: "0px",
              right: "0px",
              width: "10px",
              height: "10px",
              backgroundColor: "#22c55e",
              border: "2px solid #fff", // Dá o destaque em volta da bolinha
              borderRadius: "50%"
            }} />
          </div>

          <span style={{ fontSize: "14px", fontWeight: "500", color: "#2f3447" }}>
            {usuario.nome} {usuario.voce ? "(você)" : ""}
          </span>
        </div>
      ))}
  </div>
</div>

        {/* --- ÁREA DE CONVERSA (EXPANDIDA) --- */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.6)" }}>
          
          {/* Lista de Mensagens */}
          <div style={{ flex: 1, overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {mensagensFiltradas.map((msg) => (
              <div
                key={msg.id}
                onMouseDown={() => iniciarPress(msg.id, msg.autor)}
                onTouchStart={() => iniciarPress(msg.id, msg.autor)}
                onMouseUp={cancelarPress}
                style={{
                  maxWidth: isMobile ? "85%" : "70%",
                  padding: "10px 14px",
                  borderRadius: msg.autor === nome ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                  background: msg.autor === nome ? "#dcf6e8" : "#fff",
                  alignSelf: msg.autor === nome ? "flex-end" : "flex-start",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                  position: "relative",
                  
                  // --- TRAVAS PARA O GRUPO NÃO BUGAR ---
                  wordBreak: "break-word",    // Quebra palavras longas
                  overflowWrap: "anywhere",   // Força o texto a caber na largura da bolha
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "80px"            // Garante que a bolha não fique "esmagada"
                }}
              >
                {msg.autor !== nome && (
                  <div style={{ 
                    fontSize: "11px", 
                    fontWeight: "700", 
                    color: "#08b33e", 
                    marginBottom: "4px",
                    // Garante que nomes longos não quebrem o layout:
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {msg.autor}
                  </div>
                )}
                
                <div style={{ 
                  fontSize: "15px", 
                  color: "#333",
                  // Reforço de quebra de linha no texto:
                  wordBreak: "break-word",
                  overflowWrap: "anywhere"
                }}>
                  {msg.texto}
                  {msg.imagem && (
                    <img 
                      src={msg.imagem} 
                      onClick={() => setImagemAberta(msg.imagem)} 
                      style={{ width: "100%", marginTop: "8px", borderRadius: "10px", cursor: "pointer" }} 
                      alt="Anexo"
                    />
                  )}
                </div>
                
                <div style={{ fontSize: "10px", color: "#888", textAlign: "right", marginTop: "4px" }}>
                  {msg.hora}
                </div>

                {/* Botão Apagar (Long Press) */}
                {msg.autor === nome && mensagemSelecionada === msg.id && (
                  <button 
                    onClick={() => handleApagarMensagem(msg.id)} 
                    style={{ position: "absolute", top: "-15px", right: "0", background: "#ff4d4d", color: "#fff", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", zIndex: 5 }}
                  >
                    <FaTrash size={12}/>
                  </button>
                )}
              </div>
            ))}
            {usuarioDigitando && <div style={{ fontSize: "12px", fontStyle: "italic", color: "#666" }}>{usuarioDigitando} está digitando...</div>}
            <div ref={fimMensagensRef}></div>
          </div>

          {/* --- ÁREA DE ENVIO (INFERIOR FIXA) --- */}
          <div style={{ 
            padding: "12px", 
            background: "#fff", 
            borderTop: "1px solid #ddd",
            width: "100%",
            boxSizing: "border-box" // Crucial para o padding não expulsar o botão
          }}>
            {imagemMensagem && (
              <div style={{ position: "relative", width: "60px", marginBottom: "10px" }}>
                <img src={imagemMensagem} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
                <FaTrash onClick={() => setImagemMensagem(null)} style={{ position: "absolute", top: "-5px", right: "-5px", color: "red", background: "#fff", borderRadius: "50%", padding: "2px", cursor: "pointer" }} />
              </div>
            )}
            
            <div style={{ 
              display: "flex", 
              gap: "10px", 
              alignItems: "center",
              width: "100%",
              maxWidth: "100%", // Trava a largura aqui
              overflow: "hidden" // Impede a tela de "correr"
            }}>
              <label style={{ cursor: "pointer", color: "#555", flexShrink: 0 }}>
                <FaPaperclip size={20} />
                <input type="file" accept="image/*" onChange={handleImagemMensagem} style={{ display: "none" }} />
              </label>

              <textarea
                ref={textareaRef} // REFERÊNCIA PARA O NOVO HOOK DE ALTURA
                placeholder="Digite..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEnviar();
                  }
                }}
                style={{
                  flex: 1, 
                  minWidth: 0, // Permite que o Flexbox controle a largura real
                  padding: "10px 15px", 
                  borderRadius: "25px", 
                  border: "1px solid #ddd",
                  resize: "none", 
                  outline: "none", 
                  maxHeight: "100px", 
                  fontSize: "16px",
                  background: "#f8f9fa",
                  
                  // Quebra de linha forçada
                  whiteSpace: "pre-wrap", 
                  wordBreak: "break-all",   
                  overflowWrap: "anywhere",
                }}
                rows={1}
              />

              <button
                onClick={handleEnviar}
                style={{
                  background: "#08b33e", 
                  color: "#fff", 
                  border: "none",
                  width: "45px", 
                  height: "45px", 
                  borderRadius: "50%",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  cursor: "pointer",
                  flexShrink: 0, // IMPEDE O BOTÃO DE SUMIR
                }}
              >
                <FaPaperPlane size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Overlay para fechar menu no mobile ao clicar fora */}
        {isMobile && menuAberto && (
          <div 
            onClick={() => setMenuAberto(false)}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", zIndex: 90 }} 
          />
        )}
      </div>

      {/* Modal de Zoom */}
      {imagemAberta && (
        <div onClick={() => setImagemAberta(null)} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <img src={imagemAberta} style={{ maxWidth: "95%", maxHeight: "90vh", objectFit: "contain" }} />
        </div>
      )}
    </div>
  );
}

export default TelaChat;