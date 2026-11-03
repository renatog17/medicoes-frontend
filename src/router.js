import ClientesPage from './pages/ClientesPage.jsx'
import ImoveisPage from './pages/ImoveisPage.jsx'
import MedidoresPage from './pages/MedidoresPage.jsx'
import InstalacoesPage from './pages/InstalacoesPage.jsx'
import FaturasPage from './pages/FaturasPage.jsx'
import { sectionPaths } from './config/routes.js'

export const routes = {
  clientes: { path: sectionPaths.clientes, component: ClientesPage },
  imoveis: { path: sectionPaths.imoveis, component: ImoveisPage },
  medidores: { path: sectionPaths.medidores, component: MedidoresPage },
  instalacoes: { path: sectionPaths.instalacoes, component: InstalacoesPage },
  faturas: { path: sectionPaths.faturas, component: FaturasPage },
}
