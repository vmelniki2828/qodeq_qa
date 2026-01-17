import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { HiChevronLeft, HiXMark } from 'react-icons/hi2';
import { Loader } from '../components/Loader';

// Функция для получения токена из куки
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const PageContent = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
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

const TabsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px 8px 0 0;
  padding: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
`;

const TabsWrapper = styled.div`
  display: flex;
  overflow-x: auto;
`;

const RunButtonContainer = styled.div`
  padding: 0 20px;
  flex-shrink: 0;
`;

const Tab = styled.button`
  padding: 12px 20px;
  border: none;
  background-color: transparent;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.secondary};
  font-size: 14px;
  font-weight: ${({ $isActive }) => ($isActive ? '500' : '400')};
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  white-space: nowrap;
  border-bottom: ${({ $isActive, theme }) =>
    $isActive ? `2px solid ${theme.colors.primary}` : '2px solid transparent'};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  height: 100%;

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

const ExtractorForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const FormTextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  min-height: 150px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FileUploadGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const FileUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const FileName = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const RemoveFileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
  height: 100%;
`;

const LeftPanel = styled.div`
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : '50%')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
`;

const Divider = styled.div`
  width: ${({ $isHidden }) => ($isHidden ? '0' : '1px')};
  background-color: ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  position: relative;
  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};
  pointer-events: ${({ $isHidden }) => ($isHidden ? 'none' : 'auto')};
  overflow: hidden;
  transition: opacity 0.3s ease, width 0.3s ease;
`;

const RightPanel = styled.div`
  width: ${({ $isVisible }) => ($isVisible ? '50%' : '0')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  transition: opacity 0.3s ease, width 0.3s ease;
`;

const RightContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;

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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  align-self: flex-start;
  margin-bottom: 20px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const ResultContent = styled.pre`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const RunButton = styled.button`
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
  min-height: 14px;
  box-sizing: border-box;
  line-height: 1;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    opacity: 0.9;
  }
`;

export const PlaygroundPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('extractor');
  const [ticketId, setTicketId] = useState('');
  const [link, setLink] = useState('');
  const [fileName, setFileName] = useState('No file chosen');
  const [ticketDataFullTicketId, setTicketDataFullTicketId] = useState('');
  const [ticketDataFullProjects, setTicketDataFullProjects] = useState('');
  const [ticketDataLiteTicketId, setTicketDataLiteTicketId] = useState('');
  const [ticketDataLiteProjects, setTicketDataLiteProjects] = useState('');
  const [ticketPingValidatorTicketId, setTicketPingValidatorTicketId] = useState('');
  const [classifierMessageText, setClassifierMessageText] = useState('');
  const [classifierContext, setClassifierContext] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractorResult, setExtractorResult] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'extractor', label: 'Extractor' },
    { id: 'ticket-data-full', label: 'Ticket Data (Full)' },
    { id: 'ticket-data-lite', label: 'Ticket Data (Lite)' },
    { id: 'ticket-ping-validator', label: 'Ticket Ping Validator' },
    { id: 'classifier', label: 'Classifier' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    } else {
      setFileName('No file chosen');
      setSelectedFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFileName('No file chosen');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRunExtractor = async () => {
    setIsLoading(true);
    setExtractorResult(null);
    setIsSidebarOpen(true); // Открываем меню сразу при начале загрузки

    try {
      const token = getCookie('rb_admin_token');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let response;

      // Если есть файл - используем by-file endpoint
      if (selectedFile) {
        const formData = new FormData();
        formData.append('ticket_id', ticketId || 'asd');
        formData.append('file', selectedFile);

        // Не устанавливаем Content-Type для FormData - браузер установит автоматически с boundary
        const fileHeaders = { ...headers };
        // Удаляем Content-Type если он был установлен, чтобы браузер мог установить multipart/form-data с boundary
        delete fileHeaders['Content-Type'];

        response = await fetch('https://repayment.cat-tools.com/api/v1/admin/playground/extractor/by-file', {
          method: 'POST',
          headers: fileHeaders,
          body: formData,
        });
      } 
      // Если нет файла, но есть ticket_id и link - используем by-link endpoint
      else if (ticketId && link) {
        const formData = new FormData();
        formData.append('ticket_id', ticketId);
        formData.append('link', link);

        // Не устанавливаем Content-Type для FormData - браузер установит автоматически с boundary
        const linkHeaders = { ...headers };
        delete linkHeaders['Content-Type'];

        response = await fetch('https://repayment.cat-tools.com/api/v1/admin/playground/extractor/by-link', {
          method: 'POST',
          headers: linkHeaders,
          body: formData,
        });
      } else {
        alert('Пожалуйста, укажите Ticket ID и Link, или загрузите файл');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExtractorResult(data);
    } catch (err) {
      console.error('Ошибка при выполнении запроса:', err);
      setExtractorResult({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleRunTicketDataFull = async () => {
    setIsLoading(true);
    setExtractorResult(null);
    setIsSidebarOpen(true); // Открываем меню сразу при начале загрузки

    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://repayment.cat-tools.com/api/v1/admin/playground/ticket-data/full', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ticket_id: ticketDataFullTicketId || 'фыв',
          projects: ticketDataFullProjects || 'фыв',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExtractorResult(data);
    } catch (err) {
      console.error('Ошибка при выполнении запроса:', err);
      setExtractorResult({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunTicketDataLite = () => {
    // Логика запуска Ticket Data (Lite)
    console.log('Run Ticket Data (Lite)', { ticketId: ticketDataLiteTicketId, projects: ticketDataLiteProjects });
  };

  const handleRunTicketPingValidator = () => {
    // Логика запуска Ticket Ping Validator
    console.log('Run Ping Validator', { ticketId: ticketPingValidatorTicketId });
  };

  const handleRunClassifier = () => {
    // Логика запуска Classifier
    console.log('Run Classifier', { messageText: classifierMessageText, context: classifierContext });
  };

  return (
    <Layout>
      <PageContent>
        <OverviewSection theme={theme}>
          <OverviewHeader>
            <OverviewTitle theme={theme}>Playground</OverviewTitle>
            <OverviewSubtitle theme={theme}>Test and experiment with features.</OverviewSubtitle>
          </OverviewHeader>
        </OverviewSection>

        <TabsContainer theme={theme}>
          <TabsWrapper>
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                theme={theme}
                $isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Tab>
            ))}
          </TabsWrapper>
          {activeTab === 'extractor' && (
            <RunButtonContainer>
              <RunButton theme={theme} onClick={handleRunExtractor}>
                Run Extractor
              </RunButton>
            </RunButtonContainer>
          )}
          {activeTab === 'ticket-data-full' && (
            <RunButtonContainer>
              <RunButton theme={theme} onClick={handleRunTicketDataFull}>
                Run Ticket Data (Full)
              </RunButton>
            </RunButtonContainer>
          )}
          {activeTab === 'ticket-data-lite' && (
            <RunButtonContainer>
              <RunButton theme={theme} onClick={handleRunTicketDataLite}>
                Run Ticket Data (Lite)
              </RunButton>
            </RunButtonContainer>
          )}
          {activeTab === 'ticket-ping-validator' && (
            <RunButtonContainer>
              <RunButton theme={theme} onClick={handleRunTicketPingValidator}>
                Run Ping Validator
              </RunButton>
            </RunButtonContainer>
          )}
          {activeTab === 'classifier' && (
            <RunButtonContainer>
              <RunButton theme={theme} onClick={handleRunClassifier}>
                Run Classifier
              </RunButton>
            </RunButtonContainer>
          )}
        </TabsContainer>

        <PageContainer>
          <LeftPanel $isFullWidth={!isSidebarOpen}>
            <ContentWrapper>
          {activeTab === 'extractor' && (
            <ExtractorForm>
              <FormGroup>
                <FormLabel theme={theme} htmlFor="ticket-id">
                  Ticket ID
                </FormLabel>
                <FormInput
                  theme={theme}
                  id="ticket-id"
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="uuid"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel theme={theme} htmlFor="link">
                  Link (text/pdf)
                </FormLabel>
                <FormInput
                  theme={theme}
                  id="link"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                />
              </FormGroup>

              <FileUploadGroup>
                <FormLabel theme={theme}>Or upload file</FormLabel>
                <FileUploadContainer>
                  <FileInput
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <FileInputLabel theme={theme} htmlFor="file-upload">
                    Choose file
                  </FileInputLabel>
                  <FileName theme={theme}>{fileName}</FileName>
                  {selectedFile && (
                    <RemoveFileButton theme={theme} onClick={handleRemoveFile} type="button">
                      <HiXMark size={16} />
                    </RemoveFileButton>
                  )}
                </FileUploadContainer>
              </FileUploadGroup>

            </ExtractorForm>
          )}

          {activeTab === 'ticket-data-full' && (
            <ExtractorForm>
              <FormGroup>
                <FormLabel theme={theme} htmlFor="ticket-data-full-ticket-id">
                  Ticket ID
                </FormLabel>
                <FormInput
                  theme={theme}
                  id="ticket-data-full-ticket-id"
                  type="text"
                  value={ticketDataFullTicketId}
                  onChange={(e) => setTicketDataFullTicketId(e.target.value)}
                  placeholder="uuid"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel theme={theme} htmlFor="ticket-data-full-projects">
                  Projects (comma-separated, optional)
                </FormLabel>
                <FormInput
                  theme={theme}
                  id="ticket-data-full-projects"
                  type="text"
                  value={ticketDataFullProjects}
                  onChange={(e) => setTicketDataFullProjects(e.target.value)}
                  placeholder="proj1, proj2"
                />
              </FormGroup>
            </ExtractorForm>
          )}

          {activeTab === 'ticket-data-lite' && (
            <ExtractorForm>
              <FormGroup>
                <FormLabel theme={theme} htmlFor="ticket-data-lite-ticket-id">
                  Ticket ID
                </FormLabel>
                <FormInput
                  theme={theme}
                  id="ticket-data-lite-ticket-id"
                  type="text"
                  value={ticketDataLiteTicketId}
                  onChange={(e) => setTicketDataLiteTicketId(e.target.value)}
                  placeholder="uuid"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel theme={theme} htmlFor="ticket-data-lite-projects">
                  Projects (comma-separated, optional)
                </FormLabel>
                <FormInput
                  theme={theme}
                  id="ticket-data-lite-projects"
                  type="text"
                  value={ticketDataLiteProjects}
                  onChange={(e) => setTicketDataLiteProjects(e.target.value)}
                  placeholder="proj1, proj2"
                />
              </FormGroup>
            </ExtractorForm>
          )}

          {activeTab === 'ticket-ping-validator' && (
            <ExtractorForm>
              <FormGroup>
                <FormLabel theme={theme} htmlFor="ticket-ping-validator-ticket-id">
                  Ticket ID
                </FormLabel>
                <FormInput
                  theme={theme}
                  id="ticket-ping-validator-ticket-id"
                  type="text"
                  value={ticketPingValidatorTicketId}
                  onChange={(e) => setTicketPingValidatorTicketId(e.target.value)}
                  placeholder="uuid"
                />
              </FormGroup>
            </ExtractorForm>
          )}

          {activeTab === 'classifier' && (
            <ExtractorForm>
              <FormGroup>
                <FormLabel theme={theme} htmlFor="classifier-message-text">
                  Message text
                </FormLabel>
                <FormTextArea
                  theme={theme}
                  id="classifier-message-text"
                  value={classifierMessageText}
                  onChange={(e) => setClassifierMessageText(e.target.value)}
                  placeholder=""
                />
              </FormGroup>

              <FormGroup>
                <FormLabel theme={theme} htmlFor="classifier-context">
                  Context (JSON, optional)
                </FormLabel>
                <FormInput
                  theme={theme}
                  id="classifier-context"
                  type="text"
                  value={classifierContext}
                  onChange={(e) => setClassifierContext(e.target.value)}
                  placeholder='{"reply_to_message_id": 12345}'
                />
              </FormGroup>
            </ExtractorForm>
            )}
            </ContentWrapper>
          </LeftPanel>

          <Divider $isHidden={!isSidebarOpen} theme={theme} />

          <RightPanel $isVisible={isSidebarOpen} theme={theme}>
            <RightContent theme={theme}>
              <BackButton onClick={handleCloseSidebar} theme={theme}>
                <HiChevronLeft size={16} />
                Back
              </BackButton>

              {isLoading ? (
                <Loader />
              ) : extractorResult && (
                <ResultContent theme={theme}>
                  {extractorResult.error 
                    ? `Ошибка: ${extractorResult.error}`
                    : JSON.stringify(extractorResult, null, 2)}
                </ResultContent>
              )}
            </RightContent>
          </RightPanel>
        </PageContainer>
      </PageContent>
    </Layout>
  );
};

