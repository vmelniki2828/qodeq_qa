import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { DateTimePicker } from '../components/DateTimePicker';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { HiHashtag, HiChatBubbleLeftRight, HiUser, HiClock, HiTag, HiCube, HiChevronDown, HiChevronUp, HiCheck, HiXMark } from 'react-icons/hi2';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const formatDate = (v) => {
  if (!v) return '—';
  try {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return v; }
};

const renderTextWithLinks = (text, theme) => {
  if (!text) return '—';
  
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: theme.colors.primary,
            textDecoration: 'underline',
            wordBreak: 'break-all'
          }}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

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

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }

  ${({ $primary, theme }) =>
    $primary &&
    `
    background-color: ${theme.colors.accent};
    color: #FFFFFF;
    border-color: ${theme.colors.accent};

    &:hover {
      background-color: ${theme.colors.accentHover || theme.colors.accent};
      opacity: 0.9;
    }
  `}
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 700px;
  margin-top: 32px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
  flex: 0 1 auto;
`;

const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  width: 100%;
  min-width: 0;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::-ms-expand {
    display: none;
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Content = styled.div`
  padding: 10px 20px;
  flex-shrink: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 6px;
  width: 100%;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 2px solid ${({ theme }) => theme.colors.accent};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)'};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const InfoLabel = styled.label`
  font-size: 8px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 3px;
  opacity: 0.85;
  line-height: 1.1;
`;

const InfoValue = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  min-height: 14px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TagBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
`;

const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  ${({ $level }) => $level === 'good' && 'background: rgba(34, 197, 94, 0.15); color: #16a34a;'}
  ${({ $level }) => $level === 'warn' && 'background: rgba(234, 179, 8, 0.2); color: #ca8a04;'}
  ${({ $level }) => $level === 'bad' && 'background: rgba(239, 68, 68, 0.15); color: #dc2626;'}
  ${({ $level }) => !$level && 'background: rgba(128,128,128,0.12); color: #6b7280;'}
`;

const ColorSwatch = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $hex }) => $hex || '#eee'};
  vertical-align: middle;
`;

const MessagesSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
  min-height: 0;

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

const MessageCard = styled.div`
  padding: ${({ $isSystem }) => $isSystem ? '8px 0' : '12px 14px'};
  background: ${({ theme, $isPrivate, $isSystem }) => {
    if ($isSystem) return 'transparent';
    return $isPrivate ? 'rgba(254, 243, 199, 0.3)' : theme.colors.background;
  }};
  border: ${({ $isSystem }) => $isSystem ? 'none' : `1px solid ${({ theme }) => theme.colors.border}`};
  border-radius: ${({ $isSystem }) => $isSystem ? '0' : '8px'};
  border-left: ${({ $isPrivate, $isSystem, theme }) => {
    if ($isSystem) return 'none';
    return $isPrivate ? '3px solid #fde68a' : `3px solid ${theme.colors.accent}`;
  }};
  max-width: ${({ $align }) => $align === 'center' ? '80%' : '70%'};
  align-self: ${({ $align }) => {
    if ($align === 'right') return 'flex-end';
    if ($align === 'center') return 'center';
    return 'flex-start';
  }};
  margin: ${({ $align }) => $align === 'center' ? '0 auto' : '0'};
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
`;

const MessageAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const AuthorInfo = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 11px;
`;

const MessageTime = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.secondary};
  white-space: nowrap;
`;

const MessageText = styled.div`
  font-size: ${({ $isSystem }) => $isSystem ? '13px' : '14px'};
  color: ${({ theme, $isSystem }) => $isSystem ? '#9ca3af' : theme.colors.primary};
  line-height: 1.5;
  word-break: break-word;
  text-align: ${({ $isSystem }) => $isSystem ? 'center' : 'left'};
  font-style: ${({ $isSystem }) => $isSystem ? 'italic' : 'normal'};
`;

const ResultsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding: 20px;
`;

const ResultsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 8px;
  min-height: 0;

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

const OperatorBlock = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const OperatorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ $collapsed }) => ($collapsed ? '0' : '16px')};
  padding-bottom: ${({ $collapsed }) => ($collapsed ? '0' : '12px')};
  border-bottom: ${({ $collapsed, theme }) => ($collapsed ? 'none' : `1px solid ${theme.colors.border}`)};
  cursor: pointer;
  user-select: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const OperatorHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OperatorName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ResizableContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
  min-height: 600px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ResizableDivider = styled.div`
  width: 4px;
  background: ${({ theme }) => theme.colors.border};
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }

  &::before {
    content: '';
    position: absolute;
    left: -2px;
    right: -2px;
    top: 0;
    bottom: 0;
  }
`;

const ErrorBlock = styled.div`
  padding: 20px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const ResultItem = styled.div`
  padding: 12px;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  border-left: 3px solid ${({ $decision, $localDecision }) => {
    const decision = $localDecision !== undefined ? $localDecision : $decision;
    return decision ? '#16a34a' : '#dc2626';
  }};
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ResultQuestion = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ $isExpanded }) => $isExpanded ? '8px' : '0'};
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const CollapseIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary};
  transition: transform 0.2s ease;
  flex-shrink: 0;
`;

const ResultContent = styled.div`
  display: ${({ $isExpanded }) => $isExpanded ? 'block' : 'none'};
  margin-top: ${({ $isExpanded }) => $isExpanded ? '8px' : '0'};
`;

const ResultDecision = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`;

const DecisionToggle = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const DecisionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
  }
`;

const ResultExplanation = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.4;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ResultComment = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  font-style: italic;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CommentInput = styled.textarea`
  width: calc(100% - 16px);
  padding: 6px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-family: inherit;
  resize: none;
  min-height: 60px;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
    opacity: 0.6;
  }
`;

const AgentCommentWrap = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const AgentCommentLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 6px;
`;

const CheckButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 24px;
`;

const GetChatButton = styled.button`
  padding: 16px 32px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ManualCheckPage = () => {
  const { theme } = useTheme();
  const { canUseMethod } = useUserProfile();
  const canPatchChat = canUseMethod('chats', 'PATCH');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    worst: false,
    date_start: '',
    date_end: ''
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Показываем фильтры всегда, когда нет данных
  const showFilters = !data && !loading;
  const [splitterPosition, setSplitterPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [expandedResults, setExpandedResults] = useState(new Set());
  const [collapsedAgents, setCollapsedAgents] = useState(new Set());
  const [localDecisions, setLocalDecisions] = useState({});
  const [tagsSettings, setTagsSettings] = useState(null);
  const [selectedTags, setSelectedTags] = useState({});
  const [checkComment, setCheckComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    try {
      // Если дата в формате YYYY-MM-DDTHH:mm, конвертируем в ISO
      if (dateString.includes('T')) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  const fetchChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const params = new URLSearchParams();
      if (filters.worst !== null && filters.worst !== undefined) {
        params.append('worst', filters.worst.toString());
      }
      if (filters.date_start) {
        const formattedDate = formatDateForAPI(filters.date_start);
        if (formattedDate) {
          params.append('date_start', formattedDate);
        }
      }
      if (filters.date_end) {
        const formattedDate = formatDateForAPI(filters.date_end);
        if (formattedDate) {
          params.append('date_end', formattedDate);
        }
      }

      const url = `https://qa.qodeq.net/api/v1/chat/reviewedchat/special/manual_check?${params.toString()}`;
      const res = await fetch(url, { method: 'GET', headers });
      
      if (!res.ok) {
        let errorMessage = `Ошибка ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          // Если не удалось распарсить JSON, используем стандартное сообщение
          if (res.status === 404) {
            errorMessage = 'Чат не найден';
          } else if (res.status === 400) {
            errorMessage = 'Неверные параметры запроса';
          } else if (res.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (res.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }
      
      const json = await res.json();
      setData(json.chat || json);
      Notify.success('Чат успешно загружен');
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при загрузке чата';
      setError(errorMessage);
      setData(null);
      Notify.failure(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleGetChat = () => {
    fetchChat();
  };

  const handleCheckResults = async () => {
    if (!data || !results) return;

    setIsSubmitting(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Собираем все результаты и их изменения
      const resultsToUpdate = [];
      
      Object.entries(results).forEach(([operatorName, operatorData]) => {
        const opResults = Array.isArray(operatorData?.results) ? operatorData.results : [];
        
        opResults.forEach((result) => {
          const resultId = result.id;
          if (!resultId) return;

          const resultIdKey = `${resultId}`;
          const currentDecision = localDecisions[resultIdKey] !== undefined ? localDecisions[resultIdKey] : result.decision;
          const hasDecisionChange = localDecisions[resultIdKey] !== undefined && localDecisions[resultIdKey] !== result.decision;
          
          // Проверяем изменения тегов
          const existingTagIds = result.tags ? result.tags.map(t => typeof t === 'object' && t !== null ? t.id : null).filter(Boolean) : [];
          const selectedTagIds = selectedTags[resultIdKey] || [];
          const hasTagsChange = selectedTags[resultIdKey] !== undefined && 
            JSON.stringify([...existingTagIds].sort()) !== JSON.stringify([...selectedTagIds].sort());
          
          // Отправляем только если есть изменения
          if (hasDecisionChange || hasTagsChange) {
            const updateData = {};
            
            // Всегда добавляем decision (обязательное поле)
            updateData.decision = currentDecision !== undefined ? currentDecision : (result.decision !== undefined ? result.decision : false);
            
            // Добавляем tags только если они изменились
            if (hasTagsChange) {
              updateData.tags = selectedTagIds;
            }

            resultsToUpdate.push({ resultId, updateData });
          }
        });
      });

      // Отправляем запросы для каждого измененного результата
      const updatePromises = resultsToUpdate.map(({ resultId, updateData }) => {
        return fetch(`https://qa.qodeq.net/api/v1/chat/result/${resultId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateData)
        });
      });

      const responses = await Promise.all(updatePromises);
      
      // Проверяем результаты
      const failed = responses.filter(res => !res.ok);
      if (failed.length > 0) {
        throw new Error(`Ошибка при обновлении ${failed.length} результатов`);
      }

      // Отправляем checked и комментарий в запрос проверки /chat/reviewedchat/{id}
      const chatId = data.id;
      if (chatId) {
        const comment = checkComment != null ? String(checkComment).trim() : '';
        const reviewRes = await fetch(`https://qa.qodeq.net/api/v1/chat/reviewedchat/${chatId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ comment, checked: true })
        });
        if (!reviewRes.ok) {
          throw new Error('Ошибка при сохранении проверки');
        }
      }

      Notify.success('Результаты успешно обновлены');
      
      // Очищаем локальные изменения после успешной отправки
      setLocalDecisions({});
      setSelectedTags({});
      setCheckComment('');
      setExpandedResults(new Set());
      
      // Перезагружаем данные чата
      await fetchChat();
      
      // Возвращаемся на главное меню (страницу Chats)
      setTimeout(() => {
        navigate('/chats');
      }, 500);
    } catch (e) {
      console.error('Ошибка при отправке результатов:', e);
      Notify.failure(e.message || 'Произошла ошибка при отправке результатов');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitterPosition(Math.max(20, Math.min(80, newPosition)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleDividerMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDecisionChange = (resultId, newDecision) => {
    if (!data || !resultId) return;
    
    setLocalDecisions(prev => ({
      ...prev,
      [resultId]: newDecision
    }));
  };

  useEffect(() => {
    const fetchTagsSettings = async () => {
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch('https://qa.qodeq.net/api/v1/settings/tags/', { method: 'GET', headers });
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setTagsSettings(json);
      } catch (e) {
        console.error('Ошибка при загрузке настроек тегов:', e);
        Notify.failure('Ошибка при загрузке настроек тегов');
      }
    };
    fetchTagsSettings();
  }, []);

  const d = data || {};
  const messages = Array.isArray(d.messages) ? d.messages : [];
  const results = d.results || {};
  const username = Array.isArray(d.username) ? d.username : (d.username != null ? [d.username] : []);
  const tags = Array.isArray(d.tags) ? d.tags : (d.tags != null ? [d.tags] : []);
  const scoreLevel = d.score != null ? (d.score >= 80 ? 'good' : d.score >= 50 ? 'warn' : 'bad') : null;

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>Manual Check</Title>
          </HeaderSection>

          {showFilters && (
            <MainContent>
              <GetChatButton theme={theme} onClick={handleGetChat} disabled={loading}>
                Get Chat
              </GetChatButton>
              
              <FiltersContainer theme={theme}>
                <FilterGroup>
                  <FilterLabel theme={theme}>Worst</FilterLabel>
                  <Select
                    theme={theme}
                    value={filters.worst ? 'true' : 'false'}
                    onChange={(e) => setFilters(prev => ({ ...prev, worst: e.target.value === 'true' }))}
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </Select>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel theme={theme}>Date Start</FilterLabel>
                  <DateTimePicker
                    value={filters.date_start}
                    onChange={(e) => {
                      const value = e?.target?.value || e;
                      setFilters(prev => ({ ...prev, date_start: value }));
                    }}
                    placeholder="Выберите дату начала"
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel theme={theme}>Date End</FilterLabel>
                  <DateTimePicker
                    value={filters.date_end}
                    onChange={(e) => {
                      const value = e?.target?.value || e;
                      setFilters(prev => ({ ...prev, date_end: value }));
                    }}
                    placeholder="Выберите дату окончания"
                  />
                </FilterGroup>

              </FiltersContainer>
            </MainContent>
          )}

          {loading && (
            <MainContent>
              <Loader />
            </MainContent>
          )}


          {!loading && !error && data && (
            <>
              <Content theme={theme}>
                <InfoGrid theme={theme}>
                  <InfoItem>
                    <InfoLabel theme={theme}>
                      <HiChatBubbleLeftRight size={8} />
                      Thread ID
                    </InfoLabel>
                    <InfoValue theme={theme}>{d.thread_id || '—'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel theme={theme}>
                      <HiUser size={8} />
                      User type
                    </InfoLabel>
                    <InfoValue theme={theme}>{d.user_type || '—'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel theme={theme}>
                      <HiClock size={8} />
                      Длительность
                    </InfoLabel>
                    <InfoValue theme={theme}>{d.chat_duration || '—'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel theme={theme}>
                      <HiUser size={8} />
                      Username
                    </InfoLabel>
                    <InfoValue theme={theme}>
                      {username.length > 0 ? username.join(', ') : '—'}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel theme={theme}>
                      <HiTag size={8} />
                      Оценка
                    </InfoLabel>
                    <InfoValue theme={theme}>
                      {d.score != null ? <ScoreBadge $level={scoreLevel}>{d.score}</ScoreBadge> : '—'}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
              </Content>

              <ResizableContainer ref={containerRef}>
                <MessagesSection theme={theme} $flex={splitterPosition}>
                  <SectionTitle theme={theme}>Messages</SectionTitle>
                  {messages.length > 0 ? (
                    <MessagesList theme={theme}>
                      {messages.map((msg, idx) => {
                        const authorType = msg.author?.type;
                        const isSystem = !msg.author || authorType === 'system';
                        let align = 'left';
                        if (isSystem) {
                          align = 'center';
                        } else if (authorType === 'agent') {
                          align = 'right';
                        }
                        return (
                          <MessageCard
                            key={idx}
                            theme={theme}
                            $isPrivate={msg.is_private}
                            $isSystem={isSystem}
                            $align={align}
                          >
                            {!isSystem && (
                              <MessageHeader>
                                <MessageAuthor>
                                  <AuthorName theme={theme}>{msg.author?.name || 'Unknown'}</AuthorName>
                                  <AuthorInfo theme={theme}>
                                    {authorType === 'agent' ? 'Agent' : authorType === 'customer' ? 'Customer' : 'System'}
                                  </AuthorInfo>
                                </MessageAuthor>
                                <MessageTime theme={theme}>{formatDate(msg.created_at)}</MessageTime>
                              </MessageHeader>
                            )}
                            <MessageText theme={theme} $isSystem={isSystem}>
                              {renderTextWithLinks(msg.text || msg.message || '—', theme)}
                            </MessageText>
                          </MessageCard>
                        );
                      })}
                    </MessagesList>
                  ) : (
                    <EmptyState theme={theme}>Нет сообщений</EmptyState>
                  )}
                </MessagesSection>

                <ResizableDivider theme={theme} onMouseDown={handleDividerMouseDown} />

                <ResultsSection theme={theme} $flex={100 - splitterPosition}>
                  <SectionTitle theme={theme}>Results</SectionTitle>
                  {Object.keys(results).length > 0 ? (
                    <ResultsList theme={theme}>
                      {Object.entries(results).map(([operatorName, operatorData]) => {
                        const opResults = Array.isArray(operatorData?.results) ? operatorData.results : [];
                        const opScore = operatorData?.score;
                        const opScoreLevel = opScore != null ? (opScore >= 80 ? 'good' : opScore >= 50 ? 'warn' : 'bad') : null;
                        const isAgentCollapsed = collapsedAgents.has(operatorName);
                        const toggleAgent = () => {
                          setCollapsedAgents(prev => {
                            const next = new Set(prev);
                            if (next.has(operatorName)) next.delete(operatorName);
                            else next.add(operatorName);
                            return next;
                          });
                        };

                        return (
                          <OperatorBlock key={operatorName} theme={theme}>
                            <OperatorHeader
                              theme={theme}
                              $collapsed={isAgentCollapsed}
                              onClick={toggleAgent}
                            >
                              <OperatorName theme={theme}>{operatorName}</OperatorName>
                              <OperatorHeaderRight>
                                {opScore != null && <ScoreBadge $level={opScoreLevel}>{opScore}</ScoreBadge>}
                                {isAgentCollapsed ? (
                                  <HiChevronDown size={20} style={{ color: theme.colors.secondary, flexShrink: 0 }} />
                                ) : (
                                  <HiChevronUp size={20} style={{ color: theme.colors.secondary, flexShrink: 0 }} />
                                )}
                              </OperatorHeaderRight>
                            </OperatorHeader>
                            {!isAgentCollapsed && opResults.length > 0 ? (
                              opResults.map((result) => {
                                const resultId = result.id || Math.random();
                                const isExpanded = expandedResults.has(resultId);
                                
                                const toggleResult = () => {
                                  setExpandedResults(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(resultId)) {
                                      newSet.delete(resultId);
                                    } else {
                                      newSet.add(resultId);
                                    }
                                    return newSet;
                                  });
                                };
                                
                                const resultIdKey = `${resultId}`;
                                const currentDecision = localDecisions[resultIdKey] !== undefined ? localDecisions[resultIdKey] : result.decision;
                                
                                return (
                                  <ResultItem 
                                    key={resultId} 
                                    theme={theme} 
                                    $decision={result.decision}
                                    $localDecision={localDecisions[resultIdKey]}
                                  >
                                    {isExpanded && (
                                      <ResultDecision theme={theme}>
                                        <DecisionToggle 
                                          theme={theme}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDecisionChange(resultId, !currentDecision);
                                          }}
                                        >
                                          <DecisionIcon theme={theme}>
                                            {currentDecision ? (
                                              <HiCheck size={20} style={{ color: '#16a34a' }} />
                                            ) : (
                                              <HiXMark size={20} style={{ color: '#dc2626' }} />
                                            )}
                                          </DecisionIcon>
                                        </DecisionToggle>
                                      </ResultDecision>
                                    )}
                                    <ResultQuestion 
                                      theme={theme} 
                                      $isExpanded={isExpanded}
                                      onClick={toggleResult}
                                    >
                                      <CollapseIcon theme={theme}>
                                        {isExpanded ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
                                      </CollapseIcon>
                                      <span>{result.question || result.text || '—'}</span>
                                    </ResultQuestion>
                                    <ResultContent $isExpanded={isExpanded}>
                                      {result.checked !== undefined && (
                                        <div style={{ marginTop: '6px', fontSize: '12px', color: theme.colors.secondary }}>
                                          {result.checked ? 'Проверено' : 'Не проверено'}
                                        </div>
                                      )}
                                      {result.explanation && (
                                        <ResultExplanation theme={theme}>{result.explanation}</ResultExplanation>
                                      )}
                                      {result.manager_comment && (
                                        <ResultComment theme={theme}>Комментарий: {result.manager_comment}</ResultComment>
                                      )}
                                      
                                      {/* Показываем существующие теги */}
                                      {result.tags && Array.isArray(result.tags) && result.tags.length > 0 && (
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                          {result.tags.map((tag, i) => {
                                            const tagName = typeof tag === 'object' && tag !== null ? tag.name : String(tag);
                                            const tagId = typeof tag === 'object' && tag !== null ? tag.id : i;
                                            return (
                                              <span key={tagId || i} style={{ fontSize: '12px', padding: '4px 10px', background: theme.colors.background, border: `1px solid ${theme.colors.border}`, borderRadius: '6px', color: theme.colors.secondary, fontWeight: 500 }}>
                                                {tagName}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      )}
                                      
                                      {/* Показываем доступные теги из settings, если decision = false и блок развернут */}
                                      {isExpanded && !currentDecision && tagsSettings && Array.isArray(tagsSettings) && (() => {
                                        const questionSettings = tagsSettings.find(item => item.question === result.question);
                                        if (!questionSettings || !questionSettings.tags) return null;
                                        
                                        const availableTags = Object.values(questionSettings.tags).filter(tag => tag.active);
                                        const resultTagsIds = result.tags ? result.tags.map(t => typeof t === 'object' && t !== null ? t.id : null).filter(Boolean) : [];
                                        
                                        const resultIdKey = `${resultId}`;
                                        const selectedForResult = selectedTags[resultIdKey] || [];
                                        
                                        return (
                                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${theme.colors.border}` }}>
                                            <div style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.secondary, marginBottom: '8px' }}>
                                              Доступные теги:
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                              {availableTags.map((tag) => {
                                                const isSelected = resultTagsIds.includes(tag.id) || selectedForResult.includes(tag.id);
                                                return (
                                                  <label
                                                    key={tag.id}
                                                    style={{
                                                      display: 'inline-flex',
                                                      alignItems: 'center',
                                                      fontSize: '12px',
                                                      padding: '4px 10px',
                                                      background: isSelected ? theme.colors.accent : theme.colors.background,
                                                      border: `1px solid ${isSelected ? theme.colors.accent : theme.colors.border}`,
                                                      borderRadius: '6px',
                                                      color: isSelected ? '#fff' : theme.colors.secondary,
                                                      fontWeight: 500,
                                                      cursor: 'pointer',
                                                      transition: 'all 0.2s ease'
                                                    }}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={isSelected}
                                                      onChange={(e) => {
                                                        const newSelected = e.target.checked
                                                          ? [...selectedForResult, tag.id]
                                                          : selectedForResult.filter(id => id !== tag.id);
                                                        setSelectedTags(prev => ({
                                                          ...prev,
                                                          [resultIdKey]: newSelected
                                                        }));
                                                      }}
                                                      style={{ marginRight: '6px', cursor: 'pointer' }}
                                                    />
                                                    {tag.name}
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </ResultContent>
                                  </ResultItem>
                                );
                              })
                            ) : !isAgentCollapsed ? (
                              <EmptyState theme={theme}>Нет результатов</EmptyState>
                            ) : null}
                          </OperatorBlock>
                        );
                      })}
                    </ResultsList>
                  ) : (
                    <EmptyState theme={theme}>Нет результатов</EmptyState>
                  )}
                  {Object.keys(results).length > 0 && canPatchChat && (
                    <>
                      <AgentCommentWrap theme={theme}>
                        <AgentCommentLabel theme={theme}>Комментарий</AgentCommentLabel>
                        <CommentInput
                          theme={theme}
                          placeholder="Комментарий по проверке..."
                          value={checkComment}
                          onChange={(e) => setCheckComment(e.target.value)}
                        />
                      </AgentCommentWrap>
                      <CheckButton theme={theme} onClick={handleCheckResults} disabled={isSubmitting}>
                        {isSubmitting ? 'Отправка...' : 'Проверить'}
                      </CheckButton>
                    </>
                  )}
                </ResultsSection>
              </ResizableContainer>
            </>
          )}
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};
