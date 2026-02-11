import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
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

const ExtraTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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

const formatValue = (v) => {
  if (v == null) return '—';
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

const PROFILE_ME_URL = '/api/v1/profile/user/me';

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
  const otherEntries = Object.entries(profile).filter(
    ([key]) => !mainFieldsConfig.some((c) => c.key === key) && key !== 'is_active' && key !== 'id'
  );

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

        {otherEntries.length > 0 && (
          <ExtraCard theme={theme}>
            <ExtraTitle theme={theme}>Дополнительно</ExtraTitle>
            {otherEntries.map(([key, value]) => (
              <ExtraRow key={key} theme={theme}>
                <ExtraLabel theme={theme}>{key}</ExtraLabel>
                <ExtraValue theme={theme}>{formatValue(value)}</ExtraValue>
              </ExtraRow>
            ))}
          </ExtraCard>
        )}
      </PageContent>
    </Layout>
  );
};
