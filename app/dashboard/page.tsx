export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total de Produtos</h3>
            <div className="stat-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">2</div>
          <div className="stat-description">1 com estoque baixo</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Técnicos Ativos</h3>
            <div className="stat-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="stat-value">1</div>
          <div className="stat-description">Equipe técnica disponível</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Clientes</h3>
            <div className="stat-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="stat-value">0</div>
          <div className="stat-description">Clientes cadastrados</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Atendimentos</h3>
            <div className="stat-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                <path d="M9 14l2 2 4-4" />
              </svg>
            </div>
          </div>
          <div className="stat-value">0</div>
          <div className="stat-description">Nenhum em andamento</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Produtos com Estoque Crítico</h2>
              <p>Produtos que precisam de reposição imediata</p>
            </div>
            <div className="section-actions">
              <a href="/dashboard/estoque/minimos" className="button button-outline">
                Configurar Mínimos
              </a>
              <a href="/dashboard/estoque" className="button button-outline">
                Ver Todos
              </a>
            </div>
          </div>

          <div className="section-content">
            <div className="empty-state">
              <div className="empty-icon success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>Tudo em ordem!</h3>
              <p>Não há produtos com estoque crítico no momento.</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Estoque por Técnico</h2>
              <p>Distribuição de produtos entre técnicos</p>
            </div>
            <div className="section-actions">
              <a href="/dashboard/tecnicos" className="button button-outline">
                Ver Todos
              </a>
            </div>
          </div>

          <div className="section-content">
            <div className="empty-state">
              <div className="empty-icon info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h3>Sem dados</h3>
              <p>Não há informações de estoque por técnico disponíveis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
