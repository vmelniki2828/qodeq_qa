import { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { HiChevronUp, HiChevronDown, HiCheck, HiXMark, HiPlus, HiMinus } from 'react-icons/hi2';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const PageContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

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

const QuestionBlock = styled.div`
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: visible;
  transition: all 0.2s ease;
`;

const QuestionHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f8f8f8' : 'rgba(255,255,255,0.04)'};
  }
`;

const QuestionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  flex: 1;
`;

const CollapseIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary};
  transition: transform 0.2s ease;
  flex-shrink: 0;
`;

const QuestionContent = styled.div`
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
  padding: ${({ $isExpanded }) => ($isExpanded ? '16px 20px' : '0 20px')};
  border-top: ${({ $isExpanded, theme }) => ($isExpanded ? `1px solid ${theme.colors.border}` : 'none')};
  max-height: ${({ $isExpanded }) => ($isExpanded ? 'none' : '0')};
  overflow: ${({ $isExpanded }) => ($isExpanded ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  opacity: ${({ $isExpanded }) => ($isExpanded ? '1' : '0')};
  visibility: ${({ $isExpanded }) => ($isExpanded ? 'visible' : 'hidden')};
`;

const TagItem = styled.div`
  padding: 12px;
  margin-top: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  gap: 16px;

  &:first-child {
    margin-top: 0;
  }
`;

const TagField = styled.div`
  display: flex;
  gap: 8px;
  font-size: 13px;
  align-items: center;
  justify-content: ${({ $position }) => {
    if ($position === 'left') return 'flex-start';
    if ($position === 'center') return 'center';
    if ($position === 'right') return 'flex-end';
    return 'flex-start';
  }};
`;

const TagLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

const TagValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const PenaltyEditor = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PenaltyInput = styled.input`
  width: 60px;
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  text-align: center;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const PenaltyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
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

export const TagsPage = () => {
  const { theme } = useTheme();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [editingPenalties, setEditingPenalties] = useState({});

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('https://209.38.246.190/api/v1/settings/tags/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setTags(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setTags([]);
        // Не показываем уведомление при начальной загрузке, только при явных действиях
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleRefresh = () => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('https://209.38.246.190/api/v1/settings/tags/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setTags(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setTags([]);
        Notify.failure('Ошибка при обновлении списка тегов');
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  };

  const toggleQuestion = (question) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(question)) {
        newSet.delete(question);
      } else {
        newSet.add(question);
      }
      return newSet;
    });
  };

  const handlePenaltyChange = (tagId, value) => {
    const numValue = parseInt(value) || 0;
    setEditingPenalties(prev => ({
      ...prev,
      [tagId]: numValue
    }));
  };

  const handlePenaltyIncrement = (tagId, currentValue) => {
    const newValue = (currentValue || 0) + 1;
    handlePenaltyChange(tagId, newValue);
  };

  const handlePenaltyDecrement = (tagId, currentValue) => {
    const newValue = Math.max(0, (currentValue || 0) - 1);
    handlePenaltyChange(tagId, newValue);
  };

  const handleSavePenalty = async (tagId) => {
    const newPenalty = editingPenalties[tagId];
    if (newPenalty === undefined) return;

    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`https://209.38.246.190/api/v1/settings/tags/${tagId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ penalty: newPenalty })
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем локальное состояние
      setTags(prev => prev.map(item => {
        const updatedTags = { ...item.tags };
        if (updatedTags && Object.keys(updatedTags).length > 0) {
          Object.keys(updatedTags).forEach(key => {
            if (updatedTags[key].id === tagId) {
              updatedTags[key] = { ...updatedTags[key], penalty: newPenalty };
            }
          });
        }
        return { ...item, tags: updatedTags };
      }));
      
      // Убираем из редактируемых
      setEditingPenalties(prev => {
        const newState = { ...prev };
        delete newState[tagId];
        return newState;
      });
      
      Notify.success('Penalty успешно обновлен');
    } catch (e) {
      console.error('Ошибка при сохранении penalty:', e);
      Notify.failure('Ошибка при сохранении penalty');
    }
  };

  if (loading) {
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader />
          </div>
        </ThemeProvider>
      </Layout>
    );
  }

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>Tags</Title>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                Refresh
              </Button>
            </ButtonsGroup>
          </HeaderSection>

          <TableContainer>
            {error && <ErrorBlock>{error}</ErrorBlock>}
            {!error && (
              <>
                {tags.length > 0 ? (
                  tags.map((item, index) => {
                    const question = item.question || 'Без вопроса';
                    const isExpanded = expandedQuestions.has(question);
                    const tagsData = item.tags || {};

                    return (
                      <QuestionBlock key={index} theme={theme}>
                        <QuestionHeader 
                          theme={theme} 
                          onClick={() => toggleQuestion(question)}
                        >
                          <QuestionTitle theme={theme}>{question}</QuestionTitle>
                          <CollapseIcon theme={theme}>
                            {isExpanded ? (
                              <HiChevronUp size={18} />
                            ) : (
                              <HiChevronDown size={18} />
                            )}
                          </CollapseIcon>
                        </QuestionHeader>
                        <QuestionContent $isExpanded={isExpanded}>
                          {Object.keys(tagsData).length > 0 ? (
                            Object.entries(tagsData).map(([key, tag]) => (
                              <TagItem key={tag.id || key} theme={theme}>
                                <TagField $position="left" theme={theme}>
                                  <TagLabel theme={theme}>Name:</TagLabel>
                                  <TagValue theme={theme}>
                                    {tag.name !== null && tag.name !== undefined
                                      ? String(tag.name)
                                      : '—'}
                                  </TagValue>
                                </TagField>
                                <TagField $position="center" theme={theme}>
                                  <TagLabel theme={theme}>Penalty:</TagLabel>
                                  <PenaltyEditor>
                                    <PenaltyButton
                                      theme={theme}
                                      onClick={() => handlePenaltyDecrement(tag.id, editingPenalties[tag.id] !== undefined ? editingPenalties[tag.id] : tag.penalty)}
                                      title="Уменьшить"
                                    >
                                      <HiMinus size={14} />
                                    </PenaltyButton>
                                    <PenaltyInput
                                      theme={theme}
                                      type="number"
                                      min="0"
                                      value={editingPenalties[tag.id] !== undefined ? editingPenalties[tag.id] : (tag.penalty !== null && tag.penalty !== undefined ? tag.penalty : 0)}
                                      onChange={(e) => handlePenaltyChange(tag.id, e.target.value)}
                                    />
                                    <PenaltyButton
                                      theme={theme}
                                      onClick={() => handlePenaltyIncrement(tag.id, editingPenalties[tag.id] !== undefined ? editingPenalties[tag.id] : tag.penalty)}
                                      title="Увеличить"
                                    >
                                      <HiPlus size={14} />
                                    </PenaltyButton>
                                    {editingPenalties[tag.id] !== undefined && editingPenalties[tag.id] !== tag.penalty && (
                                      <SaveButton
                                        theme={theme}
                                        onClick={() => handleSavePenalty(tag.id)}
                                        title="Сохранить"
                                      >
                                        <HiCheck size={14} />
                                      </SaveButton>
                                    )}
                                  </PenaltyEditor>
                                </TagField>
                                <TagField $position="right" theme={theme}>
                                  <TagLabel theme={theme}>Active:</TagLabel>
                                  <TagValue theme={theme}>
                                    {tag.active === true || tag.active === 'true' ? (
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <HiCheck size={16} style={{ color: '#16a34a' }} />
                                        Active
                                      </span>
                                    ) : (
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <HiXMark size={16} style={{ color: '#dc2626' }} />
                                        Inactive
                                      </span>
                                    )}
                                  </TagValue>
                                </TagField>
                              </TagItem>
                            ))
                          ) : (
                            <div style={{ padding: '12px', color: theme.colors.secondary }}>
                              Нет тегов для этого вопроса
                            </div>
                          )}
                        </QuestionContent>
                      </QuestionBlock>
                    );
                  })
                ) : (
                  <EmptyState theme={theme}>Нет тегов</EmptyState>
                )}
              </>
            )}
          </TableContainer>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};

