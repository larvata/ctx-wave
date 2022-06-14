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
  let profile = null;

  // get login status
  fetchJSON(API_URL.CLIENT_ME).then(({ success, data }) => {
    if (!success) {
      saveAndSendResponse('profile', profile, sendResponse);
      return Promise.resolve();
    }

    // get event list
    profile = data.client;
    return fetchJSON(`${API_URL.CLIENT}/${data.client.username}`)
      .then(({ success: _success, data: _data }) => {
        if (!_success) {
          saveAndSendResponse('profile', profile, sendResponse);
          return;
        }

        profile.events = _data.client.events;
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
