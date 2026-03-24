import logo from "../assets/logo.png";

function TelaEntrar({ nome, imagem, isMobile, handleEntrar }) {
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

  const logoStyle = {
    width: isMobile ? "130px" : "160px",
    maxWidth: "60%",
    marginBottom: "10px",
    filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.12))",
  };

  const fotoPerfilStyle = {
    width: isMobile ? "110px" : "132px",
    height: isMobile ? "110px" : "132px",
    borderRadius: "50%",
    margin: "0 auto 18px auto",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom, #e8ece8, #d3d8d3)",
    border: "6px solid #92a889",
    boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
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
        <img src={logo} alt="Logo FalaAí" style={logoStyle} />

        <div style={cardStyle}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: isMobile ? "28px" : "32px",
              color: "#2f3447",
            }}
          >
            Entrar
          </h2>

          <p
            style={{
              margin: "0 auto 24px auto",
              color: "#5f667a",
              fontSize: "15px",
              lineHeight: "1.4",
              maxWidth: "260px",
              textAlign: "center",
            }}
          >
            Entre com o perfil cadastrado
          </p>

          <div style={fotoPerfilStyle}>
            {imagem ? (
              <img
                src={imagem}
                alt="Foto do perfil"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span
                style={{
                  color: "#6a7286",
                  fontSize: "42px",
                  fontWeight: "700",
                }}
              >
                {nome ? nome.charAt(0).toUpperCase() : "?"}
              </span>
            )}
          </div>

          <div
            style={{
              marginBottom: "20px",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
              color: "#2f3447",
              wordBreak: "break-word",
            }}
          >
            {nome}
          </div>

          <button
            onClick={handleEntrar}
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
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TelaEntrar;