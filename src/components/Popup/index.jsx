import { createRoot } from 'react-dom';
import { useState, useEffect } from 'react';

import Header from './Header';
import MainContent from './MainContent';
import ErrorContent from './ErrorContent';
import Footer from './Footer';
import {
  WAVE_EVENTS,
} from '../../common/constants';
import { setGlobalVariables } from '../../common/utils';

setGlobalVariables();

function Popup(props) {
  const [profile, setProfile] = useState(props.profile);

  useEffect(() => {
    browser.runtime.sendMessage(
      {
        event: WAVE_EVENTS.REFRESH,
      },
      (response) => {
        setProfile(response);
      },
    );
  }, []);

  let content = null;
  if (!profile || !profile.events) {
    content = <ErrorContent showLogin={true} />;
  } else if (!profile.events.length) {
    content = <ErrorContent showHome={true} />;
  } else {
    content = <MainContent profile={profile} />;
  }

  return (
    <div className="popup">
      <Header />
      {content}
      <Footer />
      <style jsx="true">
        {`
          html {
          }

          body {
            width: 300px;
            margin: 0;
            background-color: #f6f8fa;
          }

          .card {
            max-width: 45rem;
            width: 100%;
            display: block;
            margin-bottom: 0.5rem;
            border-radius: 0.5rem;
            z-index: 1000;
            transition: all.2s;
            background-color: #fff;
            box-shadow: 0 2.5px 7.5px rgb(0 0 0 / 4%);
          }
          .container {
            padding: 0.5rem;
          }

          label {
            font-size: 14px;
            margin-bottom: 2px;
            display: inline-block;
          }

          .row {
            margin: 0 0 10px;
          }
          .row:last-child {
            margin-bottom: 0;
          }
        `}
      </style>
    </div>
  );
}

browser.runtime.sendMessage(
  {
    event: WAVE_EVENTS.GET_PROFILE,
  },
  (profile) => {
    const root = createRoot(document.getElementById('root'));
    root.render(<Popup profile={profile} />);
  },
);
