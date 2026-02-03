import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ChatsPage } from '../pages/ChatsPage';
import { ChatReviewedDetailPage } from '../pages/ChatReviewedDetailPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { IntegrationsPage } from '../pages/IntegrationsPage';
import { IntegrationDetailPage } from '../pages/IntegrationDetailPage';
import { AgentsPage } from '../pages/AgentsPage';
import { AgentDetailPage } from '../pages/AgentDetailPage';
import { TagsPage } from '../pages/TagsPage';
import { StatisticsPage } from '../pages/StatisticsPage';
import { AgentStatisticsPage } from '../pages/AgentStatisticsPage';
import { ManualCheckPage } from '../pages/ManualCheckPage';
import { SettingsPage } from '../pages/SettingsPage';
import { GroupsQAPage } from '../pages/GroupsQAPage';
import { GroupSupportsPage } from '../pages/GroupSupportsPage';
import { MetricsPage } from '../pages/MetricsPage';

const AppContent = () => {
  const { theme } = useTheme();

  // Убеждаемся, что theme определен
  if (!theme) {
    return null; // или можно показать загрузку
  }

  return (
    <StyledThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/integrations/:id" element={<IntegrationDetailPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chats/:id" element={<ChatReviewedDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/statistics/agent/:id" element={<AgentStatisticsPage />} />
          <Route path="/manual-check" element={<ManualCheckPage />} />
          <Route path="/groups-qa" element={<GroupsQAPage />} />
          <Route path="/group-supports" element={<GroupSupportsPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </StyledThemeProvider>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};
