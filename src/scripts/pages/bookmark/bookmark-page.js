import Database from '../../data/story-idb';
import { showToast } from '../../utils/toast';

export default class BookmarkPage {
  async render() {
    return `
      <section class="container">
        <h1>Story Tersimpan</h1>
        <section id="bookmarkList" class="story-list"></section>
      </section>
    `;
  }

  async afterRender() {
    const list = document.getElementById('bookmarkList');
    const stories = await Database.getAll();

    if (!stories.length) {
      list.innerHTML = '<p>Belum ada bookmark</p>';
      return;
    }

    stories.forEach((story) => {
      const article = document.createElement('article');
      article.className = 'story-card';

      article.innerHTML = `
        <h2>${story.name}</h2>
        <img src="${story.photoUrl}" alt="${story.name}" />
        <p>${story.description}</p>

        <a href="#/detail/${story.id}" class="btn">Detail</a>
        <button class="btn danger">Hapus</button>
      `;

      article.querySelector('.danger').addEventListener('click', async () => {
        await Database.delete(story.id);
        article.remove();
        showToast('Bookmark dihapus', 'info');
      });

      list.appendChild(article);
    });
  }
}
