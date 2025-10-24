import React, { useState, useEffect } from 'react';
import { Calendar } from './Calendar';
import {
  QAChatsContainer,
  ChatsHeader,
  ChatsTitle,
  ChatsSubtitle,
  ActiveFilters,
  ActiveFiltersLabel,
  ActiveFiltersList,
  ActiveFilterItem,
  ActiveFilterText,
  RemoveFilterBtn,
  FiltersTriggerBtn,
  FilterIcon,
  SlideoutFilters,
  SlideoutContent,
  SlideoutHeader,
  CloseFiltersBtn,
  DateFiltersRow,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterInput,
  FilterActions,
  ApplyFiltersBtn,
  ClearFiltersBtn,
  ChatsContent,
  ChatsSection,
  SectionTitle,
  TableContainer,
  ChatsTable,
  TableHeader,
  TableCell,
  ChatRow,
  UserTypeBadge,
  CheckedBadge,
  ScoreBadge,
  NoData,
  TableLoading,
  LoadingSpinner,
  LoadingText,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitleSection,
  ModalTitle,
  ModalSubtitle,
  ModalCloseBtn,
  CloseIcon,
  ModalTabs,
  ModalTab,
  TabText,
  ModalBody,
  ModalLoading,
  ModalInfoSection,
  InfoList,
  InfoItem,
  InfoLabel,
  InfoValue,
  ModalResultsSection,
  ResultsContainer,
  OperatorsTabs,
  OperatorTab,
  OperatorName,
  OperatorScore,
  ResultsHeader,
  ResultsTitle,
  ResultsSummary,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  ResultsList,
  ResultCard,
  ResultHeader,
  ResultQuestion,
  ResultControls,
  ResultDecision,
  ExpandIcon,
  ResultContent,
  ResultExplanation,
  ResultAdditionalInfo,
  ResultChecked,
  ResultComment,
  ResultTags,
  TagsList,
  TagBadge,
  ModalChatSection,
  ChatContainer,
  ChatHeader,
  ChatTitle,
  ChatStats,
  ChatCount,
  MessagesList,
  MessageCard,
  MessageHeader,
  MessageSenderInfo,
  SenderName,
  SenderType,
  MessageTime,
  MessageContent,
  MessageText,
  ChatLoading,
  NoMessages
} from '../styles/QAChats.styled';

export const QAChats = () => {
  const [chatsData, setChatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatDetails, setChatDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [filters, setFilters] = useState({
    userType: '',
    chatColor: '',
    checked: '',
    username: '',
    project: '',
    createdFrom: '',
    createdTo: ''
  });
  const [filteredChats, setFilteredChats] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Если это первый запрос (нет данных), показываем общую загрузку
        if (!chatsData) {
          setIsLoading(true);
        } else {
          // Если это фильтрация, показываем только загрузку таблицы
          setIsTableLoading(true);
        }
        setError('');

        // Строим URL с параметрами фильтрации
        let url = 'http://185.138.164.88/api/v1/chat/reviewedchat/?page=1&page_size=10';
        
        if (filters.userType) {
          url += `&user_type=${filters.userType}`;
        }
        
        if (filters.chatColor) {
          url += `&chat_color=${filters.chatColor}`;
        }
        
        if (filters.checked) {
          url += `&checked=${filters.checked}`;
        }
        
        if (filters.username) {
          url += `&username=${filters.username}`;
        }
        
        if (filters.project) {
          url += `&project_id=${filters.project}`;
        }
        
        if (filters.createdFrom) {
          url += `&created_from=${filters.createdFrom}`;
        }
        
        if (filters.createdTo) {
          url += `&created_to=${filters.createdTo}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChatsData(data.chats || []);
        setFilteredChats(data.chats || []);
      } catch (err) {
        console.error('Ошибка загрузки чатов:', err);
        setError('Ошибка загрузки данных чатов');
      } finally {
        setIsLoading(false);
        setIsTableLoading(false);
      }
    };

    fetchChats();
  }, [filters.userType, filters.chatColor, filters.checked, filters.username, filters.project, filters.createdFrom, filters.createdTo]);

  // Загрузка проектов
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsProjectsLoading(true);
        const response = await fetch('http://185.138.164.88/api/v1/settings/project/?skip=0&limit=100', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Ошибка загрузки проектов:', err);
      } finally {
        setIsProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCalendarOpen = (calendarType) => {
    setOpenCalendar(calendarType);
  };

  const handleCalendarClose = () => {
    setOpenCalendar(null);
  };

  const clearFilters = () => {
    setFilters({
      userType: '',
      chatColor: '',
      checked: '',
      username: '',
      project: '',
      createdFrom: '',
      createdTo: ''
    });
  };

  const fetchChatDetails = async (chatId) => {
    try {
      setIsDetailsLoading(true);
      setError('');
      
      const response = await fetch(`http://185.138.164.88/api/v1/chat/reviewedchat/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatDetails(data);
      
      // Если есть сообщения в ответе, сохраняем их
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Ошибка загрузки деталей чата:', err);
      setError('Ошибка загрузки деталей чата');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setIsModalOpen(true);
    setActiveTab('info');
    fetchChatDetails(chat.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChat(null);
    setChatDetails(null);
    setMessages([]);
    setActiveTab('info');
    setSelectedOperator('');
    setExpandedQuestions(new Set());
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleResultCheckedToggle = async (chatId, newCheckedValue) => {
    try {
      const response = await fetch(`http://185.138.164.88/api/v1/chat/reviewedchat/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checked: newCheckedValue })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновляем локальное состояние chatDetails
      if (chatDetails) {
        setChatDetails(prevDetails => ({
          ...prevDetails,
          checked: newCheckedValue,
          // Обновляем все результаты всех операторов
          results: prevDetails.results ? Object.keys(prevDetails.results).reduce((acc, operator) => ({
            ...acc,
            [operator]: {
              ...prevDetails.results[operator],
              results: prevDetails.results[operator].results.map(result => ({
                ...result,
                checked: newCheckedValue
              }))
            }
          }), {}) : prevDetails.results
        }));
      }

      // Обновляем статус в главной таблице чатов
      if (chatsData && Array.isArray(chatsData)) {
        setChatsData(prevChats => {
          if (!Array.isArray(prevChats)) {
            console.warn('prevChats не является массивом:', prevChats);
            return prevChats;
          }
          return prevChats.map(chat => 
            chat.id === chatId 
              ? { ...chat, checked: newCheckedValue }
              : chat
          );
        });

        // Обновляем отфильтрованные данные
        setFilteredChats(prevFiltered => {
          if (!Array.isArray(prevFiltered)) {
            return prevFiltered;
          }
          return prevFiltered.map(chat => 
            chat.id === chatId 
              ? { ...chat, checked: newCheckedValue }
              : chat
          );
        });
      }
    } catch (err) {
      console.error('Ошибка обновления статуса checked чата:', err);
      setError('Ошибка обновления статуса чата');
    }
  };


  // Автоматически выбираем первого оператора при загрузке данных
  useEffect(() => {
    if (chatDetails && chatDetails.results && Object.keys(chatDetails.results).length > 0 && !selectedOperator) {
      const firstOperator = Object.keys(chatDetails.results)[0];
      setSelectedOperator(firstOperator);
    }
  }, [chatDetails, selectedOperator]);

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="qa-chats">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Загрузка чатов...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="qa-chats">
          <div className="error-container">
            <div className="error-message">
              <h3>Ошибка загрузки</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QAChatsContainer>
      <div className="page-content">
        <ChatsHeader>
          <ChatsTitle>Чаты</ChatsTitle>
          <ChatsSubtitle>Управление чатами и сообщениями</ChatsSubtitle>
          
          {/* Отображение активных фильтров */}
          {Object.values(filters).filter(value => value !== '').length > 0 && (
            <ActiveFilters>
              <ActiveFiltersLabel>Активные фильтры:</ActiveFiltersLabel>
              <ActiveFiltersList>
                {filters.userType && (
                  <ActiveFilterItem>
                    <ActiveFilterText>Тип пользователя: {filters.userType}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('userType', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
                {filters.chatColor && (
                  <ActiveFilterItem>
                    <ActiveFilterText>Цвет чата: {filters.chatColor}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('chatColor', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
                {filters.checked && (
                  <ActiveFilterItem>
                    <ActiveFilterText>Проверено: {filters.checked === 'true' ? 'Да' : 'Нет'}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('checked', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
                {filters.username && (
                  <ActiveFilterItem>
                    <ActiveFilterText>Пользователь: {filters.username}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('username', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
                {filters.project && (
                  <ActiveFilterItem>
                    <ActiveFilterText>Проект: {projects.find(p => p.id === filters.project)?.title || filters.project}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('project', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
                {filters.createdFrom && (
                  <ActiveFilterItem>
                    <ActiveFilterText>С: {new Date(filters.createdFrom).toLocaleDateString('ru-RU')}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('createdFrom', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
                {filters.createdTo && (
                  <ActiveFilterItem>
                    <ActiveFilterText>По: {new Date(filters.createdTo).toLocaleDateString('ru-RU')}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('createdTo', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
              </ActiveFiltersList>
            </ActiveFilters>
          )}
        </ChatsHeader>
        
        <FiltersTriggerBtn onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
          <FilterIcon>🔍</FilterIcon>
        </FiltersTriggerBtn>
        <SlideoutFilters isOpen={isFiltersOpen}>
          <SlideoutContent>
            <SlideoutHeader>
              <h3>Filters</h3>
              <CloseFiltersBtn onClick={() => setIsFiltersOpen(false)}>
                ×
              </CloseFiltersBtn>
            </SlideoutHeader>
            
            <div className="slideout-body">
              <DateFiltersRow>
                <FilterGroup>
                  <FilterLabel>Created From:</FilterLabel>
                  <Calendar
                    value={filters.createdFrom}
                    onChange={(value) => handleFilterChange('createdFrom', value)}
                    placeholder="Select start date"
                    isOpen={openCalendar === 'createdFrom'}
                    onOpen={() => handleCalendarOpen('createdFrom')}
                    onClose={handleCalendarClose}
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Created To:</FilterLabel>
                  <Calendar
                    value={filters.createdTo}
                    onChange={(value) => handleFilterChange('createdTo', value)}
                    placeholder="Select end date"
                    isOpen={openCalendar === 'createdTo'}
                    onOpen={() => handleCalendarOpen('createdTo')}
                    onClose={handleCalendarClose}
                  />
                </FilterGroup>
              </DateFiltersRow>

              <FilterGroup>
                <FilterLabel>User Type:</FilterLabel>
                <FilterSelect 
                  value={filters.userType}
                  onChange={(e) => handleFilterChange('userType', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="other">Other</option>
                  <option value="vip">VIP</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Chat Color:</FilterLabel>
                <FilterSelect 
                  value={filters.chatColor}
                  onChange={(e) => handleFilterChange('chatColor', e.target.value)}
                >
                  <option value="">All Colors</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="red">Red</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Checked:</FilterLabel>
                <FilterSelect 
                  value={filters.checked}
                  onChange={(e) => handleFilterChange('checked', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Username:</FilterLabel>
                <FilterInput 
                  type="text"
                  placeholder="Search username..."
                  value={filters.username}
                  onChange={(e) => handleFilterChange('username', e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Project:</FilterLabel>
                <FilterSelect 
                  value={filters.project}
                  onChange={(e) => handleFilterChange('project', e.target.value)}
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterActions>
                <ClearFiltersBtn onClick={clearFilters}>
                  Clear All
                </ClearFiltersBtn>
                <ApplyFiltersBtn onClick={() => setIsFiltersOpen(false)}>
                  Apply
                </ApplyFiltersBtn>
              </FilterActions>
            </div>
          </SlideoutContent>
        </SlideoutFilters>
        
        <ChatsContent>
          <ChatsSection>
            <SectionTitle>Список чатов</SectionTitle>
            {isTableLoading ? (
              <TableLoading>
                <LoadingSpinner />
                <LoadingText>Загрузка таблицы...</LoadingText>
              </TableLoading>
            ) : (
              <TableContainer>
                <ChatsTable>
                  <thead>
                    <tr>
                      <TableHeader>Username</TableHeader>
                      <TableHeader>Chat ID</TableHeader>
                      <TableHeader>Thread ID</TableHeader>
                      <TableHeader>User Type</TableHeader>
                      <TableHeader>Checked</TableHeader>
                      <TableHeader>Score</TableHeader>
                      <TableHeader>Created At</TableHeader>
                      <TableHeader>Duration</TableHeader>
                      <TableHeader>Project</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChats && filteredChats.length > 0 ? (
                      filteredChats.map((chat, index) => (
                        <ChatRow key={chat.id || index} onClick={() => handleChatClick(chat)}>
                          <TableCell>
                            {chat.username && chat.username.length > 0 ? chat.username.join(', ') : '-'}
                          </TableCell>
                          <TableCell>{chat.chat_id}</TableCell>
                          <TableCell>{chat.thread_id}</TableCell>
                          <TableCell>
                            <UserTypeBadge>{chat.user_type}</UserTypeBadge>
                          </TableCell>
                          <TableCell>
                            <CheckedBadge checked={chat.checked}>
                              {chat.checked ? '✓' : '✗'}
                            </CheckedBadge>
                          </TableCell>
                          <TableCell>
                            <ScoreBadge style={{ backgroundColor: chat.color || '#000' }}>
                              {chat.score}
                            </ScoreBadge>
                          </TableCell>
                          <TableCell>
                            {new Date(chat.created_chat_at).toLocaleString()}
                          </TableCell>
                          <TableCell>{chat.chat_duration}</TableCell>
                          <TableCell>{chat.project_title}</TableCell>
                        </ChatRow>
                      ))
                    ) : (
                      <tr>
                        <TableCell colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                          <NoData>{isTableLoading ? 'Загрузка...' : 'Чаты не найдены'}</NoData>
                        </TableCell>
                      </tr>
                    )}
                  </tbody>
                </ChatsTable>
              </TableContainer>
            )}
          </ChatsSection>
        </ChatsContent>
      </div>
      
      {/* Модальное окно с деталями чата */}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitleSection>
                <ModalTitle>Детали чата</ModalTitle>
                <ModalSubtitle>Информация о чате и его участниках</ModalSubtitle>
              </ModalTitleSection>
              <ModalCloseBtn onClick={closeModal}>
                <CloseIcon>×</CloseIcon>
              </ModalCloseBtn>
            </ModalHeader>
            
            {/* Табы */}
            <ModalTabs>
              <ModalTab 
                className={activeTab === 'info' ? 'active' : ''}
                onClick={() => handleTabChange('info')}
              >
                <TabText>Информация</TabText>
              </ModalTab>
              <ModalTab 
                className={activeTab === 'results' ? 'active' : ''}
                onClick={() => handleTabChange('results')}
              >
                <TabText>Результаты</TabText>
              </ModalTab>
              <ModalTab 
                className={activeTab === 'chat' ? 'active' : ''}
                onClick={() => handleTabChange('chat')}
              >
                <TabText>Чат</TabText>
              </ModalTab>
            </ModalTabs>
            
            <ModalBody>
              {isDetailsLoading ? (
                <ModalLoading>
                  <LoadingSpinner />
                  <LoadingText>Загрузка деталей чата...</LoadingText>
                </ModalLoading>
              ) : activeTab === 'info' && chatDetails ? (
                <ModalInfoSection>
                  <InfoList>
                    <InfoItem>
                      <InfoLabel>ID чата:</InfoLabel>
                      <InfoValue>{chatDetails.id}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Chat ID:</InfoLabel>
                      <InfoValue>{chatDetails.chat_id}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Thread ID:</InfoLabel>
                      <InfoValue>{chatDetails.thread_id}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Username:</InfoLabel>
                      <InfoValue>
                        {chatDetails.username && chatDetails.username.length > 0 
                          ? chatDetails.username.join(', ') 
                          : 'Не указан'
                        }
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Тип пользователя:</InfoLabel>
                      <InfoValue>
                        <UserTypeBadge>{chatDetails.user_type}</UserTypeBadge>
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Балл:</InfoLabel>
                      <InfoValue>
                        <ScoreBadge style={{ backgroundColor: chatDetails.color || '#000' }}>
                          {chatDetails.score}
                        </ScoreBadge>
                      </InfoValue>
                    </InfoItem>
                    <InfoItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof handleResultCheckedToggle === 'function') {
                          handleResultCheckedToggle(chatDetails.id, !chatDetails.checked);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <InfoLabel>Проверено:</InfoLabel>
                      <InfoValue>
                        <CheckedBadge checked={chatDetails.checked}>
                          {chatDetails.checked ? '✓' : '✗'}
                        </CheckedBadge>
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Длительность:</InfoLabel>
                      <InfoValue>{chatDetails.chat_duration}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Создан:</InfoLabel>
                      <InfoValue>
                        {new Date(chatDetails.created_chat_at).toLocaleString()}
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Проект:</InfoLabel>
                      <InfoValue>{chatDetails.project_title}</InfoValue>
                    </InfoItem>
                  </InfoList>
                </ModalInfoSection>
              ) : activeTab === 'results' && chatDetails ? (
                <ModalResultsSection>
                  {chatDetails.results && Object.keys(chatDetails.results).length > 0 ? (
                    <ResultsContainer>
                      {/* Табы операторов */}
                      <OperatorsTabs>
                        {Object.keys(chatDetails.results).map(operatorName => (
                          <OperatorTab
                            key={operatorName}
                            className={selectedOperator === operatorName ? 'active' : ''}
                            onClick={() => setSelectedOperator(operatorName)}
                          >
                            <OperatorName>{operatorName}</OperatorName>
                            <OperatorScore>
                              {chatDetails.results[operatorName].score}
                            </OperatorScore>
                          </OperatorTab>
                        ))}
                      </OperatorsTabs>

                      {/* Отображение результатов выбранного оператора */}
                      {selectedOperator && chatDetails.results[selectedOperator] && (
                        <div>
                          <ResultsList>
                            {chatDetails.results[selectedOperator].results && chatDetails.results[selectedOperator].results.map((result, index) => {
                              const questionId = result.id || index;
                              const isExpanded = expandedQuestions.has(questionId);
                              return (
                                <ResultCard key={questionId}>
                                  <ResultHeader onClick={() => toggleQuestion(questionId)}>
                                    <ResultQuestion>{result.question}</ResultQuestion>
                                    <ResultControls>
                                      <ResultDecision passed={result.decision}>
                                        {result.decision ? '✓' : '✗'}
                                      </ResultDecision>
                                      <ExpandIcon expanded={isExpanded}>
                                        ▼
                                      </ExpandIcon>
                                    </ResultControls>
                                  </ResultHeader>
                                  {isExpanded && (
                                    <ResultContent>
                                      <ResultExplanation>{result.explanation}</ResultExplanation>
                                      {(result.checked !== undefined || result.manager_comment || (result.tags && result.tags.length > 0)) && (
                                        <ResultAdditionalInfo>
                                          {result.checked && (
                                            <ResultChecked 
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (typeof handleResultCheckedToggle === 'function') {
                                                  handleResultCheckedToggle(chatDetails.id, !result.checked);
                                                }
                                              }}
                                              style={{ cursor: 'pointer' }}
                                            >
                                              <InfoLabel>Проверено:</InfoLabel>
                                              <CheckedBadge checked={result.checked}>✓</CheckedBadge>
                                            </ResultChecked>
                                          )}
                                          {!result.checked && (
                                            <ResultChecked 
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (typeof handleResultCheckedToggle === 'function') {
                                                  handleResultCheckedToggle(chatDetails.id, !result.checked);
                                                }
                                              }}
                                              style={{ cursor: 'pointer' }}
                                            >
                                              <InfoLabel>Проверено:</InfoLabel>
                                              <CheckedBadge checked={result.checked}>✗</CheckedBadge>
                                            </ResultChecked>
                                          )}
                                          {result.manager_comment && (
                                            <ResultComment>
                                              <InfoLabel>Комментарий:</InfoLabel>
                                              <InfoValue>{result.manager_comment}</InfoValue>
                                            </ResultComment>
                                          )}
                                          {result.tags && result.tags.length > 0 && (
                                            <ResultTags>
                                              <InfoLabel>Теги:</InfoLabel>
                                              <TagsList>
                                                {result.tags.map((tag, tagIndex) => (
                                                  <TagBadge key={tagIndex}>{tag}</TagBadge>
                                                ))}
                                              </TagsList>
                                            </ResultTags>
                                          )}
                                        </ResultAdditionalInfo>
                                      )}
                                    </ResultContent>
                                  )}
                                </ResultCard>
                              );
                            })}
                          </ResultsList>
                        </div>
                      )}

                      {/* Сообщение если оператор не выбран */}
                      {!selectedOperator && (
                        <NoData>Please select an operator to view results</NoData>
                      )}
                    </ResultsContainer>
                  ) : (
                    <NoData>No results available</NoData>
                  )}
                </ModalResultsSection>
              ) : activeTab === 'chat' ? (
                <ModalChatSection>
                  {isMessagesLoading ? (
                    <ChatLoading>
                      <LoadingSpinner />
                      <LoadingText>Загрузка сообщений...</LoadingText>
                    </ChatLoading>
                  ) : messages.length > 0 ? (
                    <ChatContainer>
                      <MessagesList>
                        {messages.map((message, index) => {
                          const isAgent = message.author?.type === 'agent';
                          return (
                            <MessageCard key={index} isAgent={isAgent}>
                              <MessageHeader>
                                <MessageSenderInfo>
                                  <SenderName>{message.author?.name || 'Unknown'}</SenderName>
                                  <SenderType isAgent={isAgent}>
                                    {isAgent ? 'Агент' : 'Пользователь'}
                                  </SenderType>
                                </MessageSenderInfo>
                                <MessageTime>
                                  {message.created_at ? new Date(message.created_at).toLocaleTimeString('ru-RU', { 
                                    hour: '2-digit', 
                                    minute: '2-digit', 
                                    second: '2-digit' 
                                  }) : '-'}
                                </MessageTime>
                              </MessageHeader>
                              <MessageContent>
                                <MessageText>{message.text || '-'}</MessageText>
                              </MessageContent>
                            </MessageCard>
                          );
                        })}
                      </MessagesList>
                    </ChatContainer>
                  ) : (
                    <NoMessages>No messages available</NoMessages>
                  )}
                </ModalChatSection>
              ) : (
                <NoData>Failed to load chat details</NoData>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </QAChatsContainer>
  );
};
