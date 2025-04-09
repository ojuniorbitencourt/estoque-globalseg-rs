"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, Upload } from "lucide-react"
import { useState } from "react"

// Dados de exemplo
const documentosIniciais = [
  {
    id: 1,
    nome: "Contrato de Seguro Residencial.pdf",
    tipo: "PDF",
    tamanho: "2.5 MB",
    data: "15/12/2023",
    categoria: "Contratos",
    autor: "Admin User",
  },
  {
    id: 2,
    nome: "Apólice de Seguro Auto - João Silva.pdf",
    tipo: "PDF",
    tamanho: "1.8 MB",
    data: "14/12/2023",
    categoria: "Apólices",
    autor: "Admin User",
  },
  {
    id: 3,
    nome: "Relatório Mensal - Novembro 2023.xlsx",
    tipo: "XLSX",
    tamanho: "4.2 MB",
    data: "10/12/2023",
    categoria: "Relatórios",
    autor: "Admin User",
  },
  {
    id: 4,
    nome: "Manual de Procedimentos.docx",
    tipo: "DOCX",
    tamanho: "3.1 MB",
    data: "05/12/2023",
    categoria: "Manuais",
    autor: "Admin User",
  },
  {
    id: 5,
    nome: "Apresentação Institucional.pptx",
    tipo: "PPTX",
    tamanho: "5.7 MB",
    data: "01/12/2023",
    categoria: "Apresentações",
    autor: "Admin User",
  },
]

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState(documentosIniciais)
  const [busca, setBusca] = useState("")

  const documentosFiltrados = documentos.filter(
    (documento) =>
      documento.nome.toLowerCase().includes(busca.toLowerCase()) ||
      documento.categoria.toLowerCase().includes(busca.toLowerCase()) ||
      documento.tipo.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documentos</h2>
          <p className="text-muted-foreground">Gerencie seus documentos e arquivos</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Enviar Arquivo
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Nova Pasta
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Todos os Documentos</CardTitle>
            <CardDescription>Lista de todos os documentos armazenados</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar documentos..."
                className="w-full pl-8 md:w-64"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Tamanho</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Autor</th>
                  <th className="px-4 py-3 font-medium sr-only">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {documentosFiltrados.map((documento) => (
                  <tr key={documento.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        {documento.nome}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{documento.tipo}</td>
                    <td className="px-4 py-3 text-muted-foreground">{documento.tamanho}</td>
                    <td className="px-4 py-3 text-muted-foreground">{documento.data}</td>
                    <td className="px-4 py-3 text-muted-foreground">{documento.categoria}</td>
                    <td className="px-4 py-3 text-muted-foreground">{documento.autor}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">
                        Baixar
                      </Button>
                    </td>
                  </tr>
                ))}
                {documentosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhum documento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
