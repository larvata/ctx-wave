import { WAVE_EVENTS, API_URL } from './common/constants';
import { fetchJSON } from './common/utils';

function messageAddListener(eventName, callback) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { event } = request;
    if (event !== eventName) {
      return false;
    }
    return callback(request, sender, sendResponse);
  });
}


const saveAndSendResponse = (key, data, sendResponse) => {
  chrome.storage.local.set({
    [key]: data,
  }, () => {
    sendResponse(data);
  });
};

messageAddListener(WAVE_EVENTS.REFRESH, (request, sender, sendResponse) => {
  /* method 1
  chrome.storage.local.get('profile', async (response) => {
    let { profile } = response;
    if (!profile) {
      const { success, data } = await fetchJSON(API_URL.CLIENT_ME);
      if (!success) {
        saveAndSendResponse('profile', profile, sendResponse);
        return;
      }
      profile = data.client;
    }

    const { username } = profile;
    const { success, data } = await fetchJSON(`${API_URL.CLIENT}/${username}`);
    if (success) {
      profile.events = data.client.events;
    }
    saveAndSendResponse('profile', profile, sendResponse);
  });
  */

  // method 2
  let profile = null;
  fetchJSON(API_URL.CLIENT_ME).then(({ success, data }) => {
    if (!success) {
      saveAndSendResponse('profile', null, sendResponse);
      return Promise.resolve();
    }

    profile = data.client;
    return fetchJSON(`${API_URL.CLIENT}/${data.client.username}`)
      .then(({ success, data }) => {
        if (!success) {
          saveAndSendResponse('profile', null, sendResponse);
          return;
        }

        profile.events = data.client.events;
        saveAndSendResponse('profile', profile, sendResponse);
      });
  });
  return true;
});

messageAddListener(WAVE_EVENTS.GET_PROFILE, (request, sender, sendResponse) => {
  chrome.storage.local.get('profile', (response) => {
    sendResponse(response.profile);
  });
  return true;
});
