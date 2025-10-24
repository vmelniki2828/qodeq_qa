import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
import { FiEdit3 } from 'react-icons/fi';
import './QASettings.css';

export const QASettings = () => {
  const location = useLocation();
  const [settingsData, setSettingsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Определяем активную вкладку на основе роута
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path === '/qa_settings') return 'main';
    if (path === '/qa_settings/integrations') return 'integrations';
    if (path === '/qa_settings/projects') return 'projects';
    if (path === '/qa_settings/agents') return 'agents';
    if (path === '/qa_settings/tags') return 'tags';
    return 'main';
  });
  
  // Состояния для проектов
  const [projectsData, setProjectsData] = useState(null);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  
  // Состояния для агентов
  const [agentsData, setAgentsData] = useState(null);
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);
  const [agentsError, setAgentsError] = useState('');
  
  // Состояния для интеграций
  const [integrationsData, setIntegrationsData] = useState(null);
  const [isIntegrationsLoading, setIsIntegrationsLoading] = useState(false);
  const [integrationsError, setIntegrationsError] = useState('');
  
  // Состояния для сайдбара создания интеграции
  const [isCreateIntegrationSidebarOpen, setIsCreateIntegrationSidebarOpen] = useState(false);
  const [isCreatingIntegration, setIsCreatingIntegration] = useState(false);
  const [integrationFormData, setIntegrationFormData] = useState({
    name: '',
    type: 'livechat',
    username: '',
    secret_key: ''
  });
  
  // Состояния для редактирования интеграции
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [isEditIntegrationModalOpen, setIsEditIntegrationModalOpen] = useState(false);
  
  // Состояние для выбранного языка
  const [selectedLanguage, setSelectedLanguage] = useState('RU');
  const [isLanguageSwitcherVisible, setIsLanguageSwitcherVisible] = useState(false);
  const [promptsData, setPromptsData] = useState(null);
  const [isPromptsLoading, setIsPromptsLoading] = useState(false);
  const [promptsError, setPromptsError] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isUpdatingPrompt, setIsUpdatingPrompt] = useState(false);
  const [isUpdatingIntegration, setIsUpdatingIntegration] = useState(false);
  const [isDeletingIntegration, setIsDeletingIntegration] = useState(false);
  
  // Состояния для тегов
  const [tagsData, setTagsData] = useState(null);
  const [isTagsLoading, setIsTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [editingPenalty, setEditingPenalty] = useState(null);
  const [isUpdatingPenalty, setIsUpdatingPenalty] = useState(false);
  
  // Состояния для сайдбара создания проекта
  const [isCreateProjectSidebarOpen, setIsCreateProjectSidebarOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    code: '',
    url: '',
    integration_id: '',
    is_active: true
  });
  
  // Состояния для модального окна создания группы
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    is_active: true,
    url: '',
    code: ''
  });
  
  // Состояния для сайдбара создания агента
  const [isCreateAgentSidebarOpen, setIsCreateAgentSidebarOpen] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [agentFormData, setAgentFormData] = useState({
    name: '',
    username: '',
    type: 'customer',
    lcid: '',
    is_active: true
  });
  
  // Состояния для редактирования агента
  const [editingAgent, setEditingAgent] = useState(null);
  const [isEditAgentModalOpen, setIsEditAgentModalOpen] = useState(false);
  const [isUpdatingAgent, setIsUpdatingAgent] = useState(false);
  const [isDeletingAgent, setIsDeletingAgent] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('http://185.138.164.88/api/v1/settings/main/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSettingsData(data);
      } catch (err) {
        console.error('Ошибка загрузки настроек:', err);
        setError('Ошибка загрузки данных настроек');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Обновляем активную вкладку при изменении роута
  useEffect(() => {
    const path = location.pathname;
    let newTab = 'main';
    if (path === '/qa_settings') newTab = 'main';
    else if (path === '/qa_settings/integrations') newTab = 'integrations';
    else if (path === '/qa_settings/projects') newTab = 'projects';
    else if (path === '/qa_settings/agents') newTab = 'agents';
    else if (path === '/qa_settings/tags') newTab = 'tags';
    
    setActiveTab(newTab);
    
    // Закрываем все сайдбары при переходе между блоками
    setIsCreateIntegrationSidebarOpen(false);
    setIsEditIntegrationModalOpen(false);
    setIsCreateProjectSidebarOpen(false);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsCreateAgentSidebarOpen(false);
    // setIsCreateAgentModalOpen(false); // Удалено - используем сайдбар
    setIsEditAgentModalOpen(false);
  }, [location.pathname]);

  // Автоматическая загрузка данных при переключении вкладок
  useEffect(() => {
    if (activeTab === 'projects' && !projectsData && !isProjectsLoading) {
      fetchProjects();
    }
    if (activeTab === 'agents' && !agentsData && !isAgentsLoading) {
      fetchAgents();
    }
    if (activeTab === 'integrations' && !integrationsData && !isIntegrationsLoading) {
      fetchIntegrations();
    }
    if (activeTab === 'tags' && !tagsData && !isTagsLoading) {
      fetchTags();
    }
  }, [activeTab, projectsData, isProjectsLoading, agentsData, isAgentsLoading, integrationsData, isIntegrationsLoading, tagsData, isTagsLoading]);

  // Функция для загрузки проектов
  const fetchProjects = async () => {
    try {
      setIsProjectsLoading(true);
      setProjectsError('');

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
      setProjectsData(data);
    } catch (err) {
      console.error('Ошибка загрузки проектов:', err);
      setProjectsError('Ошибка загрузки данных проектов');
    } finally {
      setIsProjectsLoading(false);
    }
  };

  // Функция для загрузки агентов
  const fetchAgents = async () => {
    try {
      setIsAgentsLoading(true);
      setAgentsError('');

      const response = await fetch('http://185.138.164.88/api/v1/settings/agent/?skip=0&limit=100', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAgentsData(data);
    } catch (err) {
      console.error('Ошибка загрузки агентов:', err);
      setAgentsError('Ошибка загрузки данных агентов');
    } finally {
      setIsAgentsLoading(false);
    }
  };

  // Функция для загрузки интеграций
  const fetchIntegrations = async () => {
    try {
      setIsIntegrationsLoading(true);
      setIntegrationsError('');

      const response = await fetch('http://185.138.164.88/api/v1/settings/integrations/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIntegrationsData(data);
    } catch (err) {
      console.error('Ошибка загрузки интеграций:', err);
      setIntegrationsError('Ошибка загрузки данных интеграций');
    } finally {
      setIsIntegrationsLoading(false);
    }
  };

  // Функция для загрузки промптов
  const fetchPrompts = async (language) => {
    try {
      setIsPromptsLoading(true);
      setPromptsError('');

      // Преобразуем язык в формат API
      const languageMap = {
        'RU': 'russian',
        'EN': 'english', 
        'TR': 'turkish'
      };

      const apiLanguage = languageMap[language] || 'russian';

      const response = await fetch(`http://185.138.164.88/api/v1/settings/main/prompts?language=${apiLanguage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPromptsData(data);
    } catch (err) {
      console.error('Ошибка загрузки промптов:', err);
      setPromptsError('Ошибка загрузки данных промптов');
    } finally {
      setIsPromptsLoading(false);
    }
  };

  // Функция для обновления промпта
  const updatePrompt = async (promptId) => {
    try {
      setIsUpdatingPrompt(true);

      const response = await fetch('http://185.138.164.88/api/v1/settings/main/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt_version_id: promptId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // После успешного обновления выходим из режима редактирования
      setIsEditingMode(false);
      setIsLanguageSwitcherVisible(false);
      
      console.log('Промпт успешно обновлен:', promptId);
    } catch (err) {
      console.error('Ошибка обновления промпта:', err);
      alert('Ошибка обновления промпта');
    } finally {
      setIsUpdatingPrompt(false);
    }
  };

  // Функция для загрузки тегов
  const fetchTags = async () => {
    try {
      setIsTagsLoading(true);
      setTagsError('');

      const response = await fetch('http://185.138.164.88/api/v1/settings/tags/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTagsData(data);
    } catch (err) {
      console.error('Ошибка загрузки тегов:', err);
      setTagsError('Ошибка загрузки данных тегов');
    } finally {
      setIsTagsLoading(false);
    }
  };

  const toggleGroupExpansion = (groupIndex) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupIndex]: !prev[groupIndex]
    }));
  };

  const handlePenaltyClick = (tagId, currentPenalty) => {
    setEditingPenalty({ id: tagId, penalty: currentPenalty });
  };

  const handlePenaltyChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 2) {
      setEditingPenalty(prev => ({
        ...prev,
        penalty: value
      }));
    }
  };

  const handlePenaltySubmit = async () => {
    if (!editingPenalty) return;
    
    setIsUpdatingPenalty(true);
    
    try {
      const response = await fetch(`http://185.138.164.88/api/v1/settings/tags/${editingPenalty.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          penalty: editingPenalty.penalty
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Обновляем данные тегов
      if (activeTab === 'tags') {
        fetchTags();
      }
      
      setEditingPenalty(null);
      alert('Штраф успешно обновлен!');
    } catch (err) {
      console.error('Ошибка обновления штрафа:', err);
      alert(`Ошибка обновления штрафа: ${err.message}`);
    } finally {
      setIsUpdatingPenalty(false);
    }
  };

  const handlePenaltyCancel = () => {
    setEditingPenalty(null);
  };

  const handlePenaltyKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePenaltySubmit();
    } else if (e.key === 'Escape') {
      handlePenaltyCancel();
    }
  };

  // Загружаем проекты при переключении на вкладку
  useEffect(() => {
    if (activeTab === 'projects' && !projectsData && !isProjectsLoading) {
      fetchProjects();
    }
  }, [activeTab, projectsData, isProjectsLoading]);

  // Загружаем агентов при переключении на вкладку
  useEffect(() => {
    if (activeTab === 'agents' && !agentsData && !isAgentsLoading) {
      fetchAgents();
    }
  }, [activeTab, agentsData, isAgentsLoading]);

  // Загружаем интеграции при переключении на вкладку
  useEffect(() => {
    if (activeTab === 'integrations' && !integrationsData && !isIntegrationsLoading) {
      fetchIntegrations();
    }
  }, [activeTab, integrationsData, isIntegrationsLoading]);

  // Загружаем теги при переключении на вкладку
  useEffect(() => {
    if (activeTab === 'tags' && !tagsData && !isTagsLoading) {
      fetchTags();
    }
  }, [activeTab, tagsData, isTagsLoading]);

  // Функции для сайдбара создания проекта
  const openCreateProjectSidebar = (e) => {
    e.stopPropagation();
    setIsCreateProjectSidebarOpen(true);
  };

  const closeCreateProjectSidebar = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsCreateProjectSidebarOpen(false);
    setIsCreatingProject(false);
    setProjectFormData({
      title: '',
      code: '',
      url: '',
      integration_id: '',
      is_active: true
    });
  };

  const handleProjectInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateProject = async (e) => {
    e.stopPropagation();
    
    if (!projectFormData.title.trim() || !projectFormData.code.trim() || !projectFormData.url.trim() || !projectFormData.integration_id) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsCreatingProject(true);
    
    try {
      const response = await fetch('http://185.138.164.88/api/v1/settings/project с/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projectFormData.title.trim(),
          code: projectFormData.code.trim(),
          url: projectFormData.url.trim(),
          integration_id: projectFormData.integration_id,
          is_active: projectFormData.is_active
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      await response.json();

      closeCreateProjectSidebar();
      fetchProjects();
      
      alert('Проект успешно создан!');
    } catch (err) {
      console.error('Ошибка создания проекта:', err);
      alert(`Ошибка создания проекта: ${err.message}`);
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Функции для модального окна
  const openCreateModal = (e) => {
    e.stopPropagation();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsCreateModalOpen(false);
    setIsCreating(false);
    setFormData({
      title: '',
      is_active: true,
      url: '',
      code: ''
    });
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      is_active: project.is_active,
      url: project.url,
      code: project.code
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsEditModalOpen(false);
    setIsUpdating(false);
    setEditingProject(null);
    setFormData({
      title: '',
      is_active: true,
      url: '',
      code: ''
    });
  };

  const handleUpdateProject = async (e) => {
    e.stopPropagation();
    
    if (!formData.title.trim() || !formData.url.trim() || !formData.code.trim()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const response = await fetch(`http://185.138.164.88/api/v1/settings/project/${editingProject.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          is_active: formData.is_active,
          // url: formData.url.trim(),
          code: formData.code.trim()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Проект успешно обновлен:', result);

      closeEditModal();
      if (activeTab === 'projects') {
        fetchProjects();
      }
      
      alert('Группа успешно обновлена!');
    } catch (err) {
      console.error('Ошибка обновления группы:', err);
      alert(`Ошибка обновления группы: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту группу?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`http://185.138.164.88/api/v1/settings/project/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      console.log('Проект успешно удален');
      
      if (activeTab === 'projects') {
        fetchProjects();
      }
      
      alert('Группа успешно удалена!');
    } catch (err) {
      console.error('Ошибка удаления группы:', err);
      alert(`Ошибка удаления группы: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateAgentSidebar = (e) => {
    e.stopPropagation();
    setIsCreateAgentSidebarOpen(true);
  };

  const closeCreateAgentSidebar = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsCreateAgentSidebarOpen(false);
    setIsCreatingAgent(false);
    setAgentFormData({
      name: '',
      username: '',
      type: 'customer',
      lcid: '',
      is_active: true
    });
  };

  const handleAgentInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAgentFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateAgent = async (e) => {
    e.stopPropagation();
    
    if (!agentFormData.lcid.trim() || !agentFormData.name.trim()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsCreatingAgent(true);
    
    try {
      const response = await fetch('http://185.138.164.88/api/v1/settings/agent/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: agentFormData.type,
          lcid: agentFormData.lcid.trim(),
          name: agentFormData.name.trim(),
          available: agentFormData.available
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Агент успешно создан:', result);

      closeCreateAgentSidebar();
      if (activeTab === 'agents') {
        fetchAgents();
      }
      
      alert('Агент успешно создан!');
    } catch (err) {
      console.error('Ошибка создания агента:', err);
      alert(`Ошибка создания агента: ${err.message}`);
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const openEditAgentModal = (agent) => {
    setEditingAgent(agent);
    setAgentFormData({
      type: agent.type || 'customer',
      lcid: agent.lcid || '',
      name: agent.name || '',
      available: agent.available !== undefined ? agent.available : true
    });
    setIsEditAgentModalOpen(true);
  };

  const closeEditAgentModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsEditAgentModalOpen(false);
    setIsUpdatingAgent(false);
    setEditingAgent(null);
    setAgentFormData({
      type: 'customer',
      lcid: '',
      name: '',
      available: true
    });
  };

  const handleUpdateAgent = async (e) => {
    e.stopPropagation();
    
    if (!agentFormData.lcid.trim() || !agentFormData.name.trim()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsUpdatingAgent(true);
    
    try {
      const response = await fetch(`http://185.138.164.88/api/v1/settings/agent/?id=${editingAgent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: agentFormData.type,
          lcid: agentFormData.lcid.trim(),
          name: agentFormData.name.trim(),
          available: agentFormData.available
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Агент успешно обновлен:', result);

      closeEditAgentModal();
      if (activeTab === 'agents') {
        fetchAgents();
      }
      
      alert('Агент успешно обновлен!');
    } catch (err) {
      console.error('Ошибка обновления агента:', err);
      alert(`Ошибка обновления агента: ${err.message}`);
    } finally {
      setIsUpdatingAgent(false);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого агента?')) {
      return;
    }
    
    setIsDeletingAgent(true);
    
    try {
      const response = await fetch(`http://185.138.164.88/api/v1/settings/agent/${agentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      console.log('Агент успешно удален');
      
      if (activeTab === 'agents') {
        fetchAgents();
      }
      
      alert('Агент успешно удален!');
    } catch (err) {
      console.error('Ошибка удаления агента:', err);
      alert(`Ошибка удаления агента: ${err.message}`);
    } finally {
      setIsDeletingAgent(false);
    }
  };

  const openCreateIntegrationSidebar = (e) => {
    e.stopPropagation();
    setIsCreateIntegrationSidebarOpen(true);
  };

  const closeCreateIntegrationSidebar = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsCreateIntegrationSidebarOpen(false);
    setIsCreatingIntegration(false);
    setIntegrationFormData({
      name: '',
      type: 'livechat',
      username: '',
      secret_key: ''
    });
  };

  const handleIntegrationInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIntegrationFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateIntegration = async (e) => {
    e.stopPropagation();
    
    if (!integrationFormData.name.trim() || !integrationFormData.username.trim() || !integrationFormData.secret_key.trim()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsCreatingIntegration(true);
    
    try {
      const response = await fetch('http://185.138.164.88/api/v1/settings/integrations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: integrationFormData.name.trim(),
          type: integrationFormData.type,
          username: integrationFormData.username.trim(),
          secret_key: integrationFormData.secret_key.trim()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Интеграция успешно создана:', result);

      closeCreateIntegrationSidebar();
      if (activeTab === 'integrations') {
        fetchIntegrations();
      }
      
      alert('Интеграция успешно создана!');
    } catch (err) {
      console.error('Ошибка создания интеграции:', err);
      alert(`Ошибка создания интеграции: ${err.message}`);
    } finally {
      setIsCreatingIntegration(false);
    }
  };

  const openEditIntegrationModal = (integration) => {
    setEditingIntegration(integration);
    setIntegrationFormData({
      name: integration.name || '',
      type: integration.type || 'livechat',
      username: integration.username || '',
      secret_key: integration.secret_key || ''
    });
    setIsEditIntegrationModalOpen(true);
  };

  const closeEditIntegrationModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsEditIntegrationModalOpen(false);
    setIsUpdatingIntegration(false);
    setEditingIntegration(null);
    setIntegrationFormData({
      name: '',
      type: 'livechat',
      username: '',
      secret_key: ''
    });
  };

  const handleUpdateIntegration = async (e) => {
    e.stopPropagation();
    
    if (!integrationFormData.name.trim() || !integrationFormData.username.trim() || !integrationFormData.secret_key.trim()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsUpdatingIntegration(true);
    
    try {
      const response = await fetch(`http://185.138.164.88/api/v1/settings/integrations/${editingIntegration.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: integrationFormData.name.trim(),
          username: integrationFormData.username.trim(),
          secret_key: integrationFormData.secret_key.trim()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Интеграция успешно обновлена:', result);

      closeEditIntegrationModal();
      if (activeTab === 'integrations') {
        fetchIntegrations();
      }
      
      alert('Интеграция успешно обновлена!');
    } catch (err) {
      console.error('Ошибка обновления интеграции:', err);
      alert(`Ошибка обновления интеграции: ${err.message}`);
    } finally {
      setIsUpdatingIntegration(false);
    }
  };

  const handleDeleteIntegration = async (integrationId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту интеграцию?')) {
      return;
    }
    
    setIsDeletingIntegration(true);
    
    try {
      const response = await fetch(`http://185.138.164.88/api/v1/settings/integrations/${integrationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      console.log('Интеграция успешно удалена');
      
      if (activeTab === 'integrations') {
        fetchIntegrations();
      }
      
      alert('Интеграция успешно удалена!');
    } catch (err) {
      console.error('Ошибка удаления интеграции:', err);
      alert(`Ошибка удаления интеграции: ${err.message}`);
    } finally {
      setIsDeletingIntegration(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.stopPropagation();
    
    // Валидация полей
    if (!formData.title.trim() || !formData.url.trim() || !formData.code.trim()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsCreating(true);
    
    try {
      const response = await fetch('http://185.138.164.88/api/v1/settings/project/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          is_active: formData.is_active,
          url: formData.url.trim(),
          code: formData.code.trim()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Проект успешно создан:', result);

      // Закрываем модальное окно и обновляем список проектов
      closeCreateModal();
      if (activeTab === 'projects') {
        fetchProjects();
      }
      
      alert('Группа успешно создана!');
    } catch (err) {
      console.error('Ошибка создания группы:', err);
      alert(`Ошибка создания группы: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="page-content">
      <div className="qa-settings">
        
        {error && (
          <div className="error-container">
            <div className="error-message">
              <h3>Ошибка загрузки</h3>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <div className="settings-content">
          {activeTab === 'main' && (
            <>
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Загрузка настроек...</p>
                </div>
              ) : settingsData ? (
                <div className="settings-dashboard">
                  <div className="dashboard-grid">
                    {/* Основные настройки */}
                    <div className="settings-card">
                      <div className="card-header">
                        <h3 className="card-title">Основные настройки</h3>
                      </div>
                      <div className="card-content">
                        <div className="stat-item">
                          <div className="stat-label">Лимит</div>
                          <div className="stat-value">{settingsData.limit}</div>
                          <div className="stat-description">Максимальное количество элементов</div>
                        </div>
                        
                        <div className="stat-item">
                          <div className="stat-label">Рабочая смена</div>
                          <div className="stat-value">{settingsData.working_shift}</div>
                          <div className="stat-description">Номер текущей смены</div>
                        </div>
                        
                        <div className="stat-item">
                          <div className="stat-label">Минимум сообщений</div>
                          <div className="stat-value">{settingsData.min_messages_count}</div>
                          <div className="stat-description">Минимальное количество сообщений</div>
                        </div>
                        
                        <div className="stat-item">
                          <div className="stat-label">Доступность</div>
                          <div className={`stat-status ${settingsData.available ? 'available' : 'unavailable'}`}>
                            {settingsData.available ? 'Доступна' : 'Недоступна'}
                          </div>
                          <div className="stat-description">Статус системы</div>
                        </div>
                      </div>
                    </div>

                    {/* Сообщения */}
                    <div className="settings-card">
                      <div className="card-header">
                        <h3 className="card-title">Сообщения</h3>
                      </div>
                      <div className="card-content">
                        <div className="stat-item">
                          <div className="stat-label">Сообщения бота</div>
                          <div className={`stat-status ${settingsData.bot_messages ? 'enabled' : 'disabled'}`}>
                            {settingsData.bot_messages ? 'Включено' : 'Отключено'}
                          </div>
                          <div className="stat-description">Получать сообщения от бота</div>
                        </div>
                        
                        <div className="stat-item">
                          <div className="stat-label">Файловые сообщения</div>
                          <div className={`stat-status ${settingsData.file_messages ? 'enabled' : 'disabled'}`}>
                            {settingsData.file_messages ? 'Включено' : 'Отключено'}
                          </div>
                          <div className="stat-description">Получать сообщения с файлами</div>
                        </div>
                      </div>
                    </div>

                    {/* Версия промпта */}
                    <div className="settings-card">
                      <div className="card-header">
                        <h3 className="card-title">Версия промпта</h3>
                      </div>
                      <div className="card-content">
                        <div className="stat-item">
                          <div className="stat-label">Название</div>
                          <div className="stat-value">{settingsData.prompt_version?.name || 'Не указано'}</div>
                          <div className="stat-description">Имя версии промпта</div>
                        </div>
                        
                        <div className="stat-item level-item">
                          <div className="level-header">
                            <div className="level-info">
                              <div className="stat-label">Уровень</div>
                              <div className="stat-description">Сложность промпта</div>
                            </div>
                            <button 
                              className="edit-language-btn"
                              onClick={() => {
                                setIsLanguageSwitcherVisible(!isLanguageSwitcherVisible);
                                setIsEditingMode(!isEditingMode);
                                if (!isEditingMode) {
                                  // При первом открытии загружаем промпты для текущего языка
                                  fetchPrompts(selectedLanguage);
                                }
                              }}
                            >
                              <FiEdit3 />
                            </button>
                          </div>
                          
                          {/* Переключатель языков - показывается только при нажатии на карандаш */}
                          {isLanguageSwitcherVisible && (
                            <div className="language-switcher">
                              <button 
                                className={`language-btn ${selectedLanguage === 'RU' ? 'active' : ''}`}
                                onClick={() => {
                                  setSelectedLanguage('RU');
                                  fetchPrompts('RU');
                                }}
                              >
                                RU
                              </button>
                              <button 
                                className={`language-btn ${selectedLanguage === 'EN' ? 'active' : ''}`}
                                onClick={() => {
                                  setSelectedLanguage('EN');
                                  fetchPrompts('EN');
                                }}
                              >
                                EN
                              </button>
                              <button 
                                className={`language-btn ${selectedLanguage === 'TR' ? 'active' : ''}`}
                                onClick={() => {
                                  setSelectedLanguage('TR');
                                  fetchPrompts('TR');
                                }}
                              >
                                TR
                              </button>
                            </div>
                          )}
                          
                          {/* Отображение контента в зависимости от режима */}
                          {isEditingMode ? (
                            // Режим редактирования - показываем доступные промпты
                            <div className="prompts-list">
                              <div className="prompts-title">Выберите промпт:</div>
                              {isPromptsLoading ? (
                                <div className="prompts-loading">
                                  <div className="loading-spinner"></div>
                                  <span>Загрузка промптов...</span>
                                </div>
                              ) : promptsError ? (
                                <div className="prompts-error">
                                  {promptsError}
                                </div>
                              ) : promptsData && promptsData.length > 0 ? (
                                promptsData.map((prompt) => (
                                  <div 
                                    key={prompt.id} 
                                    className={`prompt-item selectable ${isUpdatingPrompt ? 'disabled' : ''}`} 
                                    onClick={() => {
                                      if (!isUpdatingPrompt) {
                                        updatePrompt(prompt.id);
                                      }
                                    }}
                                  >
                                    <div className="prompt-name">{prompt.name}</div>
                                    <div className={`prompt-level level-${prompt.level}`}>
                                      {prompt.level}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="prompt-empty">Промпты не найдены</div>
                              )}
                            </div>
                          ) : (
                            // Обычный режим - показываем актуальный уровень
                            <div className={`stat-status level-${settingsData.prompt_version?.level || 'unknown'}`}>
                              {settingsData.prompt_version?.level || 'Не указан'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Метаданные */}
                    <div className="settings-card">
                      <div className="card-header">
                        <h3 className="card-title">Метаданные</h3>
                      </div>
                      <div className="card-content">
                        <div className="stat-item">
                          <div className="stat-label">ID</div>
                          <div className="stat-id">{settingsData.id}</div>
                          <div className="stat-description">Уникальный идентификатор</div>
                        </div>
                        
                        <div className="stat-item">
                          <div className="stat-label">Обновлено</div>
                          <div className="stat-time">
                            {new Date(settingsData.updated_at).toLocaleString('ru-RU')}
                          </div>
                          <div className="stat-description">Время последнего обновления</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <p>Нет данных настроек</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'integrations' && (
                <div className="tab-content">
                  {isIntegrationsLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p className="loading-text">Загрузка интеграций...</p>
                    </div>
                  ) : integrationsError ? (
                    <div className="error-container">
                      <div className="error-message">
                        <h3>Ошибка загрузки</h3>
                        <p>{integrationsError}</p>
                      </div>
                    </div>
                  ) : integrationsData ? (
                    <div className="integrations-dashboard">
                      <div className="integrations-header">
                        <div className="integrations-title-section">
                          <h2 className="integrations-title">Интеграции</h2>
                          <p className="integrations-subtitle">Управление интеграциями системы</p>
                        </div>
                      </div>
                      
                      <div className="integrations-grid">
                        {integrationsData.map((integration) => (
                          <div key={integration.id} className="integration-card">
                            <div className="integration-card-header">
                              <div className="integration-icon">
                                {integration.type === 'livechat' && '💬'}
                                {integration.type === 'chatwood' && '🌲'}
                                {integration.type === 'telegram' && '📱'}
                                {integration.type === 'whatsapp' && '📞'}
                                {integration.type === 'facebook' && '📘'}
                              </div>
                              <div className="integration-info">
                                <h3 className="integration-name">{integration.name}</h3>
                                <div className={`integration-status ${integration.available ? 'available' : 'unavailable'}`}>
                                  {integration.available ? 'Доступна' : 'Недоступна'}
                                </div>
                              </div>
                              <div className="integration-actions">
                                <button 
                                  className="integration-action-btn edit"
                                  onClick={() => openEditIntegrationModal(integration)}
                                  title="Редактировать интеграцию"
                                >
                                  <SettingOutlined />
                                </button>
                                <button 
                                  className="integration-action-btn delete"
                                  onClick={() => handleDeleteIntegration(integration.id)}
                                  disabled={isDeletingIntegration}
                                  title="Удалить интеграцию"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                            
                            <div className="integration-details">
                              <div className="integration-detail-item">
                                <span className="detail-label">Тип</span>
                                <span className="detail-value">{integration.type}</span>
                              </div>
                              
                              <div className="integration-detail-item">
                                <span className="detail-label">Username</span>
                                <span className="detail-value">{integration.username}</span>
                              </div>
                              
                              <div className="integration-detail-item">
                                <span className="detail-label">ID</span>
                                <span className="detail-id">{integration.id}</span>
                              </div>
                              
                              <div className="integration-detail-item">
                                <span className="detail-label">Secret Key</span>
                                <span className="detail-secret">{integration.secret_key}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>Нет данных интеграций</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'projects' && (
            <div className="tab-content">
              {isProjectsLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Загрузка проектов...</p>
                </div>
              ) : projectsError ? (
                <div className="error-container">
                  <div className="error-message">
                    <h3>Ошибка загрузки</h3>
                    <p>{projectsError}</p>
                  </div>
                </div>
              ) : projectsData ? (
                <div className="projects-dashboard">
                  <div className="projects-header">
                    <div className="projects-title-section">
                      <h2 className="projects-title">Проекты</h2>
                      <p className="projects-subtitle">Управление проектами системы</p>
                    </div>
                  </div>
                  
                  <div className="projects-grid">
                    {projectsData.map((project) => (
                      <div key={project.id} className="project-card">
                        <div className="project-card-header">
                          <div className="project-icon">
                            📁
                          </div>
                          <div className="project-info">
                            <h3 className="project-name">{project.title}</h3>
                            <div className={`project-status ${project.is_active ? 'active' : 'inactive'}`}>
                              {project.is_active ? 'Активен' : 'Неактивен'}
                            </div>
                          </div>
                          <div className="project-actions">
                            <button 
                              className="project-action-btn edit"
                              onClick={() => openEditModal(project)}
                              title="Редактировать проект"
                            >
                              <SettingOutlined />
                            </button>
                            <button 
                              className="project-action-btn delete"
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={isDeleting}
                              title="Удалить проект"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        
                        <div className="project-details">
                          <div className="project-detail-item">
                            <span className="detail-label">Код:</span>
                            <span className="detail-value">{project.code}</span>
                          </div>
                          
                          <div className="project-detail-item">
                            <span className="detail-label">URL:</span>
                            <a 
                              href={project.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="detail-url"
                            >
                              {project.url}
                            </a>
                          </div>
                          
                          <div className="project-detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-id">{project.id}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <p>Нет данных проектов</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="tab-content">
              {isAgentsLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Загрузка агентов...</p>
                </div>
              ) : agentsError ? (
                <div className="error-container">
                  <div className="error-message">
                    <h3>Ошибка загрузки</h3>
                    <p>{agentsError}</p>
                  </div>
                </div>
              ) : agentsData ? (
                <div className="agents-display">
                  <div className="section-header">
                    <h2 className="section-title">Агенты</h2>
                  </div>
                  
                  <div className="agents-list">
                    {agentsData.map((agent) => (
                      <div key={agent.id} className="agent-item">
                        <div className="agent-main">
                          <div className="agent-name">{agent.name || agent.username || 'Агент'}</div>
                        </div>
                        
                        <div className={`agent-status ${agent.is_active ? 'active' : 'inactive'}`}>
                          {agent.is_active ? 'Активен' : 'Неактивен'}
                        </div>
                        
                        <div className="agent-id">{agent.id}</div>
                        
                        <div className="agent-actions">
                          <button 
                            className="agent-edit-btn" 
                            onClick={() => openEditAgentModal(agent)}
                            title="Редактировать агента"
                          >
                            ✎
                          </button>
                          <button 
                            className="agent-delete-btn" 
                            onClick={() => handleDeleteAgent(agent.id)}
                            disabled={isDeletingAgent}
                            title="Удалить агента"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <p>Нет данных агентов</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="section-title">Теги</h2>
              </div>
              
              {isTagsLoading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Загрузка тегов...</p>
                </div>
              )}
              
              {!isTagsLoading && tagsError && (
                <div className="error-container">
                  <p className="error-message">{tagsError}</p>
                </div>
              )}
              
              {!isTagsLoading && !tagsError && tagsData && tagsData.length > 0 && (
                <div className="tags-display">
                  {tagsData.map((questionGroup, index) => {
                    const isExpanded = !!expandedGroups[index];
                    const tagsCount = Object.keys(questionGroup.tags).length;
                    
                    return (
                      <div key={index} className="question-group">
                        <div 
                          className="question-header" 
                          onClick={() => toggleGroupExpansion(index)}
                        >
                          <div className="question-info">
                            <h3 className="question-title">{questionGroup.question}</h3>
                            <span className="tags-count">{tagsCount} тегов</span>
                          </div>
                          <div className={`expand-icon ${isExpanded ? 'expanded' : 'collapsed'}`}>
                            ▼
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="tags-list">
                            {Object.entries(questionGroup.tags).map(([tagKey, tag]) => {
                              const isEditing = editingPenalty?.id === tag.id;
                              
                              return (
                                <div key={tag.id} className="tag-item">
                                  <div className="tag-main">
                                    <span className="tag-name">{tag.name}</span>
                                  </div>
                                  {isEditing ? (
                                    <div className="penalty-edit">
                                      <input
                                        type="number"
                                        value={editingPenalty.penalty}
                                        onChange={handlePenaltyChange}
                                        onKeyDown={handlePenaltyKeyPress}
                                        className="penalty-input"
                                        min="0"
                                        max="2"
                                        step="1"
                                        disabled={isUpdatingPenalty}
                                        autoFocus
                                      />
                                      <div className="penalty-actions">
                                        <button 
                                          className="penalty-save" 
                                          onClick={handlePenaltySubmit}
                                          disabled={isUpdatingPenalty}
                                          title="Сохранить"
                                        >
                                          ✓
                                        </button>
                                        <button 
                                          className="penalty-cancel" 
                                          onClick={handlePenaltyCancel}
                                          disabled={isUpdatingPenalty}
                                          title="Отмена"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <span 
                                      className="tag-penalty"
                                      onClick={() => handlePenaltyClick(tag.id, tag.penalty)}
                                      title="Нажмите для редактирования"
                                    >
                                      {tag.penalty}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {!isTagsLoading && !tagsError && tagsData && tagsData.length === 0 && (
                <div className="no-data">
                  <p>Теги не найдены</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Сайдбар создания проекта */}
      {isCreateProjectSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeCreateProjectSidebar}>
          <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h3>Создать проект</h3>
              <button className="sidebar-close" onClick={closeCreateProjectSidebar}>
                ×
              </button>
            </div>
            
            <div className="sidebar-body">
              <div className="form-group">
                <label className="form-label">Название проекта</label>
                <input
                  type="text"
                  name="title"
                  value={projectFormData.title}
                  onChange={handleProjectInputChange}
                  className="form-input"
                  placeholder="Например: Основной проект"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Интеграция</label>
                <div className="select-wrapper">
                  <select
                    name="integration_id"
                    value={projectFormData.integration_id}
                    onChange={handleProjectInputChange}
                    className="form-input form-select"
                    required
                  >
                    <option value="">Выберите интеграцию</option>
                    {integrationsData && integrationsData.map((integration) => (
                      <option key={integration.id} value={integration.id}>
                        {integration.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Код проекта</label>
                <input
                  type="text"
                  name="code"
                  value={projectFormData.code}
                  onChange={handleProjectInputChange}
                  className="form-input"
                  placeholder="Например: MAIN_PROJECT"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">URL проекта</label>
                <input
                  type="url"
                  name="url"
                  value={projectFormData.url}
                  onChange={handleProjectInputChange}
                  className="form-input"
                  placeholder="https://example.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={projectFormData.is_active}
                    onChange={handleProjectInputChange}
                    className="form-checkbox"
                  />
                  Активный проект
                </label>
              </div>
              
              <div className="form-actions">
                <button className="btn-cancel" onClick={closeCreateProjectSidebar}>
                  Отмена
                </button>
                <button className="btn-create" onClick={handleCreateProject} disabled={isCreatingProject}>
                  {isCreatingProject ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно создания группы - вынесено за пределы основного контейнера */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Создать группу</h3>
              <button className="modal-close" onClick={closeCreateModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Название</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Введите название группы"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com/"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Код</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Введите код группы"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  Активна
                </label>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeCreateModal}>
                Отмена
              </button>
              <button className="btn-create" onClick={handleCreateGroup} disabled={isCreating}>
                {isCreating ? 'Создание...' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно редактирования группы */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Редактировать группу</h3>
              <button className="modal-close" onClick={closeEditModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Название</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Введите название группы"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com/"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Код</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Введите код группы"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  Активна
                </label>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeEditModal}>
                Отмена
              </button>
              <button className="btn-create" onClick={handleUpdateProject} disabled={isUpdating}>
                {isUpdating ? 'Обновление...' : 'Обновить'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Сайдбар создания агента */}
      {isCreateAgentSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeCreateAgentSidebar}>
          <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h3>Создать агента</h3>
              <button className="sidebar-close" onClick={closeCreateAgentSidebar}>
                ×
              </button>
            </div>
            
            <div className="sidebar-body">
              <div className="form-group">
                <label className="form-label">Имя агента</label>
                <input
                  type="text"
                  name="name"
                  value={agentFormData.name}
                  onChange={handleAgentInputChange}
                  className="form-input"
                  placeholder="Введите имя агента"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={agentFormData.username}
                  onChange={handleAgentInputChange}
                  className="form-input"
                  placeholder="Введите username"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Тип</label>
                <div className="select-wrapper">
                  <select
                    name="type"
                    value={agentFormData.type}
                    onChange={handleAgentInputChange}
                    className="form-input form-select"
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">LCID</label>
                <input
                  type="text"
                  name="lcid"
                  value={agentFormData.lcid}
                  onChange={handleAgentInputChange}
                  className="form-input"
                  placeholder="Введите LCID"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={agentFormData.is_active}
                    onChange={handleAgentInputChange}
                    className="form-checkbox"
                  />
                  Активный агент
                </label>
              </div>
              
              <div className="form-actions">
                <button className="btn-cancel" onClick={closeCreateAgentSidebar}>
                  Отмена
                </button>
                <button className="btn-create" onClick={handleCreateAgent} disabled={isCreatingAgent}>
                  {isCreatingAgent ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно создания агента - УДАЛЕНО, заменено на сайдбар */}
      
      {/* Модальное окно редактирования агента */}
      {isEditAgentModalOpen && (
        <div className="modal-overlay" onClick={closeEditAgentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Редактировать агента</h3>
              <button className="modal-close" onClick={closeEditAgentModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Тип</label>
                <select
                  name="type"
                  value={agentFormData.type}
                  onChange={handleAgentInputChange}
                  className="form-input"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">LCID (ID или почта)</label>
                <input
                  type="text"
                  name="lcid"
                  value={agentFormData.lcid}
                  onChange={handleAgentInputChange}
                  className="form-input"
                  placeholder="Введите ID или почту из интеграции"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Имя агента</label>
                <input
                  type="text"
                  name="name"
                  value={agentFormData.name}
                  onChange={handleAgentInputChange}
                  className="form-input"
                  placeholder="Введите имя агента"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="available"
                    checked={agentFormData.available}
                    onChange={handleAgentInputChange}
                    className="form-checkbox"
                  />
                  Доступен
                </label>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeEditAgentModal}>
                Отмена
              </button>
              <button className="btn-create" onClick={handleUpdateAgent} disabled={isUpdatingAgent}>
                {isUpdatingAgent ? 'Обновление...' : 'Обновить'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Сайдбар создания интеграции */}
      {isCreateIntegrationSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeCreateIntegrationSidebar}>
          <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h3>Создать интеграцию</h3>
              <button className="sidebar-close" onClick={closeCreateIntegrationSidebar}>
                ×
              </button>
            </div>
            
            <div className="sidebar-body">
              <div className="form-group">
                <label className="form-label">Название интеграции</label>
                <input
                  type="text"
                  name="name"
                  value={integrationFormData.name}
                  onChange={handleIntegrationInputChange}
                  className="form-input"
                  placeholder="Например: Основной LiveChat"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Тип сервиса</label>
                <div className="select-wrapper">
                  <select
                    name="type"
                    value={integrationFormData.type}
                    onChange={handleIntegrationInputChange}
                    className="form-input form-select"
                    required
                  >
                    <option value="livechat">LiveChat</option>
                    <option value="chatwood">ChatWood</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={integrationFormData.username}
                  onChange={handleIntegrationInputChange}
                  className="form-input"
                  placeholder="Введите username для сервиса"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Secret Key</label>
                <input
                  type="password"
                  name="secret_key"
                  value={integrationFormData.secret_key}
                  onChange={handleIntegrationInputChange}
                  className="form-input"
                  placeholder="Введите секретный ключ"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button className="btn-cancel" onClick={closeCreateIntegrationSidebar}>
                  Отмена
                </button>
                <button className="btn-create" onClick={handleCreateIntegration} disabled={isCreatingIntegration}>
                  {isCreatingIntegration ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно редактирования интеграции */}
      {isEditIntegrationModalOpen && (
        <div className="modal-overlay" onClick={closeEditIntegrationModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Редактировать интеграцию</h3>
              <button className="modal-close" onClick={closeEditIntegrationModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Название</label>
                <input
                  type="text"
                  name="name"
                  value={integrationFormData.name}
                  onChange={handleIntegrationInputChange}
                  className="form-input"
                  placeholder="Введите название интеграции"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Тип</label>
                <select
                  name="type"
                  value={integrationFormData.type}
                  onChange={handleIntegrationInputChange}
                  className="form-input"
                  required
                >
                  <option value="livechat">LiveChat</option>
                  <option value="chatwood">ChatWood</option>
                  <option value="telegram">Telegram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={integrationFormData.username}
                  onChange={handleIntegrationInputChange}
                  className="form-input"
                  placeholder="Введите username"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Secret Key</label>
                <input
                  type="text"
                  name="secret_key"
                  value={integrationFormData.secret_key}
                  onChange={handleIntegrationInputChange}
                  className="form-input"
                  placeholder="Введите secret key"
                  required
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeEditIntegrationModal}>
                Отмена
              </button>
              <button className="btn-create" onClick={handleUpdateIntegration} disabled={isUpdatingIntegration}>
                {isUpdatingIntegration ? 'Обновление...' : 'Обновить'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Кнопка создания интеграции */}
      {activeTab === 'integrations' && (
        <button className="create-integration-btn" onClick={openCreateIntegrationSidebar} title="Создать интеграцию">
          <span className="btn-icon">+</span>
        </button>
      )}
      
      {/* Кнопка создания проекта */}
      {activeTab === 'projects' && (
        <button className="create-project-btn" onClick={openCreateProjectSidebar} title="Создать проект">
          <span className="btn-icon">+</span>
        </button>
      )}
      
      {/* Кнопка создания агента */}
      {activeTab === 'agents' && (
        <button className="create-agent-btn" onClick={openCreateAgentSidebar} title="Создать агента">
          <span className="btn-icon">+</span>
        </button>
      )}
    </div>
  );
};
