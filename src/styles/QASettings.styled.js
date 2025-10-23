import styled from 'styled-components';

// Agents Dashboard Styles
export const AgentsDashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const AgentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const AgentsTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AgentsTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
`;

export const AgentsSubtitle = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0;
`;

export const AgentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

export const AgentCard = styled.div`
  background: var(--color-bg);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export const AgentCardHeader = styled.div`
  padding: 16px 20px;
  background: var(--color-bg-panel);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AgentIcon = styled.div`
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const AgentInfo = styled.div`
  flex: 1;
`;

export const AgentName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 6px 0;
`;

export const AgentStatus = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 10px;
  display: inline-block;

  &.active {
    background: rgba(34, 197, 94, 0.1);
    color: rgba(34, 197, 94, 1);
    border: 1px solid rgba(34, 197, 94, 0.2);
  }

  &.inactive {
    background: rgba(107, 114, 128, 0.1);
    color: rgba(107, 114, 128, 1);
    border: 1px solid rgba(107, 114, 128, 0.2);
  }
`;

export const AgentActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const AgentActionBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-muted);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background: var(--color-bg);
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--color-text);
  }

  &.delete:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: rgba(239, 68, 68, 1);
  }
`;

export const AgentDetails = styled.div`
  padding: 16px 20px;
`;

export const AgentDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.span`
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  min-width: 60px;
`;

export const DetailValue = styled.span`
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 400;
  text-align: right;
  flex: 1;
`;

export const DetailId = styled.span`
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
`;

// Create Agent Button
export const CreateAgentBtn = styled.button`
  position: absolute;
  top: 32px;
  right: 32px;
  background: var(--color-bg-panel);
  color: var(--color-text);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: var(--color-bg);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

export const BtnIcon = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
`;

// Responsive styles
export const ResponsiveAgentsGrid = styled(AgentsGrid)`
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ResponsiveAgentCardHeader = styled(AgentCardHeader)`
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

export const ResponsiveAgentDetails = styled(AgentDetails)`
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

export const ResponsiveCreateAgentBtn = styled(CreateAgentBtn)`
  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }
`;

