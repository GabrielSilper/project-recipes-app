import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BtnCategory from '../components/BtnCategory';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import RecipesContext from '../context/RecipesContext';
import getTitleAndButton from '../helpers/getTitleAndButton';
import { fetchCaterorys, fetchData } from '../services/fetchs';
import CardWrapper from '../styles/CardWrapper';
import FilterButton from '../styles/FilterButton';
import FiltersWrapper from '../styles/FiltersWrapper';

function Recipes() {
  const MAX_RECIPES = 12;
  const MAX_CATEGORYS = 5;

  const { pathname } = useLocation();
  const history = useHistory();
  const { recipes, setRecipes, makeSearch } = useContext(RecipesContext);
  const { setCategorys, categorys, setFilter } = useContext(RecipesContext);

  const [pageInfo, setPageInfo] = useState({
    title: '',
    haveButton: true,
  });

  // useEffect pra recuperar os dados da página e alimentar o Header.
  useEffect(() => {
    setPageInfo(getTitleAndButton(pathname));
  }, [pathname]);

  // useEffect para fazer o fetch das receitas baseado na página.
  useEffect(() => {
    fetchData(pageInfo.title, setRecipes);
    fetchCaterorys(pageInfo.title, setCategorys);
  }, [pageInfo, setRecipes, setCategorys]);

  // useEffect caso só tenha um dado pesquisa e redirecionar para a página de detalhes
  useEffect(() => {
    if (makeSearch && recipes.length === 1) {
      const path = pageInfo.title.toLowerCase();
      const id = recipes[0].idMeal || recipes[0].idDrink;
      history.push(`/${path}/${id}`);
      fetchData(pageInfo.title, setRecipes);
    }
  }, [history, pageInfo, recipes, makeSearch, setRecipes]);

  // Função para remover todos os filtros.
  const removeFilter = () => {
    fetchData(pageInfo.title, setRecipes);
    setFilter('');
  };

  return (
    <>
      <main>
        {/* Renderização do header */}
        {pageInfo.title && (
          <Header title={ pageInfo.title } searchButton={ pageInfo.haveButton } />
        )}

        <FiltersWrapper>
          {/* Renderização do botão All */}
          <FilterButton
            data-testid="All-category-filter"
            onClick={ removeFilter }
          >
            All
          </FilterButton>

          {/* Renderização dos botões de categoria */}
          {categorys
            .map((item, index) => {
              const { strCategory } = item;
              return (
                <BtnCategory
                  removeFilter={ removeFilter }
                  key={ index }
                  categoryName={ strCategory }
                  type={ pageInfo.title }
                />
              );
            })
            .slice(0, MAX_CATEGORYS)}
        </FiltersWrapper>

        <CardWrapper>
          {/* Renderização das receitas */}
          {recipes
            .map((item, index) => (
              <RecipeCard
                key={ item.idMeal || item.idDrink }
                id={ item.idMeal || item.idDrink }
                index={ index }
                name={ item.strDrink || item.strMeal }
                image={ item.strMealThumb || item.strDrinkThumb }
                page={ pageInfo.title.toLowerCase() }
              />
            ))
            .slice(0, MAX_RECIPES)}
        </CardWrapper>
      </main>
      <Footer />
    </>
  );
}

export default Recipes;
