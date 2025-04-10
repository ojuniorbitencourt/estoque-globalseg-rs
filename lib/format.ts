/**
 * Utilitários para formatação de valores
 */

// Formata um valor para moeda brasileira
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Formata uma data para o formato brasileiro
export function formatDate(date: Date | string): string {
  if (!date) return "N/A"

  const dateObj = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj)
}

// Formata um número com separador de milhares
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}
