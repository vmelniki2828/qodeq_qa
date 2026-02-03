import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { apiFetch } from '../utils/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { HiCheck, HiPencil } from 'react-icons/hi2';

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
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px 20px 0 20px;
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

const DashboardBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.12)'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

const EditButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const InfoCardLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 8px;
`;

const InfoCardValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.3;
  word-break: break-word;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LimitEditor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LimitInput = styled.input`
  width: 80px;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  font-weight: 600;
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

const SaveLimitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PromptSelect = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: border-color 0.15s ease;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;


const PromptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 20px;
`;

const PromptCard = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme, $selected }) => $selected ? theme.colors.accent : theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  border-left: ${({ theme, $selected }) => $selected ? `4px solid ${theme.colors.accent}` : `1px solid ${theme.colors.border}`};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.04)'};
  }
`;

const PromptCardName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, $selected }) => $selected ? theme.colors.accent : theme.colors.primary};
  margin-bottom: 6px;
`;

const PromptCardLevel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: capitalize;
`;

const DashboardSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const DashboardSectionTitle = styled.div`
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const DataTableWrap = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const DataTableHead = styled.thead`
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)'};
`;

const DataTableTh = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DataTableBody = styled.tbody``;

const DataTableTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)'};
  }
`;

const DataTableTd = styled.td`
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.primary};
  vertical-align: top;
`;

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const ErrorBlock = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 15px;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
`;

// Человекочитаемое имя ключа
const formatLabel = (key) => {
  const n = String(key)
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
};

const isDateLike = (v) => {
  if (typeof v !== 'string' && typeof v !== 'number') return false;
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}(T|\s)/.test(s) || /^\d{4}-\d{2}-\d{2}$/.test(s)) return true;
  const n = Number(v);
  return !isNaN(n) && n > 1e10;
};

// Функция для форматирования даты
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(',', '');
  } catch (e) {
    return dateString;
  }
};

const formatValue = (v) => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'Да' : 'Нет';
  if (typeof v === 'number') return Number.isInteger(v) ? v.toLocaleString('ru-RU') : v.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
  if (isDateLike(v)) return formatDate(v);
  if (typeof v === 'string') return v;
  if (Array.isArray(v) || (typeof v === 'object' && v !== null)) {
    const s = JSON.stringify(v);
    return s.length > 80 ? s.slice(0, 80) + '…' : s;
  }
  return String(v);
};

// Рекурсивный вывод данных API: примитивы — карточки, объекты — секции, массивы — таблица или теги
function renderSettingsData(data, theme, onLimitChange, limitValue, isSavingLimit, isEditingLimit, onEditLimit, onWorkingShiftChange, workingShiftValue, isSavingWorkingShift, isEditingWorkingShift, onEditWorkingShift, onMinMessagesCountChange, minMessagesCountValue, isSavingMinMessagesCount, isEditingMinMessagesCount, onEditMinMessagesCount, onPromptVersionChange, promptVersionValue, promptOptions, isLoadingPrompts, isSavingPromptVersion, isEditingPromptVersion, onEditPromptVersion, selectedLanguage, onLanguageChange) {
  if (data == null || (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)) {
    return <EmptyState theme={theme}>Нет данных для отображения</EmptyState>;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return <EmptyState theme={theme}>Пустой список</EmptyState>;
    const allPrimitive = data.every((x) => x == null || (typeof x !== 'object' && typeof x !== 'function'));
    if (allPrimitive) {
      return (
        <TagsWrap theme={theme}>
          {data.map((v, i) => (
            <Tag key={i} theme={theme}>{formatValue(v)}</Tag>
          ))}
        </TagsWrap>
      );
    }
    const allColumns = [...new Set(data.flatMap((obj) => (obj && typeof obj === 'object' ? Object.keys(obj) : [])))];
    // Фильтруем колонки с ID
    const columns = allColumns.filter(col => {
      const lowerCol = col.toLowerCase();
      return lowerCol !== 'id' && lowerCol !== '_id' && !lowerCol.endsWith('_id') && !lowerCol.endsWith('id');
    });
    if (columns.length === 0) return <EmptyState theme={theme}>Нет колонок</EmptyState>;
    return (
      <DataTableWrap theme={theme}>
        <DataTable>
          <DataTableHead>
            <tr>
              {columns.map((col) => (
                <DataTableTh key={col} theme={theme}>{formatLabel(col)}</DataTableTh>
              ))}
            </tr>
          </DataTableHead>
          <DataTableBody>
            {data.map((row, i) => (
              <DataTableTr key={i} theme={theme}>
                {columns.map((col) => (
                  <DataTableTd key={col} theme={theme}>{formatValue(row && row[col])}</DataTableTd>
                ))}
              </DataTableTr>
            ))}
          </DataTableBody>
        </DataTable>
      </DataTableWrap>
    );
  }
  if (typeof data === 'object' && data !== null) {
    const primitives = [];
    const complex = [];
     Object.entries(data).forEach(([k, v]) => {
       // Пропускаем поля с ID (в разных вариантах написания), но НЕ пропускаем prompt_version_id
       const lowerKey = k.toLowerCase();
       const isPromptVersionId = lowerKey === 'prompt_version_id';
       if ((lowerKey === 'id' || lowerKey === '_id' || (lowerKey.endsWith('_id') && !isPromptVersionId) || (lowerKey.endsWith('id') && lowerKey !== 'prompt_version_id')) && !isPromptVersionId) {
         return;
       }
      if (v === null || v === undefined) primitives.push([k, v]);
      else if (typeof v !== 'object') primitives.push([k, v]);
      else if (Array.isArray(v)) complex.push([k, v]);
      else complex.push([k, v]);
    });
    return (
      <DashboardBlock theme={theme}>
        {primitives.length > 0 && (
          <InfoGrid theme={theme}>
             {primitives.map(([k, v]) => {
               const lowerKey = k.toLowerCase();
               const isLimit = lowerKey === 'limit';
               const isWorkingShift = lowerKey === 'working_shift';
               const isMinMessagesCount = lowerKey === 'min_messages_count';
               // Проверяем различные варианты названия поля для prompt version
               const isPromptVersion = lowerKey === 'prompt_version' || 
                                      lowerKey === 'prompt_version_id' || 
                                      lowerKey === 'promptversion' ||
                                      (k.toLowerCase().includes('prompt') && k.toLowerCase().includes('version'));
               
               return (
                 <InfoCard key={k} theme={theme}>
                   {isLimit && onEditLimit && (
                     <EditButton
                       theme={theme}
                       onClick={() => onEditLimit(!isEditingLimit)}
                       title={isEditingLimit ? "Отменить редактирование" : "Редактировать"}
                     >
                       <HiPencil size={14} />
                     </EditButton>
                   )}
                   {isWorkingShift && onEditWorkingShift && (
                     <EditButton
                       theme={theme}
                       onClick={() => onEditWorkingShift(!isEditingWorkingShift)}
                       title={isEditingWorkingShift ? "Отменить редактирование" : "Редактировать"}
                     >
                       <HiPencil size={14} />
                     </EditButton>
                   )}
                   {isMinMessagesCount && onEditMinMessagesCount && (
                     <EditButton
                       theme={theme}
                       onClick={() => onEditMinMessagesCount(!isEditingMinMessagesCount)}
                       title={isEditingMinMessagesCount ? "Отменить редактирование" : "Редактировать"}
                     >
                       <HiPencil size={14} />
                     </EditButton>
                   )}
                   {isPromptVersion && onEditPromptVersion && (
                     <EditButton
                       theme={theme}
                       onClick={() => onEditPromptVersion(!isEditingPromptVersion)}
                       title={isEditingPromptVersion ? "Отменить редактирование" : "Редактировать"}
                     >
                       <HiPencil size={14} />
                     </EditButton>
                   )}
                  <InfoCardLabel theme={theme}>{formatLabel(k)}</InfoCardLabel>
                  <InfoCardValue theme={theme}>
                    {isLimit && onLimitChange && isEditingLimit ? (
                      <LimitEditor>
                        <LimitInput
                          type="number"
                          value={limitValue !== null && limitValue !== undefined ? limitValue : v || 0}
                          onChange={(e) => onLimitChange(Number(e.target.value))}
                          theme={theme}
                          autoFocus
                        />
                        <SaveLimitButton
                          theme={theme}
                          onClick={() => {
                            const valueToSave = limitValue !== null && limitValue !== undefined ? limitValue : v || 0;
                            onLimitChange(valueToSave, true);
                          }}
                          disabled={isSavingLimit}
                          title="Сохранить"
                        >
                          <HiCheck size={16} />
                        </SaveLimitButton>
                      </LimitEditor>
                    ) : isWorkingShift && onWorkingShiftChange && isEditingWorkingShift ? (
                      <LimitEditor>
                        <LimitInput
                          type="number"
                          value={workingShiftValue !== null && workingShiftValue !== undefined ? workingShiftValue : v || 0}
                          onChange={(e) => onWorkingShiftChange(Number(e.target.value))}
                          theme={theme}
                          autoFocus
                        />
                        <SaveLimitButton
                          theme={theme}
                          onClick={() => {
                            const valueToSave = workingShiftValue !== null && workingShiftValue !== undefined ? workingShiftValue : v || 0;
                            onWorkingShiftChange(valueToSave, true);
                          }}
                          disabled={isSavingWorkingShift}
                          title="Сохранить"
                        >
                          <HiCheck size={16} />
                        </SaveLimitButton>
                      </LimitEditor>
                     ) : isMinMessagesCount && onMinMessagesCountChange && isEditingMinMessagesCount ? (
                       <LimitEditor>
                         <LimitInput
                           type="number"
                           value={minMessagesCountValue !== null && minMessagesCountValue !== undefined ? minMessagesCountValue : v || 0}
                           onChange={(e) => onMinMessagesCountChange(Number(e.target.value))}
                           theme={theme}
                           autoFocus
                         />
                         <SaveLimitButton
                           theme={theme}
                           onClick={() => {
                             const valueToSave = minMessagesCountValue !== null && minMessagesCountValue !== undefined ? minMessagesCountValue : v || 0;
                             onMinMessagesCountChange(valueToSave, true);
                           }}
                           disabled={isSavingMinMessagesCount}
                           title="Сохранить"
                         >
                           <HiCheck size={16} />
                         </SaveLimitButton>
                       </LimitEditor>
                     ) : isPromptVersion && onPromptVersionChange && isEditingPromptVersion ? (
                       <LimitEditor>
                         {isLoadingPrompts ? (
                           <span style={{ fontSize: '14px', color: theme.colors.secondary }}>Загрузка...</span>
                         ) : (
                           <>
                             <PromptSelect
                               theme={theme}
                               value={promptVersionValue || ''}
                               onChange={(e) => onPromptVersionChange(Number(e.target.value))}
                               autoFocus
                             >
                               <option value="">Выберите вариант</option>
                               {promptOptions && promptOptions.map((option) => (
                                 <option key={option.id} value={option.id}>
                                   {option.name} ({option.level})
                                 </option>
                               ))}
                             </PromptSelect>
                             <SaveLimitButton
                               theme={theme}
                               onClick={() => {
                                 if (promptVersionValue) {
                                   onPromptVersionChange(promptVersionValue, true);
                                 }
                               }}
                               disabled={isSavingPromptVersion || !promptVersionValue}
                               title="Сохранить"
                             >
                               <HiCheck size={16} />
                             </SaveLimitButton>
                           </>
                         )}
                       </LimitEditor>
                     ) : (
                       formatValue(v)
                     )}
                  </InfoCardValue>
                </InfoCard>
              );
            })}
          </InfoGrid>
        )}
         {complex.map(([k, v]) => {
          const lowerKey = k.toLowerCase();
          const isPromptVersion = lowerKey === 'prompt_version' || 
                                 lowerKey === 'promptversion' ||
                                 (k.toLowerCase().includes('prompt') && k.toLowerCase().includes('version'));
          
          // Если это объект prompt_version, извлекаем ID из него
          let promptVersionId = null;
          if (isPromptVersion && typeof v === 'object' && v !== null && !Array.isArray(v)) {
            promptVersionId = v.id || v.prompt_version_id || promptVersionValue;
          }
          
          return (
            <DashboardSection key={k} theme={theme}>
              <DashboardSectionTitle theme={theme}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{formatLabel(k)}</span>
                  {isPromptVersion && onEditPromptVersion && (
                    <EditButton
                      theme={theme}
                      onClick={() => onEditPromptVersion(!isEditingPromptVersion)}
                      title={isEditingPromptVersion ? "Отменить редактирование" : "Редактировать"}
                      style={{ position: 'relative', top: 0, right: 0 }}
                    >
                      <HiPencil size={14} />
                    </EditButton>
                  )}
                </div>
              </DashboardSectionTitle>
              <SectionContent theme={theme}>
                {isPromptVersion && onPromptVersionChange && isEditingPromptVersion ? (
                  <div style={{ marginBottom: '20px' }}>
                    {isLoadingPrompts ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: theme.colors.secondary }}>
                        Загрузка вариантов...
                      </div>
                    ) : promptOptions.length > 0 ? (
                      <div>
                        <InfoCardLabel theme={theme} style={{ marginBottom: '12px' }}>Выберите вариант:</InfoCardLabel>
                        <PromptGrid theme={theme}>
                          {promptOptions.map((option) => {
                            const isSelected = (promptVersionId || promptVersionValue) === option.id;
                            return (
                              <PromptCard
                                key={option.id}
                                theme={theme}
                                $selected={isSelected}
                                onClick={() => onPromptVersionChange(option.id, true)}
                              >
                                <PromptCardName theme={theme} $selected={isSelected}>
                                  {option.name}
                                </PromptCardName>
                                <PromptCardLevel theme={theme}>
                                  {option.level}
                                </PromptCardLevel>
                              </PromptCard>
                            );
                          })}
                        </PromptGrid>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px', color: theme.colors.secondary }}>
                        Нет доступных вариантов
                      </div>
                    )}
                  </div>
                ) : null}
                {!isEditingPromptVersion && renderSettingsData(v, theme, onLimitChange, limitValue, isSavingLimit, isEditingLimit, onEditLimit, onWorkingShiftChange, workingShiftValue, isSavingWorkingShift, isEditingWorkingShift, onEditWorkingShift, onMinMessagesCountChange, minMessagesCountValue, isSavingMinMessagesCount, isEditingMinMessagesCount, onEditMinMessagesCount, onPromptVersionChange, promptVersionValue, promptOptions, isLoadingPrompts, isSavingPromptVersion, isEditingPromptVersion, onEditPromptVersion, selectedLanguage, onLanguageChange)}
              </SectionContent>
            </DashboardSection>
          );
        })}
      </DashboardBlock>
    );
  }
  return (
    <InfoCard theme={theme}>
      <InfoCardValue theme={theme}>{formatValue(data)}</InfoCardValue>
    </InfoCard>
  );
}

export const SettingsPage = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [settingsData, setSettingsData] = useState(null);
  const [error, setError] = useState(null);
  const [limitValue, setLimitValue] = useState(null);
  const [isSavingLimit, setIsSavingLimit] = useState(false);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [workingShiftValue, setWorkingShiftValue] = useState(null);
  const [isSavingWorkingShift, setIsSavingWorkingShift] = useState(false);
  const [isEditingWorkingShift, setIsEditingWorkingShift] = useState(false);
  const [minMessagesCountValue, setMinMessagesCountValue] = useState(null);
  const [isSavingMinMessagesCount, setIsSavingMinMessagesCount] = useState(false);
  const [isEditingMinMessagesCount, setIsEditingMinMessagesCount] = useState(false);
  const [promptVersionValue, setPromptVersionValue] = useState(null);
  const [promptOptions, setPromptOptions] = useState([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [isSavingPromptVersion, setIsSavingPromptVersion] = useState(false);
  const [isEditingPromptVersion, setIsEditingPromptVersion] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiFetch('/api/v1/settings/main/', {
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 401) {
            Notify.failure('Необходима авторизация');
            setError('Необходима авторизация');
          } else {
            Notify.failure(`Ошибка загрузки настроек: ${response.status}`);
            setError(`Ошибка загрузки: ${response.status}`);
          }
          return;
        }

        const data = await response.json();
        setSettingsData(data);
         // Устанавливаем начальные значения
         if (data && typeof data === 'object') {
           if ('limit' in data) {
             setLimitValue(data.limit);
           }
           if ('working_shift' in data) {
             setWorkingShiftValue(data.working_shift);
           }
           if ('min_messages_count' in data) {
             setMinMessagesCountValue(data.min_messages_count);
           }
           // Проверяем различные варианты названия поля prompt version
           if ('prompt_version_id' in data) {
             setPromptVersionValue(data.prompt_version_id);
           } else if ('prompt_version' in data) {
             // Если prompt_version это объект, извлекаем ID
             if (typeof data.prompt_version === 'object' && data.prompt_version !== null) {
               setPromptVersionValue(data.prompt_version.id || data.prompt_version.prompt_version_id);
             } else {
               setPromptVersionValue(data.prompt_version);
             }
           } else {
             // Ищем поле, содержащее prompt и version
             const promptVersionKey = Object.keys(data).find(key => 
               key.toLowerCase().includes('prompt') && key.toLowerCase().includes('version')
             );
             if (promptVersionKey) {
               const promptVersionData = data[promptVersionKey];
               // Если это объект, извлекаем ID
               if (typeof promptVersionData === 'object' && promptVersionData !== null) {
                 setPromptVersionValue(promptVersionData.id || promptVersionData.prompt_version_id);
               } else {
                 setPromptVersionValue(promptVersionData);
               }
             }
           }
         }
         setIsEditingLimit(false);
         setIsEditingWorkingShift(false);
         setIsEditingMinMessagesCount(false);
         setIsEditingPromptVersion(false);
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
        Notify.failure('Произошла ошибка при загрузке настроек');
        setError('Ошибка при загрузке данных');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleLimitChange = async (newValue, shouldSave = false) => {
    setLimitValue(newValue);
    
    if (shouldSave) {
      setIsSavingLimit(true);
      try {
        const response = await apiFetch('/api/v1/settings/main/', {
          method: 'PATCH',
          body: JSON.stringify({
            limit: newValue,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            Notify.failure('Необходима авторизация');
          } else {
            const errorData = await response.json().catch(() => ({}));
            Notify.failure(errorData.message || `Ошибка сохранения: ${response.status}`);
          }
          // Восстанавливаем предыдущее значение при ошибке
          if (settingsData && typeof settingsData === 'object' && 'limit' in settingsData) {
            setLimitValue(settingsData.limit);
          }
          return;
        }

        // Обновляем данные после успешного сохранения
        const updatedData = await response.json();
        
        // Если сервер вернул только обновленное поле, мержим с существующими данными
        if (settingsData && typeof settingsData === 'object') {
          setSettingsData({
            ...settingsData,
            ...updatedData,
            limit: updatedData.limit !== undefined ? updatedData.limit : settingsData.limit
          });
          setLimitValue(updatedData.limit !== undefined ? updatedData.limit : settingsData.limit);
        } else {
          setSettingsData(updatedData);
          setLimitValue(updatedData.limit);
        }
        
        setIsEditingLimit(false);
        Notify.success('Limit успешно обновлен');
        
        // Перезагружаем полные данные для гарантии актуальности
        await refreshSettingsData();
      } catch (error) {
        console.error('Ошибка при сохранении limit:', error);
        Notify.failure('Произошла ошибка при сохранении limit');
        // Восстанавливаем предыдущее значение при ошибке
        if (settingsData && typeof settingsData === 'object' && 'limit' in settingsData) {
          setLimitValue(settingsData.limit);
        }
      } finally {
        setIsSavingLimit(false);
      }
    }
  };

  const handleWorkingShiftChange = async (newValue, shouldSave = false) => {
    setWorkingShiftValue(newValue);
    
    if (shouldSave) {
      setIsSavingWorkingShift(true);
      try {
        const response = await apiFetch('/api/v1/settings/main/', {
          method: 'PATCH',
          body: JSON.stringify({
            working_shift: newValue,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            Notify.failure('Необходима авторизация');
          } else {
            const errorData = await response.json().catch(() => ({}));
            Notify.failure(errorData.message || `Ошибка сохранения: ${response.status}`);
          }
          // Восстанавливаем предыдущее значение при ошибке
          if (settingsData && typeof settingsData === 'object' && 'working_shift' in settingsData) {
            setWorkingShiftValue(settingsData.working_shift);
          }
          return;
        }

        // Обновляем данные после успешного сохранения
        const updatedData = await response.json();
        
        // Если сервер вернул только обновленное поле, мержим с существующими данными
        if (settingsData && typeof settingsData === 'object') {
          setSettingsData({
            ...settingsData,
            ...updatedData,
            working_shift: updatedData.working_shift !== undefined ? updatedData.working_shift : settingsData.working_shift
          });
          setWorkingShiftValue(updatedData.working_shift !== undefined ? updatedData.working_shift : settingsData.working_shift);
        } else {
          setSettingsData(updatedData);
          setWorkingShiftValue(updatedData.working_shift);
        }
        
        setIsEditingWorkingShift(false);
        Notify.success('Working shift успешно обновлен');
        
        // Перезагружаем полные данные для гарантии актуальности
        await refreshSettingsData();
      } catch (error) {
        console.error('Ошибка при сохранении working_shift:', error);
        Notify.failure('Произошла ошибка при сохранении working_shift');
        // Восстанавливаем предыдущее значение при ошибке
        if (settingsData && typeof settingsData === 'object' && 'working_shift' in settingsData) {
          setWorkingShiftValue(settingsData.working_shift);
        }
      } finally {
        setIsSavingWorkingShift(false);
      }
    }
  };

  const handleMinMessagesCountChange = async (newValue, shouldSave = false) => {
    setMinMessagesCountValue(newValue);
    
    if (shouldSave) {
      setIsSavingMinMessagesCount(true);
      try {
        const response = await apiFetch('/api/v1/settings/main/', {
          method: 'PATCH',
          body: JSON.stringify({
            min_messages_count: newValue,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            Notify.failure('Необходима авторизация');
          } else {
            const errorData = await response.json().catch(() => ({}));
            Notify.failure(errorData.message || `Ошибка сохранения: ${response.status}`);
          }
          // Восстанавливаем предыдущее значение при ошибке
          if (settingsData && typeof settingsData === 'object' && 'min_messages_count' in settingsData) {
            setMinMessagesCountValue(settingsData.min_messages_count);
          }
          return;
        }

        // Обновляем данные после успешного сохранения
        const updatedData = await response.json();
        
        // Если сервер вернул только обновленное поле, мержим с существующими данными
        if (settingsData && typeof settingsData === 'object') {
          setSettingsData({
            ...settingsData,
            ...updatedData,
            min_messages_count: updatedData.min_messages_count !== undefined ? updatedData.min_messages_count : settingsData.min_messages_count
          });
          setMinMessagesCountValue(updatedData.min_messages_count !== undefined ? updatedData.min_messages_count : settingsData.min_messages_count);
        } else {
          setSettingsData(updatedData);
          setMinMessagesCountValue(updatedData.min_messages_count);
        }
        
        setIsEditingMinMessagesCount(false);
        Notify.success('Min messages count успешно обновлен');
        
        // Перезагружаем полные данные для гарантии актуальности
        await refreshSettingsData();
      } catch (error) {
        console.error('Ошибка при сохранении min_messages_count:', error);
        Notify.failure('Произошла ошибка при сохранении min_messages_count');
        // Восстанавливаем предыдущее значение при ошибке
        if (settingsData && typeof settingsData === 'object' && 'min_messages_count' in settingsData) {
          setMinMessagesCountValue(settingsData.min_messages_count);
        }
      } finally {
        setIsSavingMinMessagesCount(false);
      }
    }
  };

  const handleEditPromptVersion = async (isEditing) => {
    setIsEditingPromptVersion(isEditing);
    
    if (isEditing) {
      // При открытии редактирования загружаем все prompts без фильтра по языку
      setIsLoadingPrompts(true);
      try {
        const response = await apiFetch('/api/v1/settings/main/prompts', {
          method: 'GET',
        });

        if (response.ok) {
          const options = await response.json();
          console.log('Загружены варианты prompts:', options);
          setPromptOptions(Array.isArray(options) ? options : []);
        } else {
          Notify.failure('Ошибка при загрузке вариантов prompts');
          setPromptOptions([]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке prompts:', error);
        Notify.failure('Произошла ошибка при загрузке вариантов prompts');
        setPromptOptions([]);
      } finally {
        setIsLoadingPrompts(false);
      }
    } else {
      // При закрытии редактирования сбрасываем выбранный язык и варианты
      setSelectedLanguage('');
      setPromptOptions([]);
      setPromptVersionValue(null);
    }
  };

  const handleLanguageChange = async (language) => {
    setSelectedLanguage(language);
    setPromptVersionValue(null); // Сбрасываем выбранный prompt при смене языка
    
    // Загружаем варианты prompts для выбранного языка с параметром ?language=
    setIsLoadingPrompts(true);
    try {
      const url = language ? `/api/v1/settings/main/prompts?language=${language}` : '/api/v1/settings/main/prompts';
      const response = await apiFetch(url, {
        method: 'GET',
      });

      if (response.ok) {
        const options = await response.json();
        console.log('Загружены варианты prompts для языка', language || 'все', ':', options);
        setPromptOptions(Array.isArray(options) ? options : []);
      } else {
        Notify.failure('Ошибка при загрузке вариантов prompts');
        setPromptOptions([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке prompts:', error);
      Notify.failure('Произошла ошибка при загрузке вариантов prompts');
      setPromptOptions([]);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const handlePromptVersionChange = async (newValue, shouldSave = false) => {
    setPromptVersionValue(newValue);
    
    if (shouldSave && newValue) {
      setIsSavingPromptVersion(true);
      try {
        const response = await apiFetch('/api/v1/settings/main/', {
          method: 'PATCH',
          body: JSON.stringify({
            prompt_version_id: newValue,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            Notify.failure('Необходима авторизация');
          } else {
            const errorData = await response.json().catch(() => ({}));
            Notify.failure(errorData.message || `Ошибка сохранения: ${response.status}`);
          }
          // Восстанавливаем предыдущее значение при ошибке
          if (settingsData && typeof settingsData === 'object') {
            const prevValue = settingsData.prompt_version_id || settingsData.prompt_version;
            setPromptVersionValue(prevValue);
          }
          return;
        }

        // Обновляем данные после успешного сохранения
        const updatedData = await response.json();
        
        // Если сервер вернул только обновленное поле, мержим с существующими данными
        if (settingsData && typeof settingsData === 'object') {
          setSettingsData({
            ...settingsData,
            ...updatedData,
            prompt_version_id: updatedData.prompt_version_id !== undefined ? updatedData.prompt_version_id : (settingsData.prompt_version_id || settingsData.prompt_version)
          });
          setPromptVersionValue(updatedData.prompt_version_id !== undefined ? updatedData.prompt_version_id : (settingsData.prompt_version_id || settingsData.prompt_version));
        } else {
          setSettingsData(updatedData);
          setPromptVersionValue(updatedData.prompt_version_id || updatedData.prompt_version);
        }
        
        setIsEditingPromptVersion(false);
        Notify.success('Prompt version успешно обновлен');
        
        // Перезагружаем полные данные для гарантии актуальности
        await refreshSettingsData();
      } catch (error) {
        console.error('Ошибка при сохранении prompt_version_id:', error);
        Notify.failure('Произошла ошибка при сохранении prompt version');
        // Восстанавливаем предыдущее значение при ошибке
        if (settingsData && typeof settingsData === 'object') {
          const prevValue = settingsData.prompt_version_id || settingsData.prompt_version;
          setPromptVersionValue(prevValue);
        }
      } finally {
        setIsSavingPromptVersion(false);
      }
    }
  };

  const refreshSettingsData = async () => {
    try {
      const refreshResponse = await apiFetch('/api/v1/settings/main/', {
        method: 'GET',
      });
      
      if (refreshResponse.ok) {
        const fullData = await refreshResponse.json();
        setSettingsData(fullData);
        if (fullData && typeof fullData === 'object') {
          if ('limit' in fullData) {
            setLimitValue(fullData.limit);
          }
          if ('working_shift' in fullData) {
            setWorkingShiftValue(fullData.working_shift);
          }
          if ('min_messages_count' in fullData) {
            setMinMessagesCountValue(fullData.min_messages_count);
          }
          if ('prompt_version_id' in fullData) {
            setPromptVersionValue(fullData.prompt_version_id);
          } else if ('prompt_version' in fullData) {
            // Если prompt_version это объект, извлекаем ID
            if (typeof fullData.prompt_version === 'object' && fullData.prompt_version !== null) {
              setPromptVersionValue(fullData.prompt_version.id || fullData.prompt_version.prompt_version_id);
            } else {
              setPromptVersionValue(fullData.prompt_version);
            }
          }
        }
      }
    } catch (refreshError) {
      console.error('Ошибка при обновлении данных:', refreshError);
      // Не показываем ошибку пользователю, так как основное сохранение прошло успешно
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <PageContent>
          <Loader />
        </PageContent>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContent>
        <OverviewSection theme={theme}>
          <OverviewHeader>
            <OverviewTitle theme={theme}>Настройки</OverviewTitle>
          </OverviewHeader>
        </OverviewSection>

        <ContentWrapper theme={theme}>
          {error ? (
            <ErrorBlock>
              Ошибка при загрузке данных: {error}
            </ErrorBlock>
          ) : (
            settingsData ? (
               renderSettingsData(
                 settingsData, 
                 theme, 
                 handleLimitChange, 
                 limitValue, 
                 isSavingLimit, 
                 isEditingLimit, 
                 setIsEditingLimit,
                 handleWorkingShiftChange,
                 workingShiftValue,
                 isSavingWorkingShift,
                 isEditingWorkingShift,
                 setIsEditingWorkingShift,
                 handleMinMessagesCountChange,
                 minMessagesCountValue,
                 isSavingMinMessagesCount,
                 isEditingMinMessagesCount,
                 setIsEditingMinMessagesCount,
                 handlePromptVersionChange,
                 promptVersionValue,
                 promptOptions,
                 isLoadingPrompts,
                 isSavingPromptVersion,
                 isEditingPromptVersion,
                 handleEditPromptVersion,
                 selectedLanguage,
                 handleLanguageChange
               )
            ) : (
              <EmptyState theme={theme}>Нет данных для отображения</EmptyState>
            )
          )}
        </ContentWrapper>
      </PageContent>
    </Layout>
  );
};

