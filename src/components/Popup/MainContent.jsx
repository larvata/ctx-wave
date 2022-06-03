import { useRef, useState, useEffect } from 'react';
import Mercury from '@postlight/mercury-parser';
import * as dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { fetchJSON } from '../../common/utils';
import {
  WAVE_EVENTS,
  PAGE_URL,
  API_URL,
} from '../../common/constants';
import Link from '../Link';


function LoginContent() {
  return (
    <div className="login">
      <Link className="button primary" href={PAGE_URL.LOGIN}>
        {chrome.i18n.getMessage('UI_Login_Button')}
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
    time: new Date().toISOString(),
    source: '',
    comment: '',
  });
  const [profile, setProfile] = useState(props.profile);
  const [fetchMessage, setFetchMessage] = useState('');
  const dropdownRef = useRef(null);

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
                time: result.date_published || new Date().toISOString(),
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

  const dropdownOptions = profile.events.map((evt) => ({
    value: evt.id,
    label: evt.name,
  }));

  return (
    <div className="content">
      <div className="card">
        <div className="container">

          <div className="row">
            <label htmlFor="url">
              {chrome.i18n.getMessage('Stack_Form_Title')}
            </label>
            <input
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
            <input
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
              id="date"
              selected={dayjs(newsContent.time).toDate()}
              onChange={(newDate) => {
                newsContent.time = dayjs(newDate).format();
                setNewsContent({ ...newsContent });
              }}
            />
          </div>

          <div className="row">
            <label htmlFor="comment">
              {chrome.i18n.getMessage('Stack_Form_Comment')}
            </label>
            <input
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
            <Dropdown
              id="events"
              ref={dropdownRef}
              options={dropdownOptions}
              value={dropdownOptions[0]}
            />
          </div>

          <div className="row">
            <button
              type="button"
              className="button primary"
              onClick={() => {
                const eventId = dropdownRef.current.state.selected.value;
                setFetchMessage('');
                fetchJSON(`${API_URL.EVENT}/${eventId}/news`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newsContent),
                }).then((res) => {
                  if (!res.success) {
                    setFetchMessage(res.message);
                  }
                }).catch((e) => {
                  setFetchMessage(e.message);
                });
              }}
            >
              {chrome.i18n.getMessage('UI_Add_To_Event_Button')}
            </button>
          </div>

          <div className="row">
            <div className={`message ${fetchMessage ? '' : 'hidden'}`}>
            {fetchMessage}
            </div>
          </div>
        </div>
      </div>
      <style jsx="true">
        {`
          .Dropdown-control {
            padding: 4px 11px;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
          }

          .Dropdown-placeholder,
          .Dropdown-option {
            font-size: 14px;
            line-height: 1.5715;
          }

          .Dropdown-option:is-selected,
          .Dropdown-option:hover {
            background-color: #91d5ff;
          }

          .Dropdown-menu {
            border-radius: 2px;
          }

          .message {
            color: #cf1322;
            background: #fff1f0;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            border-color: #ffa39e;
            padding: 2px;
            overflow: hidden;
            height: 20px;
            line-height: 20px;
            white-space: nowrap;
          }

          .message.hidden {
            visibility: hidden;
          }
        `}
      </style>
    </div>
  );
}

export default MainContent;
