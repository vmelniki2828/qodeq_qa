import styled from 'styled-components';

const PaginationSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 16px;
`;

const TotalText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 500;
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const PaginationText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  white-space: nowrap;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D'
        ? '#f0f0f0'
        : 'rgba(255,255,255,0.1)'};
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  ${({ $active }) =>
    $active &&
    `
    background-color: ${({ theme }) => theme.colors.accent};
    color: #FFFFFF;
    border-color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  `}
`;

const PaginationEllipsis = styled.span`
  padding: 0 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  user-select: none;
`;

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  onPageChange,
  itemsPerPage = 20 
}) => {
  // Функция для генерации умного списка страниц с многоточием
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // Максимальное количество видимых страниц
    const sidePages = 2; // Количество страниц с каждой стороны от текущей

    if (totalPages <= maxVisible) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pages.push(1);

      let startPage = Math.max(2, currentPage - sidePages);
      let endPage = Math.min(totalPages - 1, currentPage + sidePages);

      // Если текущая страница близко к началу
      if (currentPage <= sidePages + 2) {
        endPage = Math.min(maxVisible - 1, totalPages - 1);
        for (let i = 2; i <= endPage; i++) {
          pages.push(i);
        }
        if (endPage < totalPages - 1) {
          pages.push('ellipsis');
        }
      }
      // Если текущая страница близко к концу
      else if (currentPage >= totalPages - sidePages - 1) {
        if (startPage > 2) {
          pages.push('ellipsis');
        }
        for (let i = Math.max(2, totalPages - maxVisible + 2); i < totalPages; i++) {
          pages.push(i);
        }
      }
      // Если текущая страница в середине
      else {
        if (startPage > 2) {
          pages.push('ellipsis');
        }
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        if (endPage < totalPages - 1) {
          pages.push('ellipsis');
        }
      }

      // Всегда показываем последнюю страницу
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationSection>
      <TotalText>Total: {totalItems}</TotalText>
      <PaginationInfo>
        <PaginationText>
          Page {currentPage} of {totalPages} • Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </PaginationText>
        <PaginationButtons>
          <PaginationButton
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
            title="First page"
          >
            ««
          </PaginationButton>
          <PaginationButton
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            title="Previous page"
          >
            ‹
          </PaginationButton>
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <PaginationEllipsis key={`ellipsis-${index}`}>
                  ...
                </PaginationEllipsis>
              );
            }
            return (
              <PaginationButton
                key={page}
                $active={currentPage === page}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationButton>
            );
          })}
          <PaginationButton
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            title="Next page"
          >
            ›
          </PaginationButton>
          <PaginationButton
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            title="Last page"
          >
            »»
          </PaginationButton>
        </PaginationButtons>
      </PaginationInfo>
    </PaginationSection>
  );
};

