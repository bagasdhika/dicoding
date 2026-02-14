import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import StoryDetailPage from '../pages/detail/story-detail-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NotFoundPage from '../pages/not-found/not-found-page';

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/add': AddStoryPage,
  '/detail/:id': StoryDetailPage,
  '/bookmark': BookmarkPage,
};

export const getPage = (route) => {
  const PageClass = routes[route] || NotFoundPage;
  return new PageClass();
};

export default routes;
