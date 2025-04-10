/**
 * Configurações do dashboard
 */

export const dashboardConfig = {
  // Configurações gerais
  title: "Sistema ERP - Global Seg",
  description: "Sistema de gestão para a Global Seg",

  // Configurações da sidebar
  sidebar: {
    defaultExpanded: true,
    cookieName: "sidebarExpanded",
    width: "240px",
    collapsedWidth: "64px",
  },

  // Configurações de paginação
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },

  // Configurações de formatação
  format: {
    date: "dd/MM/yyyy",
    currency: "BRL",
    locale: "pt-BR",
  },
}
