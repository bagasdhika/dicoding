import { getStoryDetail } from '../../data/api';
import { getToken } from '../../utils/auth';
import Database from '../../data/story-idb';
import { parseActivePathname } from '../../routes/url-parser';
import { showToast } from '../../utils/toast';

export default class StoryDetailPage {
  async render() {
    return `
      <section class="container">
        <div id="storyDetail"></div>
        <button id="bookmarkBtn" class="btn">Simpan Bookmark</button>
      </section>
    `;
  }

  async afterRender() {
    const { id } = parseActivePathname();
    const container = document.getElementById('storyDetail');
    const btn = document.getElementById('bookmarkBtn');

    const token = getToken();

    if (!token) {
      location.hash = '#/login';
      return;
    }

    if (!id) {
      container.innerHTML = '<p>Story tidak ditemukan</p>';
      return;
    }

    try {
      const response = await getStoryDetail(id, token);
      const story = response.story;

      container.innerHTML = `
        <h1>${story.name}</h1>
        <img src="${story.photoUrl}" alt="${story.name}" />
        <p>${story.description}</p>
        <small>${new Date(story.createdAt).toLocaleString()}</small>
      `;

      const saved = await Database.get(story.id);
      btn.textContent = saved ? 'Hapus Bookmark' : 'Simpan Bookmark';

      btn.addEventListener('click', async () => {
        const isSaved = await Database.get(story.id);

        if (isSaved) {
          await Database.delete(story.id);
          btn.textContent = 'Simpan Bookmark';
          showToast('Bookmark dihapus', 'info');
        } else {
          await Database.save(story);   // ✅ INI YANG BENAR
          btn.textContent = 'Hapus Bookmark';
          showToast('Bookmark disimpan', 'success');
        }
      });

    } catch (error) {
      console.error(error);
      container.innerHTML = '<p>Gagal memuat detail story</p>';
    }
  }
}
