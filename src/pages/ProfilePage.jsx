import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { DatePicker } from '../components/DatePicker';
import { apiFetch } from '../utils/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { HiUserCircle, HiEnvelope, HiShieldCheck, HiBuildingOffice2, HiUser, HiCheck, HiXMark, HiPencil } from 'react-icons/hi2';

const PageContent = styled.div`
  padding: 32px;
  max-width: 920px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const PageTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)')};
  }
`;

const HeaderCard = styled.div`
  position: relative;
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D'
      ? 'linear-gradient(135deg, #E8F5F1 0%, #D4EDE5 50%, #B8E0D2 100%)'
      : 'linear-gradient(135deg, #1A1A1A 0%, #152520 50%, #0D1412 100%)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D'
      ? '0 2px 12px rgba(16, 163, 127, 0.08)'
      : '0 2px 12px rgba(0, 0, 0, 0.3)'};
`;

const AvatarWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 32px;
  font-weight: 600;
`;

const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.h1`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const UserMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)')};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActiveStatus = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? 'rgba(22, 163, 74, 0.2)' : 'rgba(239, 68, 68, 0.2)')};
  color: ${({ $active }) => ($active ? '#16a34a' : '#ef4444')};
  border: 2px solid ${({ $active }) => ($active ? '#16a34a' : '#ef4444')};
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const InfoCard = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'};
  }
`;

const InfoCardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)')};
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 20px;
`;

const InfoCardLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const InfoCardValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.4;
  word-break: break-word;
`;

const ExtraCard = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 24px;
`;

const ExtraHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ExtraTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ExtraEditButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')};
  }
`;

const ExtraRow = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
  font-size: 14px;
  gap: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExtraLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  min-width: 120px;
  flex-shrink: 0;
`;

const ExtraValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
`;

const ExtraGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px 24px;
`;

const ExtraField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExtraFieldLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ExtraFieldValue = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
`;

const ExtraInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const PaymentsCard = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaymentsHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const PaymentsTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const PaymentsEditButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const PaymentTypeButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const PaymentTypeButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)')};
  }
`;

const PaymentsFormActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaymentSection = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const PaymentSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaymentItem = styled.div`
  padding: 12px;
  background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')};
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const AddPaymentButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  margin-top: 6px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const RemoveItemButton = styled.button`
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    color: #ef4444;
    border-color: #ef4444;
  }
`;

const PaymentsSection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PaymentsSectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

const PaymentRecordCard = styled.div`
  padding: 12px 14px;
  background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)')};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PaymentRecordRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PaymentRecordLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  flex-shrink: 0;
  min-width: 100px;
`;

const PaymentRecordValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  word-break: break-word;
`;

const PaymentsList = styled.ul`
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.5;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  box-sizing: border-box;
`;

const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const PaymentModalBox = styled(ModalBox)`
  max-width: 520px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ModalClose = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const EditRow = styled.div`
  margin-bottom: 16px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const EditLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const EditInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
    opacity: 0.7;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const SaveBtn = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelBtn = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')};
  }
`;

const ErrorBlock = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
  font-size: 13px;
`;

const formatValue = (v) => {
  if (v == null) return '—';
  if (typeof v === 'string' && v.trim() === '') return '—';
  if (typeof v === 'boolean') return v ? 'Да' : 'Нет';
  if (typeof v === 'object') return JSON.stringify(v, null, 2);
  return String(v);
};

const mainFieldsConfig = [
  { key: 'username', label: 'Имя пользователя', Icon: HiUser },
  { key: 'email', label: 'Email', Icon: HiEnvelope },
  { key: 'role', label: 'Роль', Icon: HiShieldCheck },
  { key: 'department', label: 'Отдел', Icon: HiBuildingOffice2 },
];

const additionalFieldsConfig = [
  { key: 'first_name', label: 'Имя' },
  { key: 'last_name', label: 'Фамилия' },
  { key: 'country', label: 'Страна' },
  { key: 'city', label: 'Город' },
  { key: 'phone_number', label: 'Телефон' },
  { key: 'additional_number', label: 'Доп. телефон' },
  { key: 'working_telegram', label: 'Рабочий Telegram' },
  { key: 'personal_telegram', label: 'Личный Telegram' },
  { key: 'birthday', label: 'День рождения' },
  { key: 'emergency_contact', label: 'Контакт для экстренной связи' },
];

const PROFILE_ME_URL = '/api/v1/profile/user/me';
const PAYMENT_URL = '/api/v1/profile/user/me/payment';

const emptyCrypto = () => ({ method: 'crypto', address: '', currency: '', network: '', exchange: '' });
const emptyCard = () => ({ method: 'card', card_number: '', bank: '' });
const emptySwift = () => ({
  method: 'swift',
  full_name: '',
  iban: '',
  swift_code: '',
  address: '',
  card_number: null,
  bank: '',
  currency: '',
  bank_account: '',
});

const paymentRecordRows = (item, type) => {
  if (!item || typeof item !== 'object') return [];
  const format = (v) => (v == null || v === '' ? null : String(v));
  if (type === 'crypto') {
    return [
      { label: 'Address', value: format(item.address) },
      { label: 'Currency', value: format(item.currency) },
      { label: 'Network', value: format(item.network) },
      { label: 'Exchange', value: format(item.exchange) },
    ].filter((r) => r.value != null);
  }
  if (type === 'card') {
    return [
      { label: 'Номер карты', value: format(item.card_number) },
      { label: 'Банк', value: format(item.bank) },
    ].filter((r) => r.value != null);
  }
  if (type === 'swift') {
    return [
      { label: 'Full name', value: format(item.full_name) },
      { label: 'IBAN', value: format(item.iban) },
      { label: 'SWIFT code', value: format(item.swift_code) },
      { label: 'Address', value: format(item.address) },
      { label: 'Номер карты', value: format(item.card_number) },
      { label: 'Bank', value: format(item.bank) },
      { label: 'Currency', value: format(item.currency) },
      { label: 'Bank account', value: format(item.bank_account) },
    ].filter((r) => r.value != null);
  }
  return [];
};

export const ProfilePage = () => {
  const { theme } = useTheme();
  const { profile, loadProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [isEditingAdditional, setIsEditingAdditional] = useState(false);
  const [isSavingAdditional, setIsSavingAdditional] = useState(false);
  const [isEditingPayments, setIsEditingPayments] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [newPaymentItem, setNewPaymentItem] = useState(null);
  const [paymentsForm, setPaymentsForm] = useState({ crypto: [], card: [], swift: [] });
  const [isSavingPayments, setIsSavingPayments] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);
  const [additionalForm, setAdditionalForm] = useState({
    first_name: '',
    last_name: '',
    country: '',
    city: '',
    phone_number: '',
    additional_number: '',
    working_telegram: '',
    personal_telegram: '',
    birthday: '',
    emergency_contact: '',
  });

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile && isEditing) {
      setEditForm({
        email: profile.email ?? '',
        password: '',
        username: profile.username ?? '',
      });
    }
  }, [profile, isEditing]);

  const handleSaveEdit = async () => {
    if (!profile) return;
    const prevUsername = profile.username ?? '';
    const prevEmail = profile.email ?? '';
    const body = {};
    if ((editForm.username ?? '') !== prevUsername) body.username = editForm.username ?? '';
    if ((editForm.email ?? '') !== prevEmail) body.email = editForm.email ?? '';
    if ((editForm.password ?? '').trim() !== '') body.password = editForm.password.trim();
    if (Object.keys(body).length === 0) {
      Notify.info('Нет изменений для сохранения');
      return;
    }
    setIsSaving(true);
    try {
      const response = await apiFetch(PROFILE_ME_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        let msg = `Ошибка ${response.status}`;
        if (Array.isArray(err.detail) && err.detail.length) {
          msg = err.detail.map((d) => d.msg || d.message).filter(Boolean).join('. ') || msg;
        } else if (err.detail && typeof err.detail === 'string') {
          msg = err.detail;
        } else if (err.message) {
          msg = err.message;
        }
        throw new Error(msg);
      }
      await loadProfile();
      setIsEditing(false);
      setEditForm((prev) => ({ ...prev, password: '' }));
      Notify.success('Профиль обновлён');
    } catch (e) {
      Notify.failure(e.message || 'Не удалось обновить профиль');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ email: '', password: '', username: '' });
  };

  const handleSaveAdditional = async () => {
    setIsSavingAdditional(true);
    try {
      const body = {
        first_name: additionalForm.first_name ?? '',
        last_name: additionalForm.last_name ?? '',
        country: additionalForm.country ?? '',
        city: additionalForm.city ?? '',
        phone_number: additionalForm.phone_number ?? '',
        additional_number: additionalForm.additional_number ?? '',
        working_telegram: additionalForm.working_telegram ?? '',
        personal_telegram: additionalForm.personal_telegram ?? '',
        birthday: additionalForm.birthday ? additionalForm.birthday : '',
        emergency_contact: additionalForm.emergency_contact ?? '',
      };
      const response = await apiFetch(PROFILE_ME_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        let msg = `Ошибка ${response.status}`;
        if (Array.isArray(err.detail) && err.detail.length) {
          msg = err.detail.map((d) => d.msg || d.message).filter(Boolean).join('. ') || msg;
        } else if (err.detail && typeof err.detail === 'string') {
          msg = err.detail;
        } else if (err.message) {
          msg = err.message;
        }
        throw new Error(msg);
      }
      await loadProfile();
      setIsEditingAdditional(false);
      Notify.success('Дополнительные данные обновлены');
    } catch (e) {
      Notify.failure(e.message || 'Не удалось сохранить');
    } finally {
      setIsSavingAdditional(false);
    }
  };

  const handleCancelAdditional = () => {
    setIsEditingAdditional(false);
  };

  const openPaymentsEdit = () => {
    const p = profile?.payments;
    setPaymentsForm({
      crypto: Array.isArray(p?.crypto) ? p.crypto.map((x) => ({ ...emptyCrypto(), ...x })) : [],
      card: Array.isArray(p?.card) ? p.card.map((x) => ({ ...emptyCard(), ...x })) : [],
      swift: Array.isArray(p?.swift) ? p.swift.map((x) => ({ ...emptySwift(), ...x })) : [],
    });
    setSelectedPaymentType(null);
    setNewPaymentItem(null);
    setPaymentsError(null);
    setIsEditingPayments(true);
  };

  const selectPaymentType = (type) => {
    setSelectedPaymentType(type);
    setPaymentsError(null);
    if (type === 'crypto') setNewPaymentItem(emptyCrypto());
    else if (type === 'card') setNewPaymentItem(emptyCard());
    else if (type === 'swift') setNewPaymentItem(emptySwift());
  };

  const handleSavePayments = async () => {
    if (!newPaymentItem) return;
    setIsSavingPayments(true);
    setPaymentsError(null);
    try {
      let body;
      if (selectedPaymentType === 'crypto') {
        body = {
          method: 'crypto',
          address: newPaymentItem.address || '',
          currency: newPaymentItem.currency || '',
          network: newPaymentItem.network || '',
          exchange: newPaymentItem.exchange || '',
        };
      } else if (selectedPaymentType === 'card') {
        body = {
          method: 'card',
          card_number: newPaymentItem.card_number || '',
          bank: newPaymentItem.bank || '',
        };
      } else if (selectedPaymentType === 'swift') {
        body = {
          method: 'swift',
          full_name: newPaymentItem.full_name || '',
          iban: newPaymentItem.iban || '',
          swift_code: newPaymentItem.swift_code || '',
          address: newPaymentItem.address || '',
          card_number: newPaymentItem.card_number || null,
          bank: newPaymentItem.bank || '',
          currency: newPaymentItem.currency || '',
          bank_account: newPaymentItem.bank_account || '',
        };
      } else {
        return;
      }
      const response = await apiFetch(PAYMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = Array.isArray(err.detail) && err.detail.length
          ? err.detail.map((d) => d.msg || d.message).filter(Boolean).join('. ')
          : err.detail || err.message || `Ошибка ${response.status}`;
        setPaymentsError(msg);
        return;
      }
      await loadProfile();
      setSelectedPaymentType(null);
      setNewPaymentItem(null);
      Notify.success('Платёжные данные обновлены');
    } catch (e) {
      setPaymentsError(e.message || 'Не удалось сохранить');
    } finally {
      setIsSavingPayments(false);
    }
  };

  const updateNewPaymentField = (field, value) => {
    setNewPaymentItem((prev) => (prev ? { ...prev, [field]: value === '' ? null : value } : null));
  };

  if (!profile) {
    return (
      <Layout>
        <PageContent theme={theme}>
          <Loader />
        </PageContent>
      </Layout>
    );
  }

  const displayName = profile.username || profile.email || 'Пользователь';
  const mainCards = mainFieldsConfig.filter(
    (c) => profile[c.key] !== undefined && profile[c.key] !== null
  );
  const payments = profile.payments && typeof profile.payments === 'object' ? profile.payments : null;

  return (
    <Layout>
      <PageContent theme={theme}>
        <PageHeader theme={theme}>
          <PageTitle theme={theme}>Профиль</PageTitle>
          <EditButton theme={theme} onClick={() => setIsEditing(true)} title="Редактировать профиль">
            <HiPencil size={18} strokeWidth={2} />
            Редактировать
          </EditButton>
        </PageHeader>

        <HeaderCard theme={theme}>
          <AvatarWrap theme={theme}>
            <HiUserCircle size={48} style={{ opacity: 0.9 }} />
          </AvatarWrap>
          <HeaderInfo>
            <UserName theme={theme}>{displayName}</UserName>
            {profile.email && (
              <InfoCardValue theme={theme} style={{ fontSize: 14, fontWeight: 400, marginTop: 4 }}>
                {profile.email}
              </InfoCardValue>
            )}
            <UserMeta>
              {profile.role && (
                <Badge theme={theme}>{profile.role}</Badge>
              )}
              {profile.department && (
                <Badge theme={theme}>{profile.department}</Badge>
              )}
            </UserMeta>
          </HeaderInfo>
          {profile.is_active !== undefined && profile.is_active !== null && (
            <ActiveStatus $active={profile.is_active === true || profile.is_active === 'true'} title={profile.is_active ? 'Активен' : 'Не активен'}>
              {profile.is_active === true || profile.is_active === 'true' ? (
                <HiCheck size={24} strokeWidth={2.5} />
              ) : (
                <HiXMark size={24} strokeWidth={2.5} />
              )}
            </ActiveStatus>
          )}
        </HeaderCard>

        {isEditing && (
          <ModalOverlay onClick={handleCancelEdit}>
            <ModalBox theme={theme} onClick={(e) => e.stopPropagation()}>
              <ModalHeader theme={theme}>
                <ModalTitle theme={theme}>Редактирование профиля</ModalTitle>
                <ModalClose theme={theme} onClick={handleCancelEdit} aria-label="Закрыть">
                  ×
                </ModalClose>
              </ModalHeader>
              <ModalBody theme={theme}>
                <EditRow>
                  <EditLabel theme={theme}>Имя пользователя</EditLabel>
                  <EditInput
                    theme={theme}
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Username"
                  />
                </EditRow>
                <EditRow>
                  <EditLabel theme={theme}>Email</EditLabel>
                  <EditInput
                    theme={theme}
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </EditRow>
                <EditRow>
                  <EditLabel theme={theme}>Новый пароль</EditLabel>
                  <EditInput
                    theme={theme}
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Оставьте пустым, чтобы не менять"
                    autoComplete="new-password"
                  />
                </EditRow>
                <EditActions>
                  <SaveBtn theme={theme} onClick={handleSaveEdit} disabled={isSaving}>
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </SaveBtn>
                  <CancelBtn theme={theme} onClick={handleCancelEdit} disabled={isSaving}>
                    Отмена
                  </CancelBtn>
                </EditActions>
              </ModalBody>
            </ModalBox>
          </ModalOverlay>
        )}

        <SectionTitle theme={theme}>Основная информация</SectionTitle>
        <InfoGrid>
          {mainCards.map(({ key, label, Icon }) => (
            <InfoCard key={key} theme={theme}>
              <InfoCardIcon theme={theme}>
                <Icon size={22} />
              </InfoCardIcon>
              <InfoCardLabel theme={theme}>{label}</InfoCardLabel>
              <InfoCardValue theme={theme}>{formatValue(profile[key])}</InfoCardValue>
            </InfoCard>
          ))}
        </InfoGrid>

        <ExtraCard theme={theme}>
            <ExtraHeaderRow theme={theme}>
              <ExtraTitle theme={theme}>Дополнительно</ExtraTitle>
              {isEditingAdditional ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ExtraEditButton theme={theme} type="button" onClick={handleCancelAdditional} title="Отмена">
                    <HiXMark size={18} strokeWidth={2} />
                  </ExtraEditButton>
                  <ExtraEditButton theme={theme} type="button" onClick={handleSaveAdditional} disabled={isSavingAdditional} title="Сохранить">
                    <HiCheck size={18} strokeWidth={2} />
                  </ExtraEditButton>
                </div>
              ) : (
                <ExtraEditButton theme={theme} type="button" onClick={() => { setIsEditingAdditional(true); setAdditionalForm({ first_name: profile.first_name ?? '', last_name: profile.last_name ?? '', country: profile.country ?? '', city: profile.city ?? '', phone_number: profile.phone_number ?? '', additional_number: profile.additional_number ?? '', working_telegram: profile.working_telegram ?? '', personal_telegram: profile.personal_telegram ?? '', birthday: profile.birthday ? (typeof profile.birthday === 'string' && profile.birthday.length >= 10 ? profile.birthday.slice(0, 10) : profile.birthday) : '', emergency_contact: profile.emergency_contact ?? '' }); }} title="Редактировать">
                  <HiPencil size={18} strokeWidth={2} />
                </ExtraEditButton>
              )}
            </ExtraHeaderRow>
            <ExtraGrid>
              {additionalFieldsConfig.map(({ key, label }) => (
                <ExtraField key={key}>
                  <ExtraFieldLabel theme={theme}>{label}</ExtraFieldLabel>
                  {isEditingAdditional ? (
                    key === 'birthday' ? (
                      <DatePicker
                        value={additionalForm.birthday || ''}
                        onChange={(e) => setAdditionalForm((prev) => ({ ...prev, birthday: e.target.value }))}
                      />
                    ) : (
                      <ExtraInput
                        theme={theme}
                        type="text"
                        value={additionalForm[key] ?? ''}
                        onChange={(e) => setAdditionalForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      />
                    )
                  ) : (
                    <ExtraFieldValue theme={theme}>{formatValue(profile[key])}</ExtraFieldValue>
                  )}
                </ExtraField>
              ))}
            </ExtraGrid>
            {(payments || true) && (
              <PaymentsCard theme={theme}>
                <PaymentsHeaderRow theme={theme}>
                  <PaymentsTitle theme={theme}>Платёжные данные (payments)</PaymentsTitle>
                  {!isEditingPayments && (
                    <PaymentsEditButton theme={theme} type="button" onClick={openPaymentsEdit} title="Редактировать">
                      <HiPencil size={16} strokeWidth={2} />
                    </PaymentsEditButton>
                  )}
                </PaymentsHeaderRow>

                {!isEditingPayments && (
                  <>
                    {Array.isArray(payments?.crypto) && payments.crypto.length > 0 && (
                      <PaymentsSection>
                        <PaymentsSectionLabel theme={theme}>Crypto</PaymentsSectionLabel>
                        {payments.crypto.map((item, i) => (
                          <PaymentRecordCard key={i} theme={theme}>
                            {paymentRecordRows(item, 'crypto').map((row, j) => (
                              <PaymentRecordRow key={j} theme={theme}>
                                <PaymentRecordLabel theme={theme}>{row.label}</PaymentRecordLabel>
                                <PaymentRecordValue theme={theme}>{row.value}</PaymentRecordValue>
                              </PaymentRecordRow>
                            ))}
                          </PaymentRecordCard>
                        ))}
                      </PaymentsSection>
                    )}
                    {Array.isArray(payments?.card) && payments.card.length > 0 && (
                      <PaymentsSection>
                        <PaymentsSectionLabel theme={theme}>Card</PaymentsSectionLabel>
                        {payments.card.map((item, i) => (
                          <PaymentRecordCard key={i} theme={theme}>
                            {paymentRecordRows(item, 'card').map((row, j) => (
                              <PaymentRecordRow key={j} theme={theme}>
                                <PaymentRecordLabel theme={theme}>{row.label}</PaymentRecordLabel>
                                <PaymentRecordValue theme={theme}>{row.value}</PaymentRecordValue>
                              </PaymentRecordRow>
                            ))}
                          </PaymentRecordCard>
                        ))}
                      </PaymentsSection>
                    )}
                    {Array.isArray(payments?.swift) && payments.swift.length > 0 && (
                      <PaymentsSection>
                        <PaymentsSectionLabel theme={theme}>SWIFT</PaymentsSectionLabel>
                        {payments.swift.map((item, i) => (
                          <PaymentRecordCard key={i} theme={theme}>
                            {paymentRecordRows(item, 'swift').map((row, j) => (
                              <PaymentRecordRow key={j} theme={theme}>
                                <PaymentRecordLabel theme={theme}>{row.label}</PaymentRecordLabel>
                                <PaymentRecordValue theme={theme}>{row.value}</PaymentRecordValue>
                              </PaymentRecordRow>
                            ))}
                          </PaymentRecordCard>
                        ))}
                      </PaymentsSection>
                    )}
                    {(!payments || (!payments.crypto?.length && !payments.card?.length && !payments.swift?.length)) && (
                      <ExtraFieldValue theme={theme} style={{ marginTop: 4 }}>Нет платёжных данных</ExtraFieldValue>
                    )}
                  </>
                )}

                {isEditingPayments && !selectedPaymentType && (
                  <>
                    <PaymentTypeButtons theme={theme}>
                      <PaymentTypeButton theme={theme} type="button" onClick={() => selectPaymentType('crypto')}>Crypto</PaymentTypeButton>
                      <PaymentTypeButton theme={theme} type="button" onClick={() => selectPaymentType('card')}>Card</PaymentTypeButton>
                      <PaymentTypeButton theme={theme} type="button" onClick={() => selectPaymentType('swift')}>SWIFT</PaymentTypeButton>
                    </PaymentTypeButtons>
                    <PaymentsFormActions theme={theme}>
                      <CancelBtn theme={theme} type="button" onClick={() => setIsEditingPayments(false)}>Назад</CancelBtn>
                    </PaymentsFormActions>
                  </>
                )}

                {isEditingPayments && selectedPaymentType === 'crypto' && newPaymentItem && (
                  <>
                    {paymentsError && (
                      <ErrorBlock theme={theme} style={{ marginBottom: 12 }}>{paymentsError}</ErrorBlock>
                    )}
                    <ExtraGrid theme={theme}>
                      <ExtraField><ExtraFieldLabel theme={theme}>Address</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.address || ''} onChange={(e) => updateNewPaymentField('address', e.target.value)} placeholder="0x123abc..." /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Currency</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.currency || ''} onChange={(e) => updateNewPaymentField('currency', e.target.value)} placeholder="USDT" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Network</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.network || ''} onChange={(e) => updateNewPaymentField('network', e.target.value)} placeholder="TRC20" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Exchange</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.exchange || ''} onChange={(e) => updateNewPaymentField('exchange', e.target.value)} placeholder="Binance" /></ExtraField>
                    </ExtraGrid>
                    <PaymentsFormActions theme={theme}>
                      <CancelBtn theme={theme} type="button" onClick={() => { setSelectedPaymentType(null); setNewPaymentItem(null); setPaymentsError(null); }} disabled={isSavingPayments}>Назад</CancelBtn>
                      <SaveBtn theme={theme} type="button" onClick={handleSavePayments} disabled={isSavingPayments}>{isSavingPayments ? 'Сохранение…' : 'Сохранить'}</SaveBtn>
                    </PaymentsFormActions>
                  </>
                )}

                {isEditingPayments && selectedPaymentType === 'card' && newPaymentItem && (
                  <>
                    {paymentsError && (
                      <ErrorBlock theme={theme} style={{ marginBottom: 12 }}>{paymentsError}</ErrorBlock>
                    )}
                    <ExtraGrid theme={theme}>
                      <ExtraField><ExtraFieldLabel theme={theme}>Номер карты</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.card_number || ''} onChange={(e) => updateNewPaymentField('card_number', e.target.value)} placeholder="4444333322221111" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Банк</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.bank || ''} onChange={(e) => updateNewPaymentField('bank', e.target.value)} placeholder="PrivatBank" /></ExtraField>
                    </ExtraGrid>
                    <PaymentsFormActions theme={theme}>
                      <CancelBtn theme={theme} type="button" onClick={() => { setSelectedPaymentType(null); setNewPaymentItem(null); setPaymentsError(null); }} disabled={isSavingPayments}>Назад</CancelBtn>
                      <SaveBtn theme={theme} type="button" onClick={handleSavePayments} disabled={isSavingPayments}>{isSavingPayments ? 'Сохранение…' : 'Сохранить'}</SaveBtn>
                    </PaymentsFormActions>
                  </>
                )}

                {isEditingPayments && selectedPaymentType === 'swift' && newPaymentItem && (
                  <>
                    {paymentsError && (
                      <ErrorBlock theme={theme} style={{ marginBottom: 12 }}>{paymentsError}</ErrorBlock>
                    )}
                    <ExtraGrid theme={theme}>
                      <ExtraField><ExtraFieldLabel theme={theme}>Full name</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.full_name || ''} onChange={(e) => updateNewPaymentField('full_name', e.target.value)} placeholder="John Smith" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>IBAN</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.iban || ''} onChange={(e) => updateNewPaymentField('iban', e.target.value)} placeholder="DE89..." /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>SWIFT code</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.swift_code || ''} onChange={(e) => updateNewPaymentField('swift_code', e.target.value)} placeholder="DEUTDEFF" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Address</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.address || ''} onChange={(e) => updateNewPaymentField('address', e.target.value)} placeholder="Berlin, Germany" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Номер карты (опц.)</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.card_number || ''} onChange={(e) => updateNewPaymentField('card_number', e.target.value)} placeholder="опционально" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Bank</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.bank || ''} onChange={(e) => updateNewPaymentField('bank', e.target.value)} placeholder="Deutsche Bank" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Currency</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.currency || ''} onChange={(e) => updateNewPaymentField('currency', e.target.value)} placeholder="EUR" /></ExtraField>
                      <ExtraField><ExtraFieldLabel theme={theme}>Bank account</ExtraFieldLabel><ExtraInput theme={theme} value={newPaymentItem.bank_account || ''} onChange={(e) => updateNewPaymentField('bank_account', e.target.value)} placeholder="1234567890" /></ExtraField>
                    </ExtraGrid>
                    <PaymentsFormActions theme={theme}>
                      <CancelBtn theme={theme} type="button" onClick={() => { setSelectedPaymentType(null); setNewPaymentItem(null); setPaymentsError(null); }} disabled={isSavingPayments}>Назад</CancelBtn>
                      <SaveBtn theme={theme} type="button" onClick={handleSavePayments} disabled={isSavingPayments}>{isSavingPayments ? 'Сохранение…' : 'Сохранить'}</SaveBtn>
                    </PaymentsFormActions>
                  </>
                )}
              </PaymentsCard>
            )}
        </ExtraCard>

      </PageContent>
    </Layout>
  );
};
