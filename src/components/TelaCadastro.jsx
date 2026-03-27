import logo from "../assets/logo.png";

function TelaCadastro({
  nome,
  imagem,
  isMobile,
  setNome,
  handleImagem,
  handleCadastrar,
}) {
  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(6px)",
    padding: isMobile ? "24px 18px" : "32px 24px",
    borderRadius: "28px",
    textAlign: "center",
    boxShadow: "0 18px 45px rgba(0,0,0,0.14)",
    border: "1px solid rgba(255,255,255,0.45)",
    boxSizing: "border-box",
  };

  const fotoPerfilContainerStyle = {
    position: "relative", // Necessário para posicionar elementos internos se precisar
    width: isMobile ? "120px" : "150px",
    height: isMobile ? "120px" : "150px",
    margin: "0 auto 20px auto",
  };

  const fotoPerfilStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom, #e8ece8, #d3d8d3)",
    border: "6px solid #92a889",
    boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #08b33e 0%, #dfe7df 100%)",
        padding: isMobile ? "20px 16px" : "32px 16px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img 
          src={logo} 
          alt="Logo FalaAí" 
          style={{
            width: isMobile ? "130px" : "160px",
            maxWidth: "60%",
            marginBottom: "15px",
            filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.12))",
          }} 
        />

        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: isMobile ? "28px" : "32px", color: "#2f3447" }}>
            Cadastro
          </h2>

          <p style={{ margin: "0 auto 24px auto", color: "#5f667a", fontSize: "14px", textAlign: "center" }}>
            Toque no círculo para escolher sua foto
          </p>

          {/* Container da Foto Centralizado */}
          <div style={fotoPerfilContainerStyle}>
            <label htmlFor="upload-button" style={fotoPerfilStyle}>
              {imagem ? (
                <img
                  src={imagem}
                  alt="Foto do perfil"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Garante que a imagem preencha o círculo sem esticar
                    objectPosition: "center", // Mantém o foco no meio
                  }}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <span style={{ color: "#6a7286", fontSize: "16px", fontWeight: "600", display: "block" }}>
                    Adicionar
                  </span>
                  <span style={{ color: "#6a7286", fontSize: "14px" }}>Foto</span>
                </div>
              )}
            </label>
            <input
              type="file"
              id="upload-button"
              accept="image/*"
              onChange={handleImagem}
              style={{ display: "none" }}
            />
          </div>

          <input
            type="text"
            placeholder="Seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid #d6dbe2",
              background: "#ffffff",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              color: "#2f3447",
              marginBottom: "12px"
            }}
          />

          <button
            onClick={handleCadastrar}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(to right, #0f9b0f, #21c45a)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(15,155,15,0.22)",
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.9")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            Finalizar Cadastro
          </button>
        </div>
      </div>
    </div>
  );
}

export default TelaCadastro;