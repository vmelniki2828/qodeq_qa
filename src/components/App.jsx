import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { QAMain } from './QAMain';
import { QAChats } from './QAChats';
import { QAAnalytics } from './QAAnalytics';
import { QASettings } from './QASettings';
import { AgentProfile } from './AgentProfile';
import { Layout } from './Layout';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/qa_main" element={<Layout><QAMain /></Layout>} />
        <Route path="/qa_chats" element={<Layout><QAChats /></Layout>} />
        <Route path="/qa_analytics" element={<Layout><QAAnalytics /></Layout>} />
        <Route path="/agent/:agentId" element={<Layout><AgentProfile /></Layout>} />
        <Route path="/qa_settings" element={<Layout><QASettings /></Layout>} />
        <Route path="/qa_settings/integrations" element={<Layout><QASettings /></Layout>} />
        <Route path="/qa_settings/projects" element={<Layout><QASettings /></Layout>} />
        <Route path="/qa_settings/agents" element={<Layout><QASettings /></Layout>} />
        <Route path="/qa_settings/tags" element={<Layout><QASettings /></Layout>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};
