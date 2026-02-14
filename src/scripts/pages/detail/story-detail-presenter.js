export default class StoryDetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #dbModel;
  #token;

  constructor(storyId, { view, apiModel, dbModel, token }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
    this.#token = token;
  }

  /* ===============================
     LOAD & TAMPILKAN DETAIL STORY
     =============================== */
  async showStoryDetail() {
    try {
      const response = await this.#apiModel.getStoryDetail(
        this.#storyId,
        this.#token
      );

      this.#view.renderStory(response.story);
      await this.showSaveButton();
    } catch (error) {
      console.error('showStoryDetail:', error);
      this.#view.renderError('Gagal memuat detail story');
    }
  }

  /* ===============================
     SIMPAN STORY KE INDEXEDDB
     =============================== */
  async saveStory() {
    try {
      const response = await this.#apiModel.getStoryDetail(
        this.#storyId,
        this.#token
      );

      await this.#dbModel.addStory(response.story);
      this.#view.saveSuccess();

      await this.showSaveButton();
    } catch (error) {
      console.error('saveStory:', error);
      this.#view.saveFailed('Gagal menyimpan story');
    }
  }

  /* ===============================
     HAPUS STORY DARI INDEXEDDB
     =============================== */
  async removeStory() {
    try {
      await this.#dbModel.deleteStory(this.#storyId);
      this.#view.removeSuccess();

      await this.showSaveButton();
    } catch (error) {
      console.error('removeStory:', error);
      this.#view.removeFailed('Gagal menghapus story');
    }
  }

  /* ===============================
     ATUR TOMBOL SIMPAN / HAPUS
     =============================== */
  async showSaveButton() {
    if (await this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }

  /* ===============================
     CEK STORY DI INDEXEDDB
     =============================== */
  async #isStorySaved() {
    const story = await this.#dbModel.getStoryById(this.#storyId);
    return !!story;
  }
}
