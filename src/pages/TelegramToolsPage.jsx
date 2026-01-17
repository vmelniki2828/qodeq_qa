import { useState } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { HiShieldCheck, HiUserGroup, HiChatBubbleLeftRight } from 'react-icons/hi2';

const PageContent = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const OverviewSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 20px;
`;

const OverviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const OverviewTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const OverviewSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const SectionBlock = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SectionIcon = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const SectionDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.5;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 14px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  box-sizing: border-box;
  line-height: 1;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    opacity: 0.9;
  }
`;

const StatusText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.5;
`;

export const TelegramToolsPage = () => {
  const { theme } = useTheme();
  const [chatId, setChatId] = useState('');
  const [hoursBack, setHoursBack] = useState('1');
  const [status, setStatus] = useState('—');
  const [usersLoaded, setUsersLoaded] = useState(false);

  const handleValidateAccess = () => {
    // Логика валидации доступа
    console.log('Validate access', { chatId, hoursBack });
    setStatus('Validating...');
  };

  const handleLoadChatUsers = () => {
    // Логика загрузки пользователей
    console.log('Load chat users', { chatId });
    setUsersLoaded(true);
    setStatus('Loaded');
  };

  const handleProcessMessages = () => {
    // Логика обработки сообщений
    console.log('Process messages', { chatId, hoursBack });
  };

  return (
    <Layout>
      <PageContent>
        <OverviewSection theme={theme}>
          <OverviewHeader>
            <OverviewTitle theme={theme}>Telegram Tools</OverviewTitle>
            <OverviewSubtitle theme={theme}>Telegram integration and tools.</OverviewSubtitle>
          </OverviewHeader>
        </OverviewSection>

        <ContentWrapper>
          {/* Chat context section */}
          <SectionBlock theme={theme}>
            <SectionHeader>
              <SectionIcon theme={theme}>
                <HiShieldCheck />
              </SectionIcon>
              <SectionTitle theme={theme}>Chat context</SectionTitle>
            </SectionHeader>
            <SectionDescription theme={theme}>
              Provide chat identifier (numeric ID or @username) and optional hours window.
            </SectionDescription>
            <FormGroup>
              <FormLabel theme={theme} htmlFor="chat-id">
                Chat ID or username
              </FormLabel>
              <FormInput
                theme={theme}
                id="chat-id"
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="-1001234567890 or @channel"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel theme={theme} htmlFor="hours-back">
                Hours back (0.1 - 168)
              </FormLabel>
              <FormInput
                theme={theme}
                id="hours-back"
                type="number"
                value={hoursBack}
                onChange={(e) => setHoursBack(e.target.value)}
                min="0.1"
                max="168"
                step="0.1"
              />
            </FormGroup>
            <ButtonsRow>
              <ActionButton theme={theme} onClick={handleValidateAccess}>
                Validate access
              </ActionButton>
              <ActionButton theme={theme} onClick={handleLoadChatUsers}>
                Load chat users
              </ActionButton>
              <StatusText theme={theme}>Status: {status}</StatusText>
            </ButtonsRow>
          </SectionBlock>

          {/* Chat participants section */}
          <SectionBlock theme={theme}>
            <SectionHeader>
              <SectionIcon theme={theme}>
                <HiUserGroup />
              </SectionIcon>
              <SectionTitle theme={theme}>Chat participants</SectionTitle>
            </SectionHeader>
            <SectionDescription theme={theme}>
              Operators currently available in the chat. Use this list to copy operator IDs when configuring automations.
            </SectionDescription>
            {!usersLoaded ? (
              <InfoText theme={theme}>
                No users loaded yet. Validate the chat and click "Load chat users".
              </InfoText>
            ) : (
              <InfoText theme={theme}>
                Users loaded successfully.
              </InfoText>
            )}
          </SectionBlock>

          {/* Process replies section */}
          <SectionBlock theme={theme}>
            <SectionHeader>
              <SectionIcon theme={theme}>
                <HiChatBubbleLeftRight />
              </SectionIcon>
              <SectionTitle theme={theme}>Process replies</SectionTitle>
            </SectionHeader>
            <SectionDescription theme={theme}>
              Scan the chat history for replies in the selected time window, classify with AI, and push updates to Helpdesk.
            </SectionDescription>
            <ButtonsRow>
              <ActionButton theme={theme} onClick={handleProcessMessages}>
                Process messages
              </ActionButton>
            </ButtonsRow>
            <InfoText theme={theme}>
              Run processing to see statistics.
            </InfoText>
          </SectionBlock>
        </ContentWrapper>
      </PageContent>
    </Layout>
  );
};

