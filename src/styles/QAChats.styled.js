import styled from 'styled-components';

// Основной контейнер
export const QAChatsContainer = styled.div`
  background: transparent;
  font-family: var(--font-family-base);
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0;
  margin: 0;
  min-height: 100%;
  position: relative;
`;

// Заголовок страницы
export const ChatsHeader = styled.div`
  text-align: center;
  padding-top: 16px;
  position: relative;
`;

export const ChatsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px 0;
  line-height: 1.2;
`;

export const ChatsSubtitle = styled.p`
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0 0 24px 0;
  line-height: 1.4;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

// Активные фильтры
export const ActiveFilters = styled.div`
  margin-top: 0;
  margin-bottom: 0;
`;

export const ActiveFiltersLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 8px;
`;

export const ActiveFiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

export const ActiveFilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.8rem;
`;

export const ActiveFilterText = styled.span`
  color: var(--color-text);
`;

export const RemoveFilterBtn = styled.button`
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: rgba(239, 68, 68, 1);
  }
`;

export const FiltersTriggerBtn = styled.button`
  background: var(--color-bg-panel);
  color: var(--color-text);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: absolute;
  top: 32px;
  right: 32px;
  z-index: 10;
  width: 40px;
  height: 40px;

  &:hover {
    background: var(--color-bg);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    padding: 6px;
    top: 24px;
    right: 24px;
  }
`;

export const FilterIcon = styled.span`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FilterText = styled.span`
  font-weight: 500;
`;

export const FilterBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-bg);
`;

// Слайдер фильтров
export const SlideoutFilters = styled.div`
  position: absolute;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100%;
  background: var(--color-bg);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

export const SlideoutContent = styled.div`
  padding: 20px;
`;

export const SlideoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);

  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-text);
  }
`;

export const CloseFiltersBtn = styled.button`
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-bg-panel);
    color: var(--color-text);
  }
`;

export const DateFiltersRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  margin-bottom: 16px;
`;

export const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-text);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
`;

export const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-text);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: var(--color-text-muted);
  }
`;

export const FilterActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
`;

export const ApplyFiltersBtn = styled.button`
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: var(--color-text-muted);
    transform: translateY(-1px);
  }
`;

export const ClearFiltersBtn = styled.button`
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: var(--color-bg-panel);
    color: var(--color-text);
    border-color: var(--color-text);
  }
`;

// Контент чатов
export const ChatsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ChatsSection = styled.div`
  background: var(--color-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
`;

// Таблица чатов
export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

export const ChatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg);
  border-radius: 8px;
  overflow: hidden;
  min-width: 800px;

  thead {
    background: var(--color-bg-panel);
  }

  thead tr {
    background: var(--color-bg-panel);
  }

  tbody tr {
    background: var(--color-bg);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.02);
  }
`;

export const TableHeader = styled.th`
  background: var(--color-bg-panel);
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 16px 12px;
  text-align: left;
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
`;

export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 0.9rem;
  vertical-align: middle;
  white-space: nowrap;
`;

export const ChatRow = styled.tr`
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: var(--color-bg-panel) !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Бейджи
export const UserTypeBadge = styled.span`
  background: rgba(59, 130, 246, 0.15);
  color: rgba(59, 130, 246, 1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(59, 130, 246, 0.3);
`;

export const CheckedBadge = styled.span`
  background: ${props => props.checked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.checked ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${props => props.checked ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const ScoreBadge = styled.span`
  background: ${props => props.style?.backgroundColor || 'rgba(156, 163, 175, 0.15)'};
  color: var(--color-text);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(156, 163, 175, 0.3);
`;

// Состояния загрузки и ошибок
export const NoData = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-muted);
  font-size: 1rem;
`;

export const TableLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
`;

export const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-text);
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

export const LoadingText = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
`;

// Модальное окно
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
  animation: fadeInOverlay 0.3s ease-out;

  @keyframes fadeInOverlay {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(4px);
    }
  }
`;

export const ModalContent = styled.div`
  background: var(--color-bg);
  border-radius: 16px;
  max-width: 1400px;
  width: 98%;
  max-height: 95vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: scale(0.9) translateY(20px);
  opacity: 0;
  animation: modalSlideIn 0.3s ease-out forwards;
  display: flex;
  flex-direction: column;

  @keyframes modalSlideIn {
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px 20px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--color-bg-panel);
  flex-shrink: 0;
`;

export const ModalTitleSection = styled.div`
  flex: 1;
`;

export const ModalTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
`;

export const ModalSubtitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
`;

export const ModalCloseBtn = styled.button`
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-bg-panel);
    color: var(--color-text);
  }
`;

export const CloseIcon = styled.span`
  display: block;
  line-height: 1;
`;

// Табы
export const ModalTabs = styled.div`
  display: flex;
  background: var(--color-bg-panel);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 32px;
  flex-shrink: 0;
`;

export const ModalTab = styled.button`
  background: none;
  border: none;
  padding: 16px 20px;
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;

  &.active {
    color: var(--color-text);
    border-bottom-color: var(--color-text);
    background: var(--color-bg);
  }

  &:hover:not(.active) {
    color: var(--color-text);
    background: var(--color-bg);
  }
`;

export const TabText = styled.span`
  font-size: 0.9rem;
`;

// Тело модального окна
export const ModalBody = styled.div`
  padding: 32px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ModalLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
`;

// Секции информации
export const ModalInfoSection = styled.div`
  padding: 0;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--color-bg-panel);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-bg);
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 500;
`;

// Секция результатов
export const ModalResultsSection = styled.div`
  padding: 0;
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OperatorsTabs = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const OperatorTab = styled.button`
  background: var(--color-bg-panel);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &.active {
    background: var(--color-bg);
    border-color: var(--color-text);
  }

  &:hover:not(.active) {
    background: var(--color-bg);
    transform: translateY(-1px);
  }
`;

export const OperatorName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
`;

export const OperatorScore = styled.span`
  background: var(--color-bg-panel);
  color: var(--color-text-muted);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
`;

export const ResultsHeader = styled.div`
  background: var(--color-bg-panel);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

export const ResultsTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
`;

export const ResultsSummary = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

export const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SummaryLabel = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-weight: 500;
`;

export const SummaryValue = styled.span`
  font-size: 1rem;
  color: var(--color-text);
  font-weight: 600;
`;

export const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ResultCard = styled.div`
  background: var(--color-bg-panel);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-0.5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const ResultHeader = styled.div`
  padding: 16px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ResultQuestion = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  flex: 1;
`;

export const ResultControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ResultDecision = styled.div`
  background: ${props => props.passed ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
  color: ${props => props.passed ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const ExpandIcon = styled.span`
  color: var(--color-text-muted);
  font-size: 0.8rem;
  transition: transform 0.2s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const ResultContent = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ResultExplanation = styled.div`
  font-size: 0.9rem;
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 16px;
`;

export const ResultAdditionalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ResultChecked = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ResultComment = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ResultTags = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const TagBadge = styled.span`
  background: var(--color-bg-panel);
  color: var(--color-text-muted);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
`;

// Секция чата
export const ModalChatSection = styled.div`
  padding: 0;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ChatHeader = styled.div`
  background: var(--color-bg-panel);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
`;

export const ChatStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ChatCount = styled.div`
  background: var(--color-bg);
  color: var(--color-text-muted);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
  background: var(--color-bg);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* Кастомный скроллбар */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg-panel);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

export const MessageCard = styled.div`
  background: ${props => props.isAgent ? 'var(--color-bg-panel)' : 'rgba(255, 255, 255, 0.02)'};
  border-radius: 12px;
  border: 1px solid ${props => props.isAgent ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  overflow: hidden;
  transition: all 0.2s ease;
  margin-bottom: 12px;
  max-width: 70%;
  align-self: ${props => props.isAgent ? 'flex-start' : 'flex-end'};
  margin-left: ${props => props.isAgent ? '0' : 'auto'};
  margin-right: ${props => props.isAgent ? 'auto' : '0'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const MessageHeader = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
`;

export const MessageSenderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SenderName = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
`;

export const SenderType = styled.span`
  background: ${props => props.isAgent ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.isAgent ? 'rgba(34, 197, 94, 1)' : 'var(--color-text-muted)'};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid ${props => props.isAgent ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
`;

export const MessageTime = styled.span`
  font-size: 0.7rem;
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const MessageContent = styled.div`
  padding: 12px;
  background: transparent;
`;

export const MessageText = styled.div`
  font-size: 0.9rem;
  color: var(--color-text);
  line-height: 1.5;
`;

export const ChatLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
`;

export const NoMessages = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
`;

// Анимации
export const slideInTable = `
  @keyframes slideInTable {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const spin = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
