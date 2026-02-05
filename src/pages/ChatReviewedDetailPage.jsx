import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { Loader } from '../components/Loader';
import { HiArrowLeft, HiCheck, HiXMark, HiHashtag, HiChatBubbleLeftRight, HiUser, HiClock, HiTag, HiCube, HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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
  min-height: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ResizableContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.background};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.accent : (theme.colors.primary === '#0D0D0D' ? '#f5f5f5' : 'rgba(255,255,255,0.08)')};
    opacity: ${({ $active }) => $active ? 0.9 : 1};
  }
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#f5f5f5' : 'rgba(255,255,255,0.08)'};
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
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

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.15)'};
    transform: translateY(-1px);
  }
`;

const InfoCardTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoCardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  align-items: start;
  width: 100%;
`;

const StatusCardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  align-items: stretch;
  width: 100%;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)'};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const InfoLabel = styled.label`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.8;
`;

const InfoValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 20px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TagBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
`;

const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  ${({ $level }) => $level === 'good' && 'background: rgba(34, 197, 94, 0.15); color: #16a34a;'}
  ${({ $level }) => $level === 'warn' && 'background: rgba(234, 179, 8, 0.2); color: #ca8a04;'}
  ${({ $level }) => $level === 'bad' && 'background: rgba(239, 68, 68, 0.15); color: #dc2626;'}
  ${({ $level }) => !$level && 'background: rgba(128,128,128,0.12); color: #6b7280;'}
`;

const ColorSwatch = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $hex }) => $hex || '#eee'};
  vertical-align: middle;
`;

const MessagesSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${({ $flex }) => $flex || 50} 1 0;
  min-width: 0;
  overflow: hidden;
  padding: 20px;
`;

const ResultsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${({ $flex }) => $flex || 50} 1 0;
  min-width: 0;
  overflow: hidden;
  padding: 20px;
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
  align-self: flex-end;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.6px;
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
  background: ${({ theme, $isPrivate, $isSystem, $isBot }) => {
    if ($isSystem) return 'transparent';
    if ($isBot) return theme.colors.primary === '#0D0D0D' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.06)';
    return $isPrivate ? 'rgba(254, 243, 199, 0.3)' : theme.colors.background;
  }};
  border: ${({ $isSystem }) => $isSystem ? 'none' : `1px solid ${({ theme }) => theme.colors.border}`};
  border-radius: ${({ $isSystem }) => $isSystem ? '0' : '8px'};
  border-left: ${({ $isPrivate, $isSystem, $isBot, theme }) => {
    if ($isSystem) return 'none';
    if ($isBot) return `1px solid ${theme.colors.border}`;
    return $isPrivate ? '3px solid #fde68a' : `3px solid ${theme.colors.accent}`;
  }};
  border-right: ${({ $isBot }) => ($isBot ? '3px solid #3b82f6' : 'none')};
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

export const ChatReviewedDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [splitterPosition, setSplitterPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [expandedResults, setExpandedResults] = useState(new Set());
  const [collapsedAgents, setCollapsedAgents] = useState(new Set());
  const [localDecisions, setLocalDecisions] = useState({});
  const [tagsSettings, setTagsSettings] = useState(null);
  const [selectedTags, setSelectedTags] = useState({});
  const [managerComments, setManagerComments] = useState({});
  const [checkComment, setCheckComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchChat = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`https://209.38.246.190/api/v1/chat/reviewedchat/${id}`, { method: 'GET', headers });
      if (!res.ok) throw new Error(res.status === 404 ? 'Чат не найден' : `Ошибка ${res.status}`);
      const json = await res.json();
      setData(json.chat || json);
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  useEffect(() => {
    const fetchTagsSettings = async () => {
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch('https://209.38.246.190/api/v1/settings/tags/', { method: 'GET', headers });
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

  // Переключение между чатами: Ctrl + стрелка влево / вправо
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      e.preventDefault();
      const listRaw = sessionStorage.getItem('chatsNavigationIds');
      if (!listRaw) return;
      let list;
      try {
        list = JSON.parse(listRaw);
      } catch (_) {
        return;
      }
      if (!Array.isArray(list) || list.length === 0) return;
      const idx = list.indexOf(id);
      if (idx < 0) return;
      if (e.key === 'ArrowLeft' && idx > 0) {
        navigate(`/chats/${list[idx - 1]}`, { replace: false });
      } else if (e.key === 'ArrowRight' && idx < list.length - 1) {
        navigate(`/chats/${list[idx + 1]}`, { replace: false });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, navigate]);

  // Переключение вкладок: Ctrl+, — общая информация, Ctrl+. — Чат и результаты
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isPrev = e.ctrlKey && e.code === 'Comma';   // Ctrl + ,
      const isNext = e.ctrlKey && e.code === 'Period';  // Ctrl + .
      if (!isPrev && !isNext) return;
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      e.preventDefault();
      setActiveTab(isNext ? 'chat' : 'info');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Escape — возврат к общему списку чатов
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      navigate('/chats');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clamped = Math.max(20, Math.min(80, percentage));
      setSplitterPosition(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const handleDividerMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDecisionChange = (resultId, newDecision) => {
    if (!data || !resultId) return;
    
    const resultIdKey = `${resultId}`;
    setLocalDecisions(prev => ({
      ...prev,
      [resultIdKey]: newDecision
    }));
  };

  const handleManagerCommentChange = (resultId, comment) => {
    const resultIdKey = `${resultId}`;
    setManagerComments(prev => ({
      ...prev,
      [resultIdKey]: comment
    }));
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
          
          const hasCommentChange = managerComments[resultIdKey] !== undefined && managerComments[resultIdKey] !== (result.manager_comment || '');
          
          // Отправляем только если есть изменения
          if (hasDecisionChange || hasTagsChange || hasCommentChange) {
            const updateData = {};
            
            // Всегда добавляем decision (обязательное поле)
            updateData.decision = currentDecision !== undefined ? currentDecision : (result.decision !== undefined ? result.decision : false);
            
            // Добавляем tags только если они изменились
            if (hasTagsChange) {
              updateData.tags = selectedTagIds;
            }
            
            // Добавляем manager_comment только если он изменился
            if (hasCommentChange) {
              updateData.manager_comment = managerComments[resultIdKey] || '';
            }

            resultsToUpdate.push({ resultId, updateData });
          }
        });
      });

      // Отправляем запросы для каждого измененного результата
      const updatePromises = resultsToUpdate.map(({ resultId, updateData }) => {
        return fetch(`https://209.38.246.190/api/v1/chat/result/${resultId}`, {
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
      const comment = checkComment != null ? String(checkComment).trim() : '';
      const reviewRes = await fetch(`https://209.38.246.190/api/v1/chat/reviewedchat/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ comment, checked: true })
      });
      if (!reviewRes.ok) {
        throw new Error('Ошибка при сохранении проверки');
      }

      Notify.success('Результаты успешно обновлены');
      
      // Очищаем локальные изменения после успешной отправки
      setLocalDecisions({});
      setSelectedTags({});
      setManagerComments({});
      setCheckComment('');
      setExpandedResults(new Set());
      
      // Перезагружаем данные чата
      await fetchChat();
    } catch (e) {
      console.error('Ошибка при отправке результатов:', e);
      Notify.failure(e.message || 'Произошла ошибка при отправке результатов');
    } finally {
      setIsSubmitting(false);
    }
  };

  const d = data || {};
  const messages = Array.isArray(d.messages) ? d.messages : [];
  const results = d.results || {};
  const username = Array.isArray(d.username) ? d.username : (d.username != null ? [d.username] : []);
  const tags = Array.isArray(d.tags) ? d.tags : (d.tags != null ? [d.tags] : []);
  const scoreLevel = d.score != null ? (d.score >= 80 ? 'good' : d.score >= 50 ? 'warn' : 'bad') : null;

  return (
    <Layout>
      <PageContent>
        <Header theme={theme}>
          <HeaderLeft>
            <BackBtn theme={theme} onClick={() => navigate('/chats')}>
              <HiArrowLeft size={18} />
              Назад
            </BackBtn>
            <Title theme={theme}>{d.chat_id || d.project_title || '—'}</Title>
          </HeaderLeft>
          {!loading && !error && data && (
            <Tabs>
              <Tab theme={theme} $active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
                Основная информация
              </Tab>
              <Tab theme={theme} $active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
                Чат и результаты
              </Tab>
            </Tabs>
          )}
        </Header>

        {activeTab === 'info' && (
          <Content theme={theme}>
            {loading && <Loader />}
            {error && <ErrorBlock>{error}</ErrorBlock>}
            {!loading && !error && data && (
              <InfoGrid theme={theme}>
                  <InfoCard theme={theme}>
                    <InfoCardTitle theme={theme}>
                      <HiHashtag size={14} />
                      Основное
                    </InfoCardTitle>
                    <InfoCardContent>
                      <InfoItem>
                        <InfoLabel theme={theme}>
                          <HiChatBubbleLeftRight size={12} />
                          Chat ID
                        </InfoLabel>
                        <InfoValue theme={theme}>{d.chat_id || '—'}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel theme={theme}>
                          <HiChatBubbleLeftRight size={12} />
                          Thread ID
                        </InfoLabel>
                        <InfoValue theme={theme}>{d.thread_id || '—'}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel theme={theme}>
                          <HiUser size={12} />
                          User type
                        </InfoLabel>
                        <InfoValue theme={theme}>{d.user_type || '—'}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel theme={theme}>
                          <HiCube size={12} />
                          Проект
                        </InfoLabel>
                        <InfoValue theme={theme}>{d.project_title || '—'}</InfoValue>
                      </InfoItem>
                    </InfoCardContent>
                  </InfoCard>

                  <InfoCard theme={theme}>
                    <InfoCardTitle theme={theme}>
                      <HiCheck size={14} />
                      Статус
                    </InfoCardTitle>
                    <StatusCardContent>
                      <InfoItem>
                        <InfoLabel theme={theme}>Checked</InfoLabel>
                        <InfoValue theme={theme}>
                          {d.checked ? (
                            <>
                              <HiCheck size={18} style={{ color: '#16a34a' }} />
                              Проверен
                            </>
                          ) : (
                            <>
                              <HiXMark size={18} style={{ color: '#dc2626' }} />
                              Не проверен
                            </>
                          )}
                        </InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel theme={theme}>Checked by</InfoLabel>
                        <InfoValue theme={theme}>{d.checked_by || '—'}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel theme={theme}>Score</InfoLabel>
                        <InfoValue theme={theme}>
                          {d.score != null ? <ScoreBadge $level={scoreLevel}>{d.score}</ScoreBadge> : '—'}
                        </InfoValue>
                      </InfoItem>
                      {d.color && (
                        <InfoItem>
                          <InfoLabel theme={theme}>Color</InfoLabel>
                          <InfoValue theme={theme}>
                            <ColorSwatch $hex={d.color} theme={theme} />
                            {d.color}
                          </InfoValue>
                        </InfoItem>
                      )}
                    </StatusCardContent>
                  </InfoCard>

                  <InfoCard theme={theme}>
                    <InfoCardTitle theme={theme}>
                      <HiClock size={14} />
                      Время
                    </InfoCardTitle>
                    <InfoCardContent>
                      <InfoItem>
                        <InfoLabel theme={theme}>Дата создания</InfoLabel>
                        <InfoValue theme={theme}>{formatDate(d.created_chat_at)}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel theme={theme}>Длительность</InfoLabel>
                        <InfoValue theme={theme}>{d.chat_duration || '—'}</InfoValue>
                      </InfoItem>
                    </InfoCardContent>
                  </InfoCard>

                  <InfoCard theme={theme}>
                    <InfoCardTitle theme={theme}>
                      <HiUser size={14} />
                      Участники
                    </InfoCardTitle>
                    <InfoCardContent>
                      <InfoItem>
                        <InfoLabel theme={theme}>Username</InfoLabel>
                        <InfoValue theme={theme}>
                          {username.length ? (
                            <TagsContainer>
                              {username.map((u, i) => (
                                <TagBadge key={i} theme={theme}>{String(u)}</TagBadge>
                              ))}
                            </TagsContainer>
                          ) : '—'}
                        </InfoValue>
                      </InfoItem>
                      {tags.length > 0 && (
                        <InfoItem>
                          <InfoLabel theme={theme}>
                            <HiTag size={12} />
                            Теги
                          </InfoLabel>
                          <InfoValue theme={theme}>
                            <TagsContainer>
                              {tags.map((t, i) => (
                                <TagBadge key={i} theme={theme}>{String(t)}</TagBadge>
                              ))}
                            </TagsContainer>
                          </InfoValue>
                        </InfoItem>
                      )}
                    </InfoCardContent>
                  </InfoCard>
                </InfoGrid>
            )}
          </Content>
        )}

        {activeTab === 'chat' && (
          <>
            {loading && <Loader />}
            {error && <ErrorBlock>{error}</ErrorBlock>}
            {!loading && !error && data && (
              <ResizableContainer ref={containerRef}>
                <MessagesSection theme={theme} $flex={splitterPosition}>
                  <SectionTitle theme={theme}>Messages</SectionTitle>
                  {messages.length > 0 ? (
                    <MessagesList theme={theme}>
                      {messages.map((msg, idx) => {
                        const authorType = msg.author?.type;
                        const isSystem = !msg.author || authorType === 'system';
                        const isBot = authorType === 'bot';
                        let align = 'left';
                        if (isSystem) {
                          align = 'center';
                        } else if (authorType === 'agent' || isBot) {
                          align = 'right';
                        }
                        return (
                          <MessageCard key={idx} theme={theme} $isPrivate={msg.is_private} $isSystem={isSystem} $isBot={isBot} $align={align}>
                            {!isSystem && (
                              <MessageHeader>
                                <MessageAuthor>
                                  {msg.author && (
                                    <>
                                      <AuthorName theme={theme}>{msg.author.name || '—'}</AuthorName>
                                      {authorType && <AuthorInfo theme={theme}>• {authorType}</AuthorInfo>}
                                    </>
                                  )}
                                </MessageAuthor>
                                <MessageTime theme={theme}>{formatDate(msg.created_at)}</MessageTime>
                              </MessageHeader>
                            )}
                            <MessageText theme={theme} $isSystem={isSystem}>{renderTextWithLinks(msg.text, theme)}</MessageText>
                          </MessageCard>
                        );
                      })}
                    </MessagesList>
                  ) : (
                    <EmptyState theme={theme}>Нет сообщений</EmptyState>
                  )}
                </MessagesSection>

                <ResizableDivider 
                  theme={theme} 
                  onMouseDown={handleDividerMouseDown}
                />

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
                            {!isAgentCollapsed && (opResults.length > 0 ? (
                              opResults.map((result) => {
                                const resultId = result.id || Math.random();
                                const resultIdKey = `${resultId}`;
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
                                      <span>{result.question || '—'}</span>
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
                                        
                                        // Инициализируем selectedTags с существующими тегами, если еще не инициализировано
                                        if (selectedTags[resultIdKey] === undefined) {
                                          setSelectedTags(prev => ({
                                            ...prev,
                                            [resultIdKey]: [...resultTagsIds]
                                          }));
                                        }
                                        
                                        const selectedForResult = selectedTags[resultIdKey] || resultTagsIds;
                                        
                                        return (
                                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${theme.colors.border}` }}>
                                            <div style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.secondary, marginBottom: '8px' }}>
                                              Доступные теги:
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                              {availableTags.map((tag) => {
                                                const isSelected = selectedForResult.includes(tag.id);
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
                            ) : (
                              <EmptyState theme={theme} style={{ padding: 20 }}>Нет результатов</EmptyState>
                            ))}
                          </OperatorBlock>
                        );
                      })}
                    </ResultsList>
                  ) : (
                    <EmptyState theme={theme}>Нет результатов</EmptyState>
                  )}
                  {Object.keys(results).length > 0 && (
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
            )}
          </>
        )}
      </PageContent>
    </Layout>
  );
};
