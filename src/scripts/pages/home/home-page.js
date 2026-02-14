import {
  getStories,
  subscribeNotification,
  unsubscribeNotification,
} from '../../data/api';

import { getToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';

import {
  isPushSupported,
  subscribePushNotification,
  getPushSubscription,
  unsubscribePushNotification,
} from '../../utils/push-helper';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Daftar Story</h1>

        <div class="push-buttons">
          <button id="btn-subscribe">Aktifkan Notifikasi</button>
          <button id="btn-unsubscribe">Nonaktifkan Notifikasi</button>
        </div>

        <div id="map" style="height:400px;margin:20px 0"></div>

        <section id="storyList" class="story-list"></section>
      </section>
    `;
  }

  async afterRender() {
    const token = getToken();
    if (!token) {
      location.hash = '#/login';
      return;
    }

    /* ================= PUSH ================= */
    if (isPushSupported()) {
      document.getElementById('btn-subscribe')
        ?.addEventListener('click', async () => {
          try {
            const sub = await subscribePushNotification();
            await subscribeNotification(sub, token);
            showToast('Push aktif!', 'success');
          } catch (err) {
            showToast(err.message, 'error');
          }
        });

      document.getElementById('btn-unsubscribe')
        ?.addEventListener('click', async () => {
          try {
            const sub = await getPushSubscription();
            if (!sub) return;

            await unsubscribeNotification(sub.endpoint, token);
            await unsubscribePushNotification();
            showToast('Push dimatikan', 'info');
          } catch (err) {
            showToast(err.message, 'error');
          }
        });
    }

    /* ================= MAP ================= */
    const map = L.map('map').setView([-6.2, 106.8], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(map);

    /* ================= STORY ================= */
    const storyList = document.getElementById('storyList');
    const res = await getStories(token);

    storyList.innerHTML = '';

    res.listStory.forEach((story) => {
      const el = document.createElement('article');
      el.className = 'story-card';
      el.innerHTML = `
        <h2>${story.name}</h2>
        <img src="${story.photoUrl}" />
        <p>${story.description}</p>
        <a href="#/detail/${story.id}" class="btn">Detail</a>
      `;

      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon]).addTo(map)
          .bindPopup(story.name);
      }

      storyList.appendChild(el);
    });
  }
}
