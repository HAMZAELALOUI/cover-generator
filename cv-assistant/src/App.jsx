import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Routes from './Routes';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes />
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;