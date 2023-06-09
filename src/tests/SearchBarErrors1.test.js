import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import mockSearchFirstLetter from './helpers/Mocks/SearchBar/mockSearchFirstLetter';
import renderWithRouterAndContextProvider from './helpers/renderWithRouterAndContextProvider';

describe('Testando as exceções do componente "SearchBar"', () => {
  beforeEach(() => {
    const { history } = renderWithRouterAndContextProvider(<App />);
    act(() => { history.push('/meals'); });
    const btnInitSearch = screen.getByRole('img', { name: /search/i });
    userEvent.click(btnInitSearch);
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockSearchFirstLetter),
    });
  });

  test('Verifica se não selecionar o tipo de busca, então não renderiza nada', () => {
    const searchInput = screen.getByRole('textbox');
    const searchBtn = screen.getByRole('button', { name: /pesquisar/i });

    // Interagindo com os elementos
    userEvent.type(searchInput, 'i');
    userEvent.click(searchBtn);

    const cardtitle = screen.queryByText(/irish stew/i);
    expect(cardtitle).toBeNull();
  });
});
