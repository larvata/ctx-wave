import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Mercury from 'mercury-parser';
import dayjs from 'dayjs';
import {
  Input,
  Button,
  Select,
  message,
} from 'antd';

import { fetchJSON } from '../../common/utils';
import { API_URL } from '../../common/constants';
import DatePicker from '../DatePicker';

message.config({
  top: 60,
});

function setSubmitMessage(level, content) {
  message[level]({
    key: 'submit-message',
    content,
  });
}

function MainContent(props) {
  const [newsContent, setNewsContent] = useState({
    url: '',
    title: '',
    abstract: '',
    time: dayjs(),
    source: '',
    comment: '',
  });

  const { profile } = props;
  const [submitting, setSubmitting] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(profile.events[0].id);
  const mainContentRef = useRef(null);

  useEffect(() => {
    // extract content from current tab
    chrome.tabs.query({
      active: true,
      currentWindow: true,
    }).then((tabs) => {
      const [tab] = tabs;
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => ({
            html: document.documentElement.innerHTML,
          }),
        },
        ([htmlResult]) => {
          Mercury.parse(tab.url, {
            html: htmlResult.result.html,
          }).then((result) => {
            // extract new content
            setNewsContent({
              ...newsContent,
              ...{
                url: result.url,
                title: result.title,
                abstract: result.excerpt.slice(0, 200),
                time: result.date_published ? dayjs(result.date_published) : dayjs(),
                source: result.domain,
              },
            });
          });
        },
      );
    });
  }, []);

  const onSubmitClick = () => {
    setSubmitting(true);

    const body = {
      ...newsContent,
      time: newsContent.time.format(),
    };
    fetchJSON(`${API_URL.EVENT}/${selectedEventId}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.status === 201) {
        // success
        setSubmitMessage('info', res.message);
        return;
      }
      setSubmitMessage('error', res.message);
    }).catch((e) => {
      setSubmitMessage('error', e.message);
    }).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <div className="content" ref={mainContentRef}>
      <div className="card">
        <div className="container">

          <div className="row">
            <label htmlFor="url">
              {chrome.i18n.getMessage('Stack_Form_Title')}
            </label>
            <Input
              id="url"
              value={newsContent.title}
              onChange={(evt) => {
                newsContent.url = evt.target.value;
                setNewsContent({ ...newsContent });
              }}
            />
          </div>

          <div className="row">
            <label htmlFor="abstract">
              {chrome.i18n.getMessage('Stack_Form_Description')}
            </label>
            <Input
              id="abstract"
              value={newsContent.abstract}
              onChange={(evt) => {
                newsContent.abstract = evt.target.value;
                setNewsContent({ ...newsContent });
              }}
            />
          </div>

          <div className="row">
            <label htmlFor="date">
              {chrome.i18n.getMessage('Stack_Form_Time')}
            </label>
            <DatePicker
              style={{ width: '100%' }}
              onChange={(newDate) => {
                newsContent.time = newDate;
                setNewsContent({ ...newsContent });
              }}
              value={newsContent.time}
            />
          </div>

          <div className="row">
            <label htmlFor="comment">
              {chrome.i18n.getMessage('Stack_Form_Comment')}
            </label>
            <Input
              id="comment"
              value={newsContent.comment}
              onChange={(evt) => {
                newsContent.comment = evt.target.value;
                setNewsContent({ ...newsContent });
              }}
            />
          </div>

          <div className="row">
            <label htmlFor="events">
              {chrome.i18n.getMessage('Stack_Form_RelatedTimeline')}
            </label>
            <Select
              id="events"
              style={{ width: '100%' }}
              defaultValue={profile.events[0].id}
              value={selectedEventId}
              onChange={setSelectedEventId}
            >
              {
                profile.events.map((evt) => (
                  <Select.Option key={evt.id} value={evt.id}>{evt.name}</Select.Option>
                ))
              }
            </Select>
          </div>

          <div className="row">
            <Button
              type="primary"
              loading={submitting}
              onClick={onSubmitClick}
            >
              {chrome.i18n.getMessage('UI_Add_To_Event_Button')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

MainContent.propTypes = {
  profile: PropTypes.shape({
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default MainContent;
