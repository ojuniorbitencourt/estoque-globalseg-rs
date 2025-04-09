"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

export default function ConfiguracoesPage() {
  const [tabAtiva, setTabAtiva] = useState("perfil")
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesSistema, setNotificacoesSistema] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Use the next-themes hook to manage theme
  const { theme, setTheme } = useTheme()
  const [modoEscuro, setModoEscuro] = useState(theme === "dark")

  // Update modoEscuro state when theme changes
  useEffect(() => {
    setModoEscuro(theme === "dark")
  }, [theme])

  // Toggle dark mode and update theme
  const toggleDarkMode = (value: boolean) => {
    setModoEscuro(value)
    setTheme(value ? "dark" : "light")
  }

  // Handle save preferences
  const handleSavePreferences = async () => {
    setIsSaving(true)

    try {
      // Simulate API call to save preferences
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Save preferences to localStorage for persistence
      localStorage.setItem("notificacoesEmail", notificacoesEmail.toString())
      localStorage.setItem("notificacoesSistema", notificacoesSistema.toString())

      // Theme is already saved by next-themes

      toast.success("Preferências salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar preferências:", error)
      toast.error("Erro ao salvar preferências. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  // Load saved preferences on component mount
  useEffect(() => {
    const savedNotificacoesEmail = localStorage.getItem("notificacoesEmail")
    const savedNotificacoesSistema = localStorage.getItem("notificacoesSistema")

    if (savedNotificacoesEmail !== null) {
      setNotificacoesEmail(savedNotificacoesEmail === "true")
    }

    if (savedNotificacoesSistema !== null) {
      setNotificacoesSistema(savedNotificacoesSistema === "true")
    }
  }, [])

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Configurações</h2>
        <p style={{ color: "#5f6368" }}>Gerencie as configurações do sistema</p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #dadce0",
            marginBottom: "16px",
            overflowX: "auto",
          }}
        >
          <button
            onClick={() => setTabAtiva("perfil")}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: tabAtiva === "perfil" ? "2px solid #1a73e8" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: tabAtiva === "perfil" ? "500" : "normal",
              color: tabAtiva === "perfil" ? "#1a73e8" : "#5f6368",
              whiteSpace: "nowrap",
            }}
          >
            Perfil
          </button>
          <button
            onClick={() => setTabAtiva("empresa")}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: tabAtiva === "empresa" ? "2px solid #1a73e8" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: tabAtiva === "empresa" ? "500" : "normal",
              color: tabAtiva === "empresa" ? "#1a73e8" : "#5f6368",
              whiteSpace: "nowrap",
            }}
          >
            Empresa
          </button>
          <button
            onClick={() => setTabAtiva("notificacoes")}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: tabAtiva === "notificacoes" ? "2px solid #1a73e8" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: tabAtiva === "notificacoes" ? "500" : "normal",
              color: tabAtiva === "notificacoes" ? "#1a73e8" : "#5f6368",
              whiteSpace: "nowrap",
            }}
          >
            Notificações
          </button>
          <button
            onClick={() => setTabAtiva("seguranca")}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: tabAtiva === "seguranca" ? "2px solid #1a73e8" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: tabAtiva === "seguranca" ? "500" : "normal",
              color: tabAtiva === "seguranca" ? "#1a73e8" : "#5f6368",
              whiteSpace: "nowrap",
            }}
          >
            Segurança
          </button>
        </div>

        {/* Conteúdo da tab Perfil */}
        {tabAtiva === "perfil" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>Informações do Perfil</h3>
              <p style={{ fontSize: "14px", color: "#5f6368" }}>Atualize suas informações pessoais</p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div>
                <label
                  htmlFor="nome"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Nome
                </label>
                <input
                  id="nome"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="telefone"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Telefone
                </label>
                <input
                  id="telefone"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="cargo"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Cargo
                </label>
                <input
                  id="cargo"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{
                  backgroundColor: "#1a73e8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo da tab Empresa */}
        {tabAtiva === "empresa" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>Informações da Empresa</h3>
              <p style={{ fontSize: "14px", color: "#5f6368" }}>Atualize as informações da sua empresa</p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div>
                <label
                  htmlFor="empresa-nome"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Nome da Empresa
                </label>
                <input
                  id="empresa-nome"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="empresa-cnpj"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  CNPJ
                </label>
                <input
                  id="empresa-cnpj"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="empresa-endereco"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Endereço
                </label>
                <input
                  id="empresa-endereco"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="empresa-cidade"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Cidade/UF
                </label>
                <input
                  id="empresa-cidade"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="empresa-telefone"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Telefone
                </label>
                <input
                  id="empresa-telefone"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="empresa-email"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Email
                </label>
                <input
                  id="empresa-email"
                  type="email"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{
                  backgroundColor: "#1a73e8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo da tab Notificações */}
        {tabAtiva === "notificacoes" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>Preferências de Notificação</h3>
              <p style={{ fontSize: "14px", color: "#5f6368" }}>Configure como você deseja receber notificações</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <label htmlFor="notificacoes-email" style={{ display: "block", fontWeight: "500", fontSize: "14px" }}>
                    Notificações por Email
                  </label>
                  <p style={{ fontSize: "12px", color: "#5f6368", margin: "4px 0 0 0" }}>
                    Receba notificações importantes por email
                  </p>
                </div>
                <div
                  style={{
                    position: "relative",
                    width: "36px",
                    height: "20px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="notificacoes-email"
                    checked={notificacoesEmail}
                    onChange={(e) => setNotificacoesEmail(e.target.checked)}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span
                    onClick={() => setNotificacoesEmail(!notificacoesEmail)}
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: notificacoesEmail ? "#1a73e8" : "#ccc",
                      transition: "0.4s",
                      borderRadius: "34px",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        height: "16px",
                        width: "16px",
                        left: notificacoesEmail ? "16px" : "4px",
                        bottom: "2px",
                        backgroundColor: "white",
                        transition: "0.4s",
                        borderRadius: "50%",
                      }}
                    ></span>
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <label
                    htmlFor="notificacoes-sistema"
                    style={{ display: "block", fontWeight: "500", fontSize: "14px" }}
                  >
                    Notificações do Sistema
                  </label>
                  <p style={{ fontSize: "12px", color: "#5f6368", margin: "4px 0 0 0" }}>
                    Receba notificações dentro do sistema
                  </p>
                </div>
                <div
                  style={{
                    position: "relative",
                    width: "36px",
                    height: "20px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="notificacoes-sistema"
                    checked={notificacoesSistema}
                    onChange={(e) => setNotificacoesSistema(e.target.checked)}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span
                    onClick={() => setNotificacoesSistema(!notificacoesSistema)}
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: notificacoesSistema ? "#1a73e8" : "#ccc",
                      transition: "0.4s",
                      borderRadius: "34px",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        height: "16px",
                        width: "16px",
                        left: notificacoesSistema ? "16px" : "4px",
                        bottom: "2px",
                        backgroundColor: "white",
                        transition: "0.4s",
                        borderRadius: "50%",
                      }}
                    ></span>
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <label htmlFor="modo-escuro" style={{ display: "block", fontWeight: "500", fontSize: "14px" }}>
                    Modo Escuro
                  </label>
                  <p style={{ fontSize: "12px", color: "#5f6368", margin: "4px 0 0 0" }}>
                    Ativar modo escuro na interface
                  </p>
                </div>
                <div
                  style={{
                    position: "relative",
                    width: "36px",
                    height: "20px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="modo-escuro"
                    checked={modoEscuro}
                    onChange={(e) => toggleDarkMode(e.target.checked)}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span
                    onClick={() => toggleDarkMode(!modoEscuro)}
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: modoEscuro ? "#1a73e8" : "#ccc",
                      transition: "0.4s",
                      borderRadius: "34px",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        height: "16px",
                        width: "16px",
                        left: modoEscuro ? "16px" : "4px",
                        bottom: "2px",
                        backgroundColor: "white",
                        transition: "0.4s",
                        borderRadius: "50%",
                      }}
                    ></span>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleSavePreferences}
                disabled={isSaving}
                style={{
                  backgroundColor: "#1a73e8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontWeight: "500",
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                {isSaving ? "Salvando..." : "Salvar Preferências"}
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo da tab Segurança */}
        {tabAtiva === "seguranca" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>Segurança da Conta</h3>
              <p style={{ fontSize: "14px", color: "#5f6368" }}>Gerencie a segurança da sua conta</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label
                  htmlFor="senha-atual"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Senha Atual
                </label>
                <input
                  id="senha-atual"
                  type="password"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="nova-senha"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Nova Senha
                </label>
                <input
                  id="nova-senha"
                  type="password"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmar-senha"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmar-senha"
                  type="password"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{
                  backgroundColor: "#1a73e8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Atualizar Senha
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
