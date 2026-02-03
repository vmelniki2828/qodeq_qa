import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { apiFetch } from '../utils/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { HiTrash, HiPencil, HiCheck, HiPlus, HiMagnifyingGlass } from 'react-icons/hi2';

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
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

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

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  height: fit-content;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

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

const DataContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const DataCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
`;

const CardContent = styled.div`
  flex: 1;
`;

const DeleteButton = styled.button`
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
  z-index: 10;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #ef4444;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const GroupName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
  word-break: break-word;
`;

const GroupHead = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HeadLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
`;

const HeadValue = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const ButtonsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const CreateButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  max-width: ${({ $isCreateModal, $isDetailsModal }) => {
    if ($isCreateModal) return '800px';
    if ($isDetailsModal) return '900px';
    return '600px';
  }};
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

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

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  padding: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;
  margin-right: 8px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const SaveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  padding: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;
  margin-right: 8px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    color: ${({ theme }) => theme.colors.accent};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EditableInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  font-weight: 600;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const EditableTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  font-weight: 600;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  resize: none;
  min-height: 120px;
  word-break: break-word;
  overflow-wrap: break-word;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const EditableSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  font-weight: 600;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

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

const FormSection = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  resize: none;
  min-height: 120px;
  height: 120px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.secondary};
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const AgentsInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AgentInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RemoveAgentButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const AddAgentButton = styled.button`
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

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const CreateSaveButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const InfoCard = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  transition: all 0.2s ease;
  box-sizing: border-box;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.12)'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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
`;

const DashboardSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-bottom: 24px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddAgentButtonSmall = styled.button`
  background: none;
  border: none;
  color: #10b981;
  cursor: pointer;
  padding: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    background-color: rgba(16, 185, 129, 0.1);
    color: #059669;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AgentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const AgentItem = styled.div`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const AgentItemContent = styled.div`
  flex: 1;
  cursor: pointer;
`;

const AgentItemAddButton = styled.button`
  background: none;
  border: none;
  color: #10b981;
  cursor: pointer;
  padding: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(16, 185, 129, 0.1);
    color: #059669;
    transform: scale(1.1);
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

const AgentItemRemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    transform: scale(1.1);
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

const AgentItemName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const AgentItemId = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
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
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;


// Функция для получения начала месяца
const getMonthStart = (year, month) => {
  return new Date(year, month, 1);
};

// Функция для получения конца месяца
const getMonthEnd = (year, month) => {
  return new Date(year, month + 1, 0);
};

// Функция для форматирования даты в YYYY-MM-DD
const formatDateForAPI = (date) => {
  // Если это уже строка в формате YYYY-MM-DD, возвращаем как есть
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Если это объект Date
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Если это строка с датой, пытаемся преобразовать
  if (typeof date === 'string') {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  return date;
};

// Функция для генерации списка месяцев
const generateMonths = () => {
  const months = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Генерируем 12 месяцев назад от текущего
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
    months.push({
      value: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      year,
      month
    });
  }
  
  return months;
};

// Функция для получения начального месяца (текущий месяц)
const getInitialMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return `${year}-${String(month + 1).padStart(2, '0')}`;
};

// Функция для отображения данных групп (только name и head_username)
const renderGroups = (data, theme, onGroupClick, onDeleteGroup) => {
  if (!data) {
    return null;
  }

  // Если данные - массив
  if (Array.isArray(data)) {
    return data.map((item, index) => {
      const name = item?.name || '—';
      const headUsername = item?.head_username || '—';
      const groupId = item?.id || item?.group_id || null;
      
      return (
        <DataCard 
          key={index} 
          theme={theme}
          onClick={() => groupId && onGroupClick(groupId)}
        >
          <CardHeader>
            <CardContent>
              <GroupName theme={theme}>{name}</GroupName>
              <GroupHead theme={theme}>
                <HeadLabel theme={theme}>Head:</HeadLabel>
                <HeadValue theme={theme}>{headUsername}</HeadValue>
              </GroupHead>
            </CardContent>
          </CardHeader>
          {groupId && (
            <DeleteButton
              theme={theme}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteGroup(groupId, name);
              }}
              title="Удалить группу"
            >
              <HiTrash size={16} />
            </DeleteButton>
          )}
        </DataCard>
      );
    });
  }

  // Если данные - объект с массивом групп
  if (typeof data === 'object' && data !== null) {
    // Проверяем, есть ли массив групп в объекте
    const groups = data.groups || data.items || data.results || (Array.isArray(data) ? data : [data]);
    
    if (Array.isArray(groups)) {
      return groups.map((item, index) => {
        const name = item?.name || '—';
        const headUsername = item?.head_username || '—';
        const groupId = item?.id || item?.group_id || null;
        
        return (
          <DataCard 
            key={index} 
            theme={theme}
            onClick={() => groupId && onGroupClick(groupId)}
          >
            <CardHeader>
              <CardContent>
                <GroupName theme={theme}>{name}</GroupName>
                <GroupHead theme={theme}>
                  <HeadLabel theme={theme}>Head:</HeadLabel>
                  <HeadValue theme={theme}>{headUsername}</HeadValue>
                </GroupHead>
              </CardContent>
            </CardHeader>
            {groupId && (
              <DeleteButton
                theme={theme}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroup(groupId, name);
                }}
                title="Удалить группу"
              >
                ×
              </DeleteButton>
            )}
          </DataCard>
        );
      });
    }
    
    // Если это один объект группы
    const name = data?.name || '—';
    const headUsername = data?.head_username || '—';
    const groupId = data?.id || data?.group_id || null;
    
    return (
      <DataCard 
        theme={theme}
        onClick={() => groupId && onGroupClick(groupId)}
      >
        <CardHeader>
          <CardContent>
            <GroupName theme={theme}>{name}</GroupName>
            <GroupHead theme={theme}>
              <HeadLabel theme={theme}>Head:</HeadLabel>
              <HeadValue theme={theme}>{headUsername}</HeadValue>
            </GroupHead>
          </CardContent>
        </CardHeader>
        {groupId && (
          <DeleteButton
            theme={theme}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteGroup(groupId, name);
            }}
            title="Удалить группу"
          >
            ×
          </DeleteButton>
        )}
      </DataCard>
    );
  }

  return null;
};

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

// Функция для проверки, нужно ли скрыть поле
const shouldHideField = (key) => {
  const lowerKey = key.toLowerCase();
  return lowerKey === 'id' || lowerKey === '_id' || lowerKey === 'head_id' || lowerKey === 'start_date' || lowerKey === 'end_date' || lowerKey.endsWith('_id') || lowerKey.endsWith('id');
};

// Функция для рекурсивного отображения деталей группы
const renderGroupDetails = (data, theme, isEditing = false, editValues = {}, onEditChange = null, heads = [], onOpenAgentModal = null, onRemoveAgent = null) => {
  if (data == null || (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)) {
    return <EmptyState theme={theme}>Нет данных для отображения</EmptyState>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <EmptyState theme={theme}>Пустой список</EmptyState>;
    
    // Проверяем, все ли элементы примитивы
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

    // Если массив объектов, создаем таблицу
    const allColumns = [...new Set(data.flatMap((obj) => (obj && typeof obj === 'object' ? Object.keys(obj) : [])))];
    // Фильтруем колонки с ID
    const columns = allColumns.filter(col => !shouldHideField(col));
    
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
    // Фильтруем поля id и head_id
    const entries = Object.entries(data).filter(([key]) => !shouldHideField(key));
    
    if (entries.length === 0) return <EmptyState theme={theme}>Нет данных для отображения</EmptyState>;

    // Разделяем на примитивы и сложные объекты
    const primitives = [];
    const complex = [];

    entries.forEach(([key, value]) => {
      if (value == null || (typeof value !== 'object' && typeof value !== 'function') || Array.isArray(value)) {
        primitives.push([key, value]);
      } else {
        complex.push([key, value]);
      }
    });

    // Разделяем примитивы на name/head_username, обычные, comment и agents
    const nameHeadPrimitives = [];
    const regularPrimitives = [];
    const commentPrimitive = [];
    const agentsPrimitive = [];
    
    primitives.forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'comment') {
        commentPrimitive.push([key, value]);
      } else if (lowerKey === 'agents') {
        agentsPrimitive.push([key, value]);
      } else if (lowerKey === 'name' || lowerKey === 'head_username') {
        nameHeadPrimitives.push([key, value]);
      } else {
        regularPrimitives.push([key, value]);
      }
    });

    return (
      <div>
        {nameHeadPrimitives.length > 0 && (
          <InfoGrid theme={theme} style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '24px' }}>
            {nameHeadPrimitives.map(([key, value]) => {
              const lowerKey = key.toLowerCase();
              const isEditable = isEditing && (lowerKey === 'name' || lowerKey === 'head_username');
              const isHeadUsername = lowerKey === 'head_username';
              
              return (
                <InfoCard key={key} theme={theme}>
                  <InfoCardLabel theme={theme}>{formatLabel(key)}</InfoCardLabel>
                  <InfoCardValue theme={theme}>
                    {isEditable && isHeadUsername ? (
                      <EditableSelect
                        theme={theme}
                        value={editValues[lowerKey] !== undefined ? editValues[lowerKey] : formatValue(value)}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedHead = heads.find(head => {
                            if (typeof head === 'object' && head !== null) {
                              const headValue = head.username || head.head_username || head.name || '';
                              return headValue === selectedValue;
                            }
                            return head === selectedValue;
                          });
                          const headUsername = selectedHead 
                            ? (selectedHead.username || selectedHead.head_username || selectedHead.name || '') 
                            : selectedValue;
                          onEditChange && onEditChange(lowerKey, headUsername);
                        }}
                      >
                        <option value="">Выберите руководителя</option>
                        {heads.map((head, index) => {
                          const headDisplayName = typeof head === 'object' && head !== null
                            ? (head.name || head.username || head.head_username || head.id || '')
                            : head;
                          const headValue = typeof head === 'object' && head !== null
                            ? (head.username || head.head_username || head.name || '')
                            : head;
                          return (
                            <option key={index} value={headValue}>
                              {headDisplayName}
                            </option>
                          );
                        })}
                      </EditableSelect>
                    ) : isEditable ? (
                      <EditableInput
                        theme={theme}
                        type="text"
                        value={editValues[lowerKey] !== undefined ? editValues[lowerKey] : formatValue(value)}
                        onChange={(e) => onEditChange && onEditChange(lowerKey, e.target.value)}
                      />
                    ) : Array.isArray(value) ? (
                      <TagsWrap theme={theme}>
                        {value.map((v, i) => (
                          <Tag key={i} theme={theme}>{formatValue(v)}</Tag>
                        ))}
                      </TagsWrap>
                    ) : (
                      formatValue(value)
                    )}
                  </InfoCardValue>
                </InfoCard>
              );
            })}
          </InfoGrid>
        )}

        {regularPrimitives.length > 0 && (
          <InfoGrid theme={theme}>
            {regularPrimitives.map(([key, value]) => {
              const lowerKey = key.toLowerCase();
              const isEditable = isEditing && (lowerKey === 'name' || lowerKey === 'head_username');
              const isHeadUsername = lowerKey === 'head_username';
              
              return (
                <InfoCard key={key} theme={theme}>
                  <InfoCardLabel theme={theme}>{formatLabel(key)}</InfoCardLabel>
                  <InfoCardValue theme={theme}>
                    {isEditable && isHeadUsername ? (
                      <EditableSelect
                        theme={theme}
                        value={editValues[lowerKey] !== undefined ? editValues[lowerKey] : formatValue(value)}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedHead = heads.find(head => {
                            if (typeof head === 'object' && head !== null) {
                              const headValue = head.username || head.head_username || head.name || '';
                              return headValue === selectedValue;
                            }
                            return head === selectedValue;
                          });
                          const headUsername = selectedHead 
                            ? (selectedHead.username || selectedHead.head_username || selectedHead.name || '') 
                            : selectedValue;
                          onEditChange && onEditChange(lowerKey, headUsername);
                        }}
                      >
                        <option value="">Выберите руководителя</option>
                        {heads.map((head, index) => {
                          const headDisplayName = typeof head === 'object' && head !== null
                            ? (head.name || head.username || head.head_username || head.id || '')
                            : head;
                          const headValue = typeof head === 'object' && head !== null
                            ? (head.username || head.head_username || head.name || '')
                            : head;
                          return (
                            <option key={index} value={headValue}>
                              {headDisplayName}
                            </option>
                          );
                        })}
                      </EditableSelect>
                    ) : isEditable ? (
                      <EditableInput
                        theme={theme}
                        type="text"
                        value={editValues[lowerKey] !== undefined ? editValues[lowerKey] : formatValue(value)}
                        onChange={(e) => onEditChange && onEditChange(lowerKey, e.target.value)}
                      />
                    ) : Array.isArray(value) ? (
                      <TagsWrap theme={theme}>
                        {value.map((v, i) => (
                          <Tag key={i} theme={theme}>{formatValue(v)}</Tag>
                        ))}
                      </TagsWrap>
                    ) : (
                      formatValue(value)
                    )}
                  </InfoCardValue>
                </InfoCard>
              );
            })}
          </InfoGrid>
        )}

        {commentPrimitive.length > 0 && (
          <div style={{ marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
            {commentPrimitive.map(([key, value]) => {
              const lowerKey = key.toLowerCase();
              const isEditable = isEditing && lowerKey === 'comment';
              
              return (
                <InfoCard key={key} theme={theme} style={{ width: '100%', boxSizing: 'border-box' }}>
                  <InfoCardLabel theme={theme}>{formatLabel(key)}</InfoCardLabel>
                  {isEditable ? (
                    <EditableTextarea
                      theme={theme}
                      value={editValues[lowerKey] !== undefined ? editValues[lowerKey] : formatValue(value)}
                      onChange={(e) => onEditChange && onEditChange(lowerKey, e.target.value)}
                    />
                  ) : (
                    <InfoCardValue theme={theme} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {Array.isArray(value) ? (
                        <TagsWrap theme={theme}>
                          {value.map((v, i) => (
                            <Tag key={i} theme={theme}>{formatValue(v)}</Tag>
                          ))}
                        </TagsWrap>
                      ) : (
                        formatValue(value)
                      )}
                    </InfoCardValue>
                  )}
                </InfoCard>
              );
            })}
          </div>
        )}

        {agentsPrimitive.length > 0 && (
          <DashboardSection theme={theme}>
            <DashboardSectionTitle theme={theme}>
              {agentsPrimitive.map(([key]) => formatLabel(key))}
              <AddAgentButtonSmall 
                theme={theme} 
                title="Добавить агента"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenAgentModal) {
                    onOpenAgentModal();
                  }
                }}
              >
                <HiPlus size={18} />
              </AddAgentButtonSmall>
            </DashboardSectionTitle>
            <SectionContent theme={theme}>
              {agentsPrimitive.map(([key, value]) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Array.isArray(value) && value.length > 0 ? (
                    value.map((agent, i) => {
                      // Если agent - это объект, берем name, иначе сам agent
                      const agentName = typeof agent === 'object' && agent !== null
                        ? (agent.name || agent.username || agent.agent_name || agent.id || agent.uuid || '')
                        : agent;
                      const agentId = typeof agent === 'object' && agent !== null
                        ? (agent.id || agent.uuid || agent.agent_id || '')
                        : agent;
                      
                      return (
                        <AgentItem key={i} theme={theme}>
                          <AgentItemContent theme={theme}>
                            <AgentItemName theme={theme}>{agentName || formatValue(agent)}</AgentItemName>
                          </AgentItemContent>
                          <AgentItemRemoveButton
                            theme={theme}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onRemoveAgent && agentId) {
                                onRemoveAgent(agentId, agentName);
                              }
                            }}
                            title="Удалить агента из группы"
                          >
                            <HiTrash size={18} />
                          </AgentItemRemoveButton>
                        </AgentItem>
                      );
                    })
                  ) : (
                    <EmptyState theme={theme}>Нет агентов</EmptyState>
                  )}
                </div>
              ))}
            </SectionContent>
          </DashboardSection>
        )}

        {complex.map(([key, value]) => (
          <DashboardSection key={key} theme={theme}>
            <DashboardSectionTitle theme={theme}>{formatLabel(key)}</DashboardSectionTitle>
            <SectionContent theme={theme}>
              {renderGroupDetails(value, theme, isEditing, editValues, onEditChange, heads, onOpenAgentModal, onRemoveAgent)}
            </SectionContent>
          </DashboardSection>
        ))}
      </div>
    );
  }

  return <InfoCardValue theme={theme}>{formatValue(data)}</InfoCardValue>;
};

export const GroupsQAPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth());
  const months = generateMonths();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [heads, setHeads] = useState([]);
  const [isLoadingHeads, setIsLoadingHeads] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editValues, setEditValues] = useState({
    name: '',
    head_username: '',
    comment: ''
  });
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [freeAgents, setFreeAgents] = useState([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [addedAgents, setAddedAgents] = useState(new Set());
  const [agentFilter, setAgentFilter] = useState('');
  const hasLoadedRef = useRef(false);
  const headsLoadedRef = useRef(false);
  const isFetchingRef = useRef(false);
  const previousMonthRef = useRef(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    head_id: '',
    head_username: '',
    comment: '',
    selectedMonth: getInitialMonth(),
    agents: ['']
  });

  const fetchData = async () => {
    if (!selectedMonth) {
      Notify.warning('Пожалуйста, выберите месяц');
      return;
    }

    // Предотвращаем множественные одновременные запросы
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      // Парсим выбранный месяц (формат: YYYY-MM)
      const [year, month] = selectedMonth.split('-').map(Number);
      const monthStart = getMonthStart(year, month - 1);
      const monthEnd = getMonthEnd(year, month - 1);
      
      const formattedStartDate = formatDateForAPI(monthStart);
      const formattedEndDate = formatDateForAPI(monthEnd);
      
      const url = `https://209.38.246.190/api/v1/group/qa/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      
      const response = await apiFetch(url, {
        method: 'GET',
      });
      
      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'Неверные параметры запроса';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }
      
      const json = await response.json();
      setData(json);
      Notify.success('Данные успешно загружены');
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при загрузке данных';
      setError(errorMessage);
      setData(null);
      Notify.failure(errorMessage);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const fetchHeads = async () => {
    if (headsLoadedRef.current || isLoadingHeads) {
      return;
    }
    
    setIsLoadingHeads(true);
    try {
      const response = await apiFetch('https://209.38.246.190/api/v1/group/qa/heads/', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }
      
      const json = await response.json();
      // Предполагаем, что API возвращает массив объектов или массив строк
      // Если это массив объектов, нужно будет адаптировать код
      setHeads(Array.isArray(json) ? json : []);
      headsLoadedRef.current = true;
    } catch (e) {
      console.error('Ошибка при загрузке heads:', e);
      Notify.failure('Не удалось загрузить список руководителей');
      setHeads([]);
    } finally {
      setIsLoadingHeads(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateForm({
      name: '',
      head_id: '',
      head_username: '',
      comment: '',
      selectedMonth: getInitialMonth(),
      agents: ['']
    });
    if (!headsLoadedRef.current) {
      fetchHeads();
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const fetchFreeAgents = async () => {
    setIsLoadingAgents(true);
    try {
      const response = await apiFetch('https://209.38.246.190/api/v1/group/qa/agent/?free_agent=true', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }
      
      const json = await response.json();
      setFreeAgents(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error('Ошибка при загрузке свободных агентов:', e);
      Notify.failure('Не удалось загрузить список свободных агентов');
      setFreeAgents([]);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const handleOpenAgentModal = () => {
    setIsAgentModalOpen(true);
    fetchFreeAgents();
    
    // Загружаем текущих агентов группы и добавляем их в addedAgents
    if (groupDetails && groupDetails.agents && Array.isArray(groupDetails.agents)) {
      const currentAgentIds = groupDetails.agents
        .map(agent => {
          if (typeof agent === 'object' && agent !== null) {
            return agent.id || agent.uuid || agent.agent_id || '';
          }
          return agent;
        })
        .filter(id => id);
      setAddedAgents(new Set(currentAgentIds));
    }
  };

  const handleCloseAgentModal = () => {
    setIsAgentModalOpen(false);
    setFreeAgents([]);
    setAddedAgents(new Set());
  };

  const handleAddAgentToGroup = async (agentId, agentName) => {
    if (!currentGroupId || !agentId) {
      Notify.warning('Не указан ID группы или агента');
      return;
    }

    try {
      const response = await apiFetch(
        `https://209.38.246.190/api/v1/group/qa/add-agents/?group_id=${currentGroupId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agents: [agentId]
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'Неверные параметры запроса';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }

      // Добавляем агента в список добавленных
      setAddedAgents(prev => new Set([...prev, agentId]));
      
      // Показываем нотификацию с именем агента
      Notify.success(`Агент "${agentName}" успешно добавлен в группу`);
      
      // Обновляем детали группы, но не закрываем модальное окно и не сбрасываем addedAgents
      if (currentGroupId) {
        // Обновляем детали группы в фоне, не закрывая модальное окно выбора агентов
        const updateGroupDetails = async () => {
          try {
            const response = await apiFetch(`https://209.38.246.190/api/v1/group/qa/${currentGroupId}`, {
              method: 'GET',
            });
            if (response.ok) {
              const json = await response.json();
              setGroupDetails(json);
            }
          } catch (e) {
            console.error('Ошибка при обновлении деталей группы:', e);
          }
        };
        updateGroupDetails();
      }
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при добавлении агента';
      Notify.failure(errorMessage);
    }
  };

  const handleRemoveAgentFromGroup = async (agentId, agentName) => {
    if (!currentGroupId || !agentId) {
      Notify.warning('Не указан ID группы или агента');
      return;
    }

    try {
      const response = await apiFetch(
        `https://209.38.246.190/api/v1/group/qa/delete-agents/?group_id=${currentGroupId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agents: [agentId]
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'Неверные параметры запроса';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }

      // Удаляем агента из списка добавленных
      setAddedAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
      
      // Показываем нотификацию с именем агента
      Notify.success(`Агент "${agentName}" удален из группы`);
      
      // Обновляем детали группы без перезагрузки компонента
      if (currentGroupId && groupDetails) {
        // Обновляем массив agents в groupDetails, удаляя удаленного агента
        const updatedAgents = (groupDetails.agents || []).filter(agent => {
          const id = typeof agent === 'object' && agent !== null
            ? (agent.id || agent.uuid || agent.agent_id || '')
            : agent;
          return id !== agentId;
        });
        setGroupDetails({
          ...groupDetails,
          agents: updatedAgents
        });
      }
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при удалении агента';
      Notify.failure(errorMessage);
    }
  };

  const handleGroupClick = async (groupId) => {
    if (!groupId) return;
    
    setCurrentGroupId(groupId);
    setIsDetailsModalOpen(true);
    setIsLoadingDetails(true);
    setGroupDetails(null);
    setIsEditingDetails(false);
    setEditValues({ name: '', head_username: '', comment: '' });
    setAddedAgents(new Set());
    
    // Загружаем список руководителей при открытии модального окна
    if (!headsLoadedRef.current) {
      fetchHeads();
    }
    
    try {
      const response = await apiFetch(`https://209.38.246.190/api/v1/group/qa/${groupId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 404) {
            errorMessage = 'Группа не найдена';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }
      
      const json = await response.json();
      setGroupDetails(json);
      setEditValues({
        name: json.name || '',
        head_username: json.head_username || '',
        comment: json.comment || ''
      });
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при загрузке деталей группы';
      Notify.failure(errorMessage);
      setGroupDetails(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleEditDetails = () => {
    if (groupDetails) {
      setIsEditingDetails(true);
    }
  };

  const handleSaveDetails = async () => {
    if (!currentGroupId) return;
    
    setIsSavingDetails(true);
    try {
      const response = await apiFetch(`https://209.38.246.190/api/v1/group/qa/${currentGroupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editValues.name,
          head_username: editValues.head_username,
          comment: editValues.comment
        }),
      });
      
      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'Неверные параметры запроса';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }
      
      const json = await response.json();
      setGroupDetails(json);
      setIsEditingDetails(false);
      Notify.success('Данные успешно обновлены');
      
      // Обновляем список групп
      fetchData();
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при сохранении данных';
      Notify.failure(errorMessage);
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleCancelEdit = () => {
    if (groupDetails) {
      setEditValues({
        name: groupDetails.name || '',
        head_username: groupDetails.head_username || '',
        comment: groupDetails.comment || ''
      });
    }
    setIsEditingDetails(false);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setGroupDetails(null);
    setIsEditingDetails(false);
    setEditValues({ name: '', head_username: '', comment: '' });
    setCurrentGroupId(null);
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!window.confirm(`Вы уверены, что хотите удалить группу "${groupName}"?`)) {
      return;
    }

    try {
      const response = await apiFetch(`https://209.38.246.190/api/v1/group/qa/${groupId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 404) {
            errorMessage = 'Группа не найдена';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }
      
      Notify.success('Группа успешно удалена');
      
      // Обновляем данные
      if (selectedMonth) {
        fetchData();
      }
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при удалении группы';
      Notify.failure(errorMessage);
    }
  };

  // Автоматическая загрузка данных при монтировании
  useEffect(() => {
    if (selectedMonth && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      previousMonthRef.current = selectedMonth;
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Выполняется только при монтировании

  // Автоматическая загрузка данных при изменении месяца
  useEffect(() => {
    if (selectedMonth && hasLoadedRef.current && previousMonthRef.current !== selectedMonth) {
      previousMonthRef.current = selectedMonth;
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const handleAddAgent = () => {
    setCreateForm({
      ...createForm,
      agents: [...createForm.agents, '']
    });
  };

  const handleRemoveAgent = (index) => {
    const newAgents = createForm.agents.filter((_, i) => i !== index);
    setCreateForm({
      ...createForm,
      agents: newAgents.length > 0 ? newAgents : ['']
    });
  };

  const handleAgentChange = (index, value) => {
    const newAgents = [...createForm.agents];
    newAgents[index] = value;
    setCreateForm({
      ...createForm,
      agents: newAgents
    });
  };

  const handleCreateGroup = async () => {
    if (!createForm.name || !createForm.name.trim()) {
      Notify.failure('Пожалуйста, заполните поле Name');
      return;
    }

    if (!createForm.head_id || !createForm.head_id.trim()) {
      Notify.failure('Пожалуйста, заполните поле Head ID');
      return;
    }

    if (!createForm.selectedMonth) {
      Notify.failure('Пожалуйста, выберите месяц');
      return;
    }

    setIsCreating(true);
    
    try {
      // Парсим выбранный месяц (формат: YYYY-MM)
      const [year, month] = createForm.selectedMonth.split('-').map(Number);
      const monthStart = getMonthStart(year, month - 1);
      const monthEnd = getMonthEnd(year, month - 1);
      
      const formattedStartDate = formatDateForAPI(monthStart);
      const formattedEndDate = formatDateForAPI(monthEnd);
      
      const requestBody = {
        name: createForm.name.trim(),
        head_id: createForm.head_id.trim(),
        head_username: createForm.head_username.trim() || '',
        comment: createForm.comment.trim() || '',
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        agents: createForm.agents.filter(agent => agent && agent.trim()).map(agent => agent.trim())
      };

      const response = await apiFetch('https://209.38.246.190/api/v1/group/qa/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'Неверные параметры запроса';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }
      
      Notify.success('Группа успешно создана');
      handleCloseCreateModal();
      
      // Обновляем данные, если они были загружены
      if (selectedMonth) {
        fetchData();
      }
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при создании группы';
      Notify.failure(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout>
      <PageContent>
        <HeaderSection theme={theme}>
          <Title theme={theme}>Groups QA</Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <FilterGroup>
              <FilterLabel theme={theme}>Месяц</FilterLabel>
              <FilterSelect
                theme={theme}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <ButtonsGroup>
              <CreateButton theme={theme} onClick={handleOpenCreateModal}>
                Create Group
              </CreateButton>
            </ButtonsGroup>
          </div>
        </HeaderSection>
        
        <ContentWrapper theme={theme}>
          {loading ? (
            <Loader />
          ) : error ? (
            <EmptyState theme={theme}>Ошибка: {error}</EmptyState>
          ) : data ? (
            <DataContainer>
              {renderGroups(data, theme, handleGroupClick, handleDeleteGroup)}
            </DataContainer>
          ) : (
            <EmptyState theme={theme}>Выберите месяц для загрузки данных</EmptyState>
          )}
        </ContentWrapper>
      </PageContent>

      {isCreateModalOpen && (
        <ModalOverlay onClick={handleCloseCreateModal}>
          <ModalContent theme={theme} $isCreateModal={true} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle theme={theme}>Create Group</ModalTitle>
              <CloseButton theme={theme} onClick={handleCloseCreateModal}>
                ×
              </CloseButton>
            </ModalHeader>

            <FormSection>
              <FormLabel theme={theme}>Name *</FormLabel>
              <FormInput
                theme={theme}
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Введите название группы"
              />
            </FormSection>

            <FormSection>
              <FormLabel theme={theme}>Head *</FormLabel>
              {isLoadingHeads ? (
                <FormInput
                  theme={theme}
                  type="text"
                  value="Загрузка..."
                  disabled
                />
              ) : (
                <FormSelect
                  theme={theme}
                  value={createForm.head_id}
                  onChange={(e) => {
                    const selectedHead = heads.find(head => {
                      // Если head - это объект с полем id
                      if (typeof head === 'object' && head !== null) {
                        return head.id === e.target.value || head.head_id === e.target.value || head.uuid === e.target.value;
                      }
                      // Если head - это строка (UUID)
                      return head === e.target.value;
                    });
                    
                    setCreateForm({
                      ...createForm,
                      head_id: e.target.value,
                      head_username: selectedHead ? (selectedHead.username || selectedHead.head_username || selectedHead.name || '') : ''
                    });
                  }}
                >
                  <option value="">Выберите руководителя</option>
                  {heads.map((head, index) => {
                    // Обрабатываем разные форматы данных
                    const headId = typeof head === 'object' && head !== null 
                      ? (head.id || head.head_id || head.uuid || '')
                      : head;
                    const headLabel = typeof head === 'object' && head !== null
                      ? (head.name || head.username || head.head_username || headId)
                      : headId;
                    
                    return (
                      <option key={headId || index} value={headId}>
                        {headLabel}
                      </option>
                    );
                  })}
                </FormSelect>
              )}
            </FormSection>

            <FormSection>
              <FormLabel theme={theme}>Comment</FormLabel>
              <FormTextarea
                theme={theme}
                value={createForm.comment}
                onChange={(e) => setCreateForm({ ...createForm, comment: e.target.value })}
                placeholder="Введите комментарий"
              />
            </FormSection>

            <FormSection>
              <FormLabel theme={theme}>Month *</FormLabel>
              <FormSelect
                theme={theme}
                value={createForm.selectedMonth}
                onChange={(e) => setCreateForm({ ...createForm, selectedMonth: e.target.value })}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </FormSelect>
            </FormSection>

            <ModalFooter>
              <CancelButton theme={theme} onClick={handleCloseCreateModal}>
                Отмена
              </CancelButton>
              <CreateSaveButton theme={theme} onClick={handleCreateGroup} disabled={isCreating}>
                {isCreating ? 'Создание...' : 'Создать'}
              </CreateSaveButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {isDetailsModalOpen && (
        <ModalOverlay onClick={handleCloseDetailsModal}>
          <ModalContent theme={theme} $isDetailsModal={true} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle theme={theme}>Group Details</ModalTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!isEditingDetails ? (
                  <EditButton theme={theme} onClick={handleEditDetails} title="Редактировать">
                    <HiPencil size={18} />
                  </EditButton>
                ) : (
                  <>
                    <SaveButton 
                      theme={theme} 
                      onClick={handleSaveDetails}
                      disabled={isSavingDetails}
                      title="Сохранить"
                    >
                      <HiCheck size={18} />
                    </SaveButton>
                    <CloseButton theme={theme} onClick={handleCancelEdit} title="Отменить редактирование">
                      ×
                    </CloseButton>
                  </>
                )}
                <CloseButton theme={theme} onClick={handleCloseDetailsModal}>
                  ×
                </CloseButton>
              </div>
            </ModalHeader>

            {isLoadingDetails ? (
              <Loader />
            ) : groupDetails ? (
              <div>
                {renderGroupDetails(
                  groupDetails, 
                  theme, 
                  isEditingDetails, 
                  editValues,
                  (key, value) => {
                    setEditValues(prev => ({ ...prev, [key]: value }));
                  },
                  heads,
                  handleOpenAgentModal,
                  handleRemoveAgentFromGroup
                )}
              </div>
            ) : (
              <EmptyState theme={theme}>Не удалось загрузить детали группы</EmptyState>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {isAgentModalOpen && (
        <ModalOverlay onClick={handleCloseAgentModal}>
          <ModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle theme={theme}>Выберите агента</ModalTitle>
              <CloseButton theme={theme} onClick={handleCloseAgentModal}>
                ×
              </CloseButton>
            </ModalHeader>

            {!isLoadingAgents && freeAgents.length > 0 && (
              <FormSection style={{ marginBottom: '16px' }}>
                <FormLabel theme={theme}>Поиск</FormLabel>
                <SearchInputWrapper theme={theme}>
                  <SearchIcon theme={theme}>
                    <HiMagnifyingGlass size={18} />
                  </SearchIcon>
                  <SearchInput
                    theme={theme}
                    type="text"
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    placeholder="Введите имя агента для поиска..."
                  />
                </SearchInputWrapper>
              </FormSection>
            )}

            {isLoadingAgents ? (
              <Loader />
            ) : (() => {
              const filteredAgents = freeAgents.filter(agent => {
                if (!agentFilter.trim()) return true;
                const agentName = typeof agent === 'object' && agent !== null
                  ? (agent.name || agent.username || agent.agent_name || agent.id || agent.uuid || '').toLowerCase()
                  : String(agent).toLowerCase();
                return agentName.includes(agentFilter.toLowerCase());
              });

              return filteredAgents.length > 0 ? (
                <AgentList theme={theme}>
                  {filteredAgents.map((agent, index) => {
                    const agentId = typeof agent === 'object' && agent !== null
                      ? (agent.id || agent.uuid || agent.agent_id || '')
                      : agent;
                    const agentName = typeof agent === 'object' && agent !== null
                      ? (agent.name || agent.username || agent.agent_name || agentId)
                      : agent;
                    
                    const isAdded = addedAgents.has(agentId);
                    
                    return (
                      <AgentItem key={index} theme={theme}>
                      <AgentItemContent theme={theme}>
                        <AgentItemName theme={theme}>{agentName}</AgentItemName>
                      </AgentItemContent>
                        {isAdded ? (
                          <AgentItemRemoveButton
                            theme={theme}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (agentId) {
                                handleRemoveAgentFromGroup(agentId, agentName);
                              }
                            }}
                            title="Удалить агента из группы"
                          >
                            <HiTrash size={18} />
                          </AgentItemRemoveButton>
                        ) : (
                          <AgentItemAddButton
                            theme={theme}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (agentId) {
                                handleAddAgentToGroup(agentId, agentName);
                              }
                            }}
                            title="Добавить агента в группу"
                          >
                            <HiPlus size={18} />
                          </AgentItemAddButton>
                        )}
                      </AgentItem>
                    );
                  })}
                </AgentList>
              ) : (
                <EmptyState theme={theme}>
                  {agentFilter.trim() ? 'Агенты не найдены' : 'Нет свободных агентов'}
                </EmptyState>
              );
            })()}
          </ModalContent>
        </ModalOverlay>
      )}

      {isAgentModalOpen && (
        <ModalOverlay onClick={handleCloseAgentModal}>
          <ModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle theme={theme}>Выберите агента</ModalTitle>
              <CloseButton theme={theme} onClick={handleCloseAgentModal}>
                ×
              </CloseButton>
            </ModalHeader>

            {!isLoadingAgents && freeAgents.length > 0 && (
              <FormSection style={{ marginBottom: '16px' }}>
                <FormLabel theme={theme}>Поиск</FormLabel>
                <SearchInputWrapper theme={theme}>
                  <SearchIcon theme={theme}>
                    <HiMagnifyingGlass size={18} />
                  </SearchIcon>
                  <SearchInput
                    theme={theme}
                    type="text"
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    placeholder="Введите имя агента для поиска..."
                  />
                </SearchInputWrapper>
              </FormSection>
            )}

            {isLoadingAgents ? (
              <Loader />
            ) : (() => {
              const filteredAgents = freeAgents.filter(agent => {
                if (!agentFilter.trim()) return true;
                const agentName = typeof agent === 'object' && agent !== null
                  ? (agent.name || agent.username || agent.agent_name || agent.id || agent.uuid || '').toLowerCase()
                  : String(agent).toLowerCase();
                return agentName.includes(agentFilter.toLowerCase());
              });

              return filteredAgents.length > 0 ? (
                <AgentList theme={theme}>
                  {filteredAgents.map((agent, index) => {
                    const agentId = typeof agent === 'object' && agent !== null
                      ? (agent.id || agent.uuid || agent.agent_id || '')
                      : agent;
                    const agentName = typeof agent === 'object' && agent !== null
                      ? (agent.name || agent.username || agent.agent_name || agentId)
                      : agent;
                    
                    const isAdded = addedAgents.has(agentId);
                    
                    return (
                      <AgentItem key={index} theme={theme}>
                      <AgentItemContent theme={theme}>
                        <AgentItemName theme={theme}>{agentName}</AgentItemName>
                      </AgentItemContent>
                        {isAdded ? (
                          <AgentItemRemoveButton
                            theme={theme}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (agentId) {
                                handleRemoveAgentFromGroup(agentId, agentName);
                              }
                            }}
                            title="Удалить агента из группы"
                          >
                            <HiTrash size={18} />
                          </AgentItemRemoveButton>
                        ) : (
                          <AgentItemAddButton
                            theme={theme}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (agentId) {
                                handleAddAgentToGroup(agentId, agentName);
                              }
                            }}
                            title="Добавить агента в группу"
                          >
                            <HiPlus size={18} />
                          </AgentItemAddButton>
                        )}
                      </AgentItem>
                    );
                  })}
                </AgentList>
              ) : (
                <EmptyState theme={theme}>
                  {agentFilter.trim() ? 'Агенты не найдены' : 'Нет свободных агентов'}
                </EmptyState>
              );
            })()}
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

