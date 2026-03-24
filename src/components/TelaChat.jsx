import { useRef, useState, useEffect } from "react";
import { FaTrash, FaPaperclip } from "react-icons/fa";
import logo from "../assets/logo.png";

function TelaChat({
  nome,
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
  // Seleciona uma imagem do computador e cria uma prévia para mostrar na tela
  function handleImagemMensagem(e) {
    const file = e.target.files[0];
    if (file) {
      setImagemMensagem(URL.createObjectURL(file));
    }
  }

  // Estados de controle da tela:
  // imagemAberta = abre imagem em tamanho maior
  // mensagemSelecionada = guarda a mensagem pressionada para mostrar opção de apagar
  const [imagemAberta, setImagemAberta] = useState(null);
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);

  // Refs:
  // timerPressRef = controla o tempo do clique longo
  // fimMensagensRef = usado para rolar automaticamente até a última mensagem
  const timerPressRef = useRef(null);
  const fimMensagensRef = useRef(null);

  // Sempre que chegar nova mensagem ou alguém estiver digitando,
  // o chat desce automaticamente até o final
  useEffect(() => {
    fimMensagensRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, usuarioDigitando]);

  // Inicia o clique longo apenas nas mensagens do próprio usuário
  function iniciarPress(id, autor) {
    if (autor !== nome) return;

    timerPressRef.current = setTimeout(() => {
      setMensagemSelecionada(id);
    }, 600);
  }

  // Cancela o clique longo caso o usuário solte antes do tempo
  function cancelarPress() {
    if (timerPressRef.current) {
      clearTimeout(timerPressRef.current);
      timerPressRef.current = null;
    }
  }

  // Define quais mensagens devem aparecer na tela
  const mensagensFiltradas = mensagens.filter((msg) => {
    // Se não tiver conversa privada aberta, mostra apenas mensagens gerais
    if (!conversaAtiva) {
      return !msg.destinatario;
    }

    // Se tiver conversa privada aberta, mostra apenas mensagens entre você e a pessoa selecionada
    return (
      (msg.autor === nome && msg.destinatario === conversaAtiva) ||
      (msg.autor === conversaAtiva && msg.destinatario === nome)
    );
  });

  return (
    <div
      onClick={() => setMensagemSelecionada(null)}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #08b33e 0%, #dfe7df 100%)",
        padding: isMobile ? "12px" : "20px 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Layout principal: coluna da sala + área do chat */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "minmax(240px, 280px) minmax(0, 1fr)",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* Painel lateral com os participantes da sala */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : "280px",
              background: "rgba(255,255,255,0.92)",
              borderRadius: "24px",
              padding: isMobile ? "18px" : "20px",
              boxShadow: "0 18px 45px rgba(0,0,0,0.14)",
              border: "1px solid rgba(255,255,255,0.45)",
              height: "fit-content",
              boxSizing: "border-box",
              position: isMobile ? "static" : "sticky",
              top: "20px",
              alignSelf: "start",
            }}
          >
            <img
              src={logo}
              alt="Logo FalaAí"
              style={{
                width: "130px",
                maxWidth: "55%",
                display: "block",
                margin: "0 auto 18px auto",
              }}
            />

            <h3
              style={{
                marginTop: 0,
                marginBottom: "16px",
                color: "#2f3447",
                textAlign: "center",
              }}
            >
              Sala
            </h3>

            {/* Lista de usuários conectados */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {usuariosSala.map((usuario) => (
                <div
                  key={usuario.id}
                  onClick={() => {
                    // Se clicar no próprio nome, volta para o chat geral
                    if (usuario.voce) {
                      setConversaAtiva(null);
                      return;
                    }

                    // Se clicar em outro usuário, abre a conversa privada com ele
                    setConversaAtiva(usuario.nome);
                  }}
                                      style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                      borderRadius: "14px",
                      background: conversaAtiva === usuario.nome ? "#dcfce7" : "#f7f9f7",
                      cursor: !usuario.voce ? "pointer" : "default",
                      opacity: 1,
                      border:
                        conversaAtiva === usuario.nome
                          ? "2px solid #22c55e"
                          : !usuario.voce && usuario.nome === ultimoAutorAtivo
                          ? "2px solid #22c55e"
                          : "1px solid #d8e1d8",
                      boxShadow:
                        conversaAtiva === usuario.nome
                          ? "0 0 14px rgba(34, 197, 94, 0.25)"
                          : !usuario.voce && usuario.nome === ultimoAutorAtivo
                          ? "0 0 14px rgba(34, 197, 94, 0.35)"
                          : "none",
                      transition:
                        "border 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease, background 0.4s ease",
                      transform:
                        conversaAtiva === usuario.nome
                          ? "scale(1.02)"
                          : !usuario.voce && usuario.nome === ultimoAutorAtivo
                          ? "scale(1.02)"
                          : "scale(1)",
                    }}
                >
                  {/* Avatar do usuário */}
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "#cfd8cf",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      color: "#4d5a4d",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {usuario.foto ? (
                      <img
                        src={usuario.foto}
                        alt={usuario.nome}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      usuario.nome.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Nome do usuário */}
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#2f3447",
                      wordBreak: "break-word",
                    }}
                  >
                    {usuario.nome} {usuario.voce ? "(você)" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Área principal do bate-papo */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.94)",
              borderRadius: "24px",
              boxShadow: "0 18px 45px rgba(0,0,0,0.14)",
              border: "1px solid rgba(255,255,255,0.45)",
              display: "flex",
              flexDirection: "column",
              height: isMobile ? "calc(100vh - 24px)" : "calc(100vh - 40px)",
              minHeight: isMobile ? "600px" : "720px",
              overflow: "hidden",
            }}
          >
            {/* Cabeçalho do chat */}

                    <div
            style={{
              padding: isMobile ? "16px" : "20px",
              borderBottom: "1px solid #e5e8ec",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
              color: "#2f3447",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <span>
                {conversaAtiva ? `Conversa com ${conversaAtiva}` : "Conversa Aberta"}
              </span>

              {conversaAtiva && (
                <button
                  onClick={() => setConversaAtiva(null)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #d6dbe2",
                    background: "#fff",
                    color: "#2f3447",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Voltar
                </button>
              )}
            </div>
          </div> 

            {/* Lista de mensagens */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                padding: isMobile ? "16px" : "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                overflowY: "auto",
              }}
            >
              {mensagensFiltradas.map((msg) => (
                <div
                  key={msg.id}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={() => iniciarPress(msg.id, msg.autor)}
                  onMouseUp={cancelarPress}
                  onMouseLeave={cancelarPress}
                  onTouchStart={() => iniciarPress(msg.id, msg.autor)}
                  onTouchEnd={cancelarPress}
                  style={{
                    maxWidth: isMobile ? "94%" : "78%",
                    padding: "14px 16px",
                    borderRadius: "18px",
                    background: msg.autor === nome ? "#dcf6e8" : "#f1f3f5",
                    alignSelf: msg.autor === nome ? "flex-end" : "flex-start",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                    wordBreak: "break-word",
                    position: "relative",
                  }}
                >
                  {/* Nome do autor */}
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      marginBottom: "6px",
                      color: "#2f3447",
                    }}
                  >
                    {msg.autor}
                  </div>

                  {/* Conteúdo da mensagem: texto, imagem e hora */}
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#3c4358",
                    }}
                  >
                    {msg.texto && (
                      <div style={{ marginBottom: msg.imagem ? "10px" : "0" }}>
                        {msg.texto}
                      </div>
                    )}

                    {msg.imagem && (
                      <img
                        src={msg.imagem}
                        alt="Imagem enviada"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagemAberta(msg.imagem);
                        }}
                        style={{
                          width: "100%",
                          maxWidth: isMobile ? "220px" : "280px",
                          maxHeight: isMobile ? "240px" : "320px",
                          borderRadius: "12px",
                          display: "block",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    )}

                    {msg.hora && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#6b7280",
                          textAlign: "right",
                        }}
                      >
                        {msg.hora}
                      </div>
                    )}
                  </div>

                  {/* Botão de apagar aparece só nas mensagens do próprio usuário após clique longo */}
                  {msg.autor === nome &&
                    mensagemSelecionada === msg.id &&
                    handleApagarMensagem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApagarMensagem(msg.id);
                          setMensagemSelecionada(null);
                        }}
                        title="Apagar mensagem"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          width: "38px",
                          height: "38px",
                          borderRadius: "12px",
                          border: "1px solid #d6dbe2",
                          background: "#ffffff",
                          color: "#2f3447",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                        }}
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                </div>
              ))}

              {/* Aviso quando alguém está digitando */}
              {usuarioDigitando && (
                <div
                  style={{
                    maxWidth: isMobile ? "94%" : "78%",
                    padding: "12px 16px",
                    borderRadius: "18px",
                    background: "#f1f3f5",
                    alignSelf: "flex-start",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                    fontSize: "14px",
                    color: "#6b7280",
                    fontStyle: "italic",
                  }}
                >
                  {usuarioDigitando} está digitando...
                </div>
              )}

              {/* Marcador usado para rolagem automática */}
              <div ref={fimMensagensRef}></div>
            </div>

            {/* Área de envio: prévia da imagem + campo de texto + anexar + enviar */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: isMobile ? "14px" : "16px",
                borderTop: "1px solid #e5e8ec",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                background: "rgba(255,255,255,0.98)",
                flexShrink: 0,
              }}
            >
              {/* Prévia da imagem escolhida antes do envio */}
              {imagemMensagem && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <img
                    src={imagemMensagem}
                    alt="Prévia da imagem"
                    onClick={() => setImagemAberta(imagemMensagem)}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "12px",
                      objectFit: "cover",
                      cursor: "pointer",
                      border: "1px solid #d6dbe2",
                    }}
                  />

                  <button
                    onClick={() => setImagemMensagem(null)}
                    title="Remover imagem"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      border: "1px solid #d6dbe2",
                      background: "#fff",
                      color: "#2f3447",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "12px",
                  alignItems: isMobile ? "stretch" : "flex-end",
                }}
              >
                {/* Campo de digitação da mensagem */}
                <textarea
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleEnviar();
                    }
                  }}
                  rows={isMobile ? 2 : 3}
                  style={{
                    flex: 1,
                    width: "100%",
                    minHeight: isMobile ? "52px" : "72px",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    border: "1px solid #d6dbe2",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "none",
                    fontFamily: "inherit",
                  }}
                />

                {/* Botão para anexar imagem */}
                <label
                  style={{
                    width: isMobile ? "100%" : "52px",
                    minWidth: isMobile ? "100%" : "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "#eef5ee",
                    border: "1px solid #d6dbe2",
                    cursor: "pointer",
                    color: "#2f3447",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <FaPaperclip size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagemMensagem}
                    style={{ display: "none" }}
                  />
                </label>

                {/* Botão de enviar mensagem */}
                <button
                  onClick={handleEnviar}
                  style={{
                    width: isMobile ? "100%" : "auto",
                    minHeight: "52px",
                    padding: "14px 20px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(to right, #0f9b0f, #21c45a)",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para visualizar imagem ampliada */}
      {imagemAberta && (
        <div
          onClick={() => setImagemAberta(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
            zIndex: 9999,
          }}
        >
          <img
            src={imagemAberta}
            alt="Imagem ampliada"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "95%",
              maxHeight: "90vh",
              borderRadius: "16px",
              objectFit: "contain",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TelaChat;