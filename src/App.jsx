import { useEffect, useRef, useState } from "react";
import TelaCadastro from "./components/TelaCadastro";
import TelaEntrar from "./components/TelaEntrar";
import TelaChat from "./components/TelaChat";

function App() {
  // =========================================
  // ESTADOS PRINCIPAIS DA APLICAÇÃO
  // controla tela, perfil, mensagem e responsividade
  // =========================================
  const [tela, setTela] = useState("cadastro");
  const [imagem, setImagem] = useState(null);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [imagemMensagem, setImagemMensagem] = useState(null);
  const [ultimoAutorAtivo, setUltimoAutorAtivo] = useState(null);
  const [usuarioDigitando, setUsuarioDigitando] = useState(null);
  const [conversaAtiva, setConversaAtiva] = useState(null);

  // =========================================
  // ESTADO DAS MENSAGENS DO CHAT
  // mensagens iniciais da sala
  // =========================================
  const [mensagens, setMensagens] = useState([
    { id: 1, autor: "Maria", texto: "Oi, pessoal!", hora: "08:30" },
    { id: 2, autor: "João", texto: "Bom dia!", hora: "08:32" },
  ]);

  // =========================================
  // REFS DOS ÁUDIOS
  // um para envio e outro para recebimento
  // =========================================
  const audioEnviarRef = useRef(null);
  const audioReceberRef = useRef(null);

  // =========================================
  // REFS DE CONTROLE DO SOM DE RECEBIMENTO
  // evita tocar no carregamento inicial
  // e compara a quantidade de mensagens
  // =========================================
  const primeiraRenderizacaoRef = useRef(true);
  const quantidadeAnteriorRef = useRef(mensagens.length);

  // =========================================
  // CARREGA OS ARQUIVOS DE ÁUDIO
  // =========================================
  useEffect(() => {
    audioEnviarRef.current = new Audio("/sons/enviar.mp3");
    audioReceberRef.current = new Audio("/sons/receber.mp3");
  }, []);

  // =========================================
  // DETECTA SE A TELA É MOBILE
  // atualiza ao redimensionar a janela
  // =========================================
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================================
  // TOCA SOM DE RECEBIMENTO
  // somente quando entrar mensagem nova
  // de outro usuário e estando na tela do chat
  // =========================================
  useEffect(() => {
    if (primeiraRenderizacaoRef.current) {
      primeiraRenderizacaoRef.current = false;
      quantidadeAnteriorRef.current = mensagens.length;
      return;
    }

    if (tela !== "chat") {
      quantidadeAnteriorRef.current = mensagens.length;
      return;
    }

    if (mensagens.length > quantidadeAnteriorRef.current) {
      const ultimaMensagem = mensagens[mensagens.length - 1];

      if (ultimaMensagem?.autor !== nome) {
        audioReceberRef.current.currentTime = 0;
        audioReceberRef.current.play().catch(() => {});
      }
    }

    quantidadeAnteriorRef.current = mensagens.length;
  }, [mensagens, tela, nome]);

  // =========================================
  // LISTA DE USUÁRIOS DA SALA
  // inclui você + participantes simulados
  // =========================================
  const usuariosSala = [
    { id: 1, nome: nome || "Você", foto: imagem, voce: true },
    { id: 2, nome: "Maria", foto: null, voce: false },
    { id: 3, nome: "João", foto: null, voce: false },
    { id: 4, nome: "Ana", foto: null, voce: false },
  ];

  // =========================================
  // ESCOLHE A FOTO DE PERFIL NO CADASTRO
  // =========================================
  function handleImagem(e) {
    const file = e.target.files[0];

    if (file) {
      setImagem(URL.createObjectURL(file));
    }
  }

  // =========================================
  // VALIDA O CADASTRO
  // exige foto e nome antes de continuar
  // =========================================
  function handleCadastrar() {
    const nomeLimpo = nome.trim();

    if (!imagem || !nomeLimpo) {
      alert("Foto e nome do perfil são obrigatórios.");
      return;
    }

    setNome(nomeLimpo);
    setTela("entrar");
  }

  // =========================================
  // ENTRA NA TELA DO CHAT
  // =========================================
  function handleEntrar() {
    setTela("chat");
  }

  // =========================================
  // RESPOSTA AUTOMÁTICA DOS USUÁRIOS
  // simula mensagens de Maria, João e Ana
  // =========================================
function responderAutomatico(destinatario = null) {
  const respostasPorUsuario = {
    Maria: [
      "Oi, tudo bem?",
      "Que legal 😄",
      "Depois me conta mais",
      "Adorei isso",
    ],
    João: [
      "Bom demais!",
      "Entendi kkk",
      "Certo!",
      "Vou ver aqui",
    ],
    Ana: [
      "Nossa, que massa!",
      "Sério? 😮",
      "Legal!",
      "Depois me mostra isso",
    ],
  };

  // Se estiver em conversa privada, quem responde é a pessoa selecionada.
  // Se estiver no chat geral, escolhe alguém aleatório.
  let autorResposta;

  if (destinatario) {
    autorResposta = destinatario;
  } else {
    const autores = ["Maria", "João", "Ana"];
    autorResposta = autores[Math.floor(Math.random() * autores.length)];
  }

  const respostasDoAutor = respostasPorUsuario[autorResposta];
  const textoAleatorio =
    respostasDoAutor[Math.floor(Math.random() * respostasDoAutor.length)];

  setUsuarioDigitando(autorResposta);

  setTimeout(() => {
    const novaMensagem = {
      id: Date.now() + Math.random(),
      autor: autorResposta,
      texto: textoAleatorio,
      imagem: null,
      destinatario: destinatario ? nome : null,
      hora: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMensagens((prevMensagens) => [...prevMensagens, novaMensagem]);
    setUltimoAutorAtivo(autorResposta);
    setUsuarioDigitando(null);

    setTimeout(() => {
      setUltimoAutorAtivo(null);
    }, 3000);
  }, 1500);
}
  // =========================================
  // ENVIA UMA NOVA MENSAGEM
  // envia texto e/ou imagem
  // toca som de envio
  // depois simula uma resposta automática
  // =========================================
  function handleEnviar() {
    if (!mensagem.trim() && !imagemMensagem) return;

    const novaMensagem = {
      id: Date.now(),
      autor: nome,
      texto: mensagem,
      imagem: imagemMensagem,
      destinatario: conversaAtiva || null,
      hora: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMensagens((prevMensagens) => [...prevMensagens, novaMensagem]);
    setMensagem("");
    setImagemMensagem(null);
    setUltimoAutorAtivo(null);

    if (audioEnviarRef.current) {
      audioEnviarRef.current.currentTime = 0;
      audioEnviarRef.current.play().catch(() => {});
    }

    responderAutomatico(conversaAtiva);
  }

  // =========================================
  // APAGA UMA MENSAGEM PELO ID
  // =========================================
  function handleApagarMensagem(id) {
    setMensagens((prevMensagens) =>
      prevMensagens.filter((msg) => msg.id !== id)
    );
  }

  // =========================================
  // RENDERIZA A TELA ATUAL
  // cadastro, entrada ou chat
  // =========================================
  return (
    <>
      {tela === "cadastro" && (
        <TelaCadastro
          nome={nome}
          imagem={imagem}
          isMobile={isMobile}
          setNome={setNome}
          handleImagem={handleImagem}
          handleCadastrar={handleCadastrar}
        />
      )}

      {tela === "entrar" && (
        <TelaEntrar
          nome={nome}
          imagem={imagem}
          isMobile={isMobile}
          handleEntrar={handleEntrar}
        />
      )}

      {tela === "chat" && (
        <TelaChat
          nome={nome}
          mensagem={mensagem}
          mensagens={mensagens}
          usuariosSala={usuariosSala}
          isMobile={isMobile}
          setMensagem={setMensagem}
          handleEnviar={handleEnviar}
          imagemMensagem={imagemMensagem}
          setImagemMensagem={setImagemMensagem}
          handleApagarMensagem={handleApagarMensagem}
          ultimoAutorAtivo={ultimoAutorAtivo}
          usuarioDigitando={usuarioDigitando}
          conversaAtiva={conversaAtiva}
          setConversaAtiva={setConversaAtiva}
        />
      )}
    </>
  );
}

export default App;