import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PlaygroundPage } from '../pages/PlaygroundPage';
import { SystemPage } from '../pages/SystemPage';
import { TelegramToolsPage } from '../pages/TelegramToolsPage';
import { OpenAIStatsPage } from '../pages/OpenAIStatsPage';
import { UsersPage } from '../pages/UsersPage';
import { UserDetailPage } from '../pages/UserDetailPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { PaymentDetailPage } from '../pages/PaymentDetailPage';
import { PaymentAliasesPage } from '../pages/PaymentAliasesPage';
import { PaymentAliasDetailPage } from '../pages/PaymentAliasDetailPage';
import { PingDataPage } from '../pages/PingDataPage';
import { PingDataDetailPage } from '../pages/PingDataDetailPage';
import { ChatsPage } from '../pages/ChatsPage';
import { ChatDetailPage } from '../pages/ChatDetailPage';
import { MessageTemplatesPage } from '../pages/MessageTemplatesPage';
import { MessageTemplateDetailPage } from '../pages/MessageTemplateDetailPage';
import { TicketsPage } from '../pages/TicketsPage';
import { TicketDetailPage } from '../pages/TicketDetailPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { TicketDataPage } from '../pages/TicketDataPage';
import { TicketDataDetailPage } from '../pages/TicketDataDetailPage';
import { OCRResultsPage } from '../pages/OCRResultsPage';
import { OCRResultsDetailPage } from '../pages/OCRResultsDetailPage';
import { GatewaysPage } from '../pages/GatewaysPage';
import { GatewayDetailPage } from '../pages/GatewayDetailPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { TagsPage } from '../pages/TagsPage';
import { TagDetailPage } from '../pages/TagDetailPage';
import { TeamsPage } from '../pages/TeamsPage';
import { TeamDetailPage } from '../pages/TeamDetailPage';
import { SupportMessagesStatsPage } from '../pages/SupportMessagesStatsPage';
import { HelpdeskTagsStatsPage } from '../pages/HelpdeskTagsStatsPage';

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
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="/telegram-tools" element={<TelegramToolsPage />} />
          <Route path="/openai-stats" element={<OpenAIStatsPage />} />
          <Route path="/support-messages-stats" element={<SupportMessagesStatsPage />} />
          <Route path="/helpdesk-tags-stats" element={<HelpdeskTagsStatsPage />} />
          <Route path="/models/users" element={<UsersPage />} />
          <Route path="/models/users/:id" element={<UserDetailPage />} />
          <Route path="/models/payments" element={<PaymentsPage />} />
          <Route path="/models/payments/:id" element={<PaymentDetailPage />} />
          <Route path="/models/payment-aliases" element={<PaymentAliasesPage />} />
          <Route path="/models/payment-aliases/:id" element={<PaymentAliasDetailPage />} />
          <Route path="/models/ping-data" element={<PingDataPage />} />
          <Route path="/models/ping-data/:id" element={<PingDataDetailPage />} />
          <Route path="/models/chats" element={<ChatsPage />} />
          <Route path="/models/chats/:id" element={<ChatDetailPage />} />
          <Route path="/models/message-templates" element={<MessageTemplatesPage />} />
          <Route path="/models/message-templates/:id" element={<MessageTemplateDetailPage />} />
          <Route path="/models/tickets" element={<TicketsPage />} />
          <Route path="/models/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/models/events" element={<EventsPage />} />
          <Route path="/models/events/:id" element={<EventDetailPage />} />
          <Route path="/models/ticket-data" element={<TicketDataPage />} />
          <Route path="/models/ticket-data/:id" element={<TicketDataDetailPage />} />
          <Route path="/models/ocr-results" element={<OCRResultsPage />} />
          <Route path="/models/ocr-results/:id" element={<OCRResultsDetailPage />} />
          <Route path="/models/gateways" element={<GatewaysPage />} />
          <Route path="/models/gateways/:id" element={<GatewayDetailPage />} />
          <Route path="/models/projects" element={<ProjectsPage />} />
          <Route path="/models/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/models/tags" element={<TagsPage />} />
          <Route path="/models/tags/:id" element={<TagDetailPage />} />
          <Route path="/models/teams" element={<TeamsPage />} />
          <Route path="/models/teams/:id" element={<TeamDetailPage />} />
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
