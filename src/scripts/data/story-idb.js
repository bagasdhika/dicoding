import { openDB } from 'idb';

/* =========================================================
   KONFIGURASI DATABASE
   ========================================================= */
const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 1;

/*
  STORE:
  - offline-stories → Submission 1 (WAJIB)
*/
const STORE_NAME = 'offline-stories';

/* =========================================================
   INIT DATABASE
   ========================================================= */
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // ✅ Submission 1: Offline story cache
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
      });
    }
  },
});

/* =========================================================
   STORY IDB HELPER
   - Submission 1: CRUD Offline Story
   - Submission 2–4: Alias method (AMAN)
   ========================================================= */
const StoryIDB = {
  /* =====================
     ADD / SAVE STORY
     (KODE LAMA)
     ===================== */
  async addStory(story) {
    if (!story || !story.id) return;

    const db = await dbPromise;
    return db.put(STORE_NAME, story);
  },

  /* =====================
     GET ALL STORIES
     (KODE LAMA)
     ===================== */
  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  /* =====================
     GET STORY BY ID
     ===================== */
  async getStoryById(id) {
    if (!id) return null;

    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },

  /* =====================
     DELETE STORY
     (KODE LAMA)
     ===================== */
  async deleteStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },

  /* =====================
     CLEAR ALL STORIES
     ===================== */
  async clearStories() {
    const db = await dbPromise;
    return db.clear(STORE_NAME);
  },

  /* =====================================================
     🔁 ALIAS METHOD (UNTUK KODE BARU)
     ❗ TIDAK MERUSAK SUBMISSION 1
     ===================================================== */

  // Untuk detail page & bookmark
  async save(story) {
    return this.addStory(story);
  },

  async getAll() {
    return this.getAllStories();
  },

  async get(id) {
    return this.getStoryById(id);
  },

  async delete(id) {
    return this.deleteStory(id);
  },
};

export default StoryIDB;
