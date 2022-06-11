import { useRef, useState, useEffect } from 'react';
import Mercury from '@postlight/mercury-parser';
import moment from 'moment';
import {
  Input,
  Button,
  Select,
  DatePicker,
  message,
} from 'antd';

import { fetchJSON } from '../../common/utils';
import {
  WAVE_EVENTS,
  PAGE_URL,
  API_URL,
} from '../../common/constants';
import Link from '../Link';

message.config({
  top: 60,
});

function setSubmitMessage(level, content) {
  message[level]({
    key: 'submit-message',
    content,
  });
}

function LoginContent() {
  return (
    <div className="login">
      <Link className="button primary" href={PAGE_URL.LOGIN}>
        <Button type="primary">
          {chrome.i18n.getMessage('UI_Login_Button')}
        </Button>
      </Link>
      <style jsx="true">
        {`
          .login {
            text-align: center;
            margin: 20px;
          }
          .login .button {
            padding: 10px;
          }
        `}
      </style>
    </div>
  );
}

function MainContent(props) {
  const [newsContent, setNewsContent] = useState({
    url: '',
    title: '',
    abstract: '',
    time: moment(),
    source: '',
    comment: '',
  });
  const [profile, setProfile] = useState(props.profile);
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
                time: result.date_published ? moment(result.date_published) : moment(),
                source: result.domain,
              },
            });
          });
        },
      );
    });

    // reload event list from langchao.org
    chrome.runtime.sendMessage(
      {
        event: WAVE_EVENTS.REFRESH,
      },
      (response) => {
        setProfile(response);
      },
    );
  }, []);

  if (!profile) {
    return <LoginContent />;
  }

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

export default MainContent;
