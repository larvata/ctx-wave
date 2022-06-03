import { createRoot } from 'react-dom/client';

import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';
import {
  WAVE_EVENTS,
} from '../../common/constants';

function Popup(props) {
  return (
    <div className="popup">
      <Header />
      <MainContent {...props} />
      <Footer />
      <style jsx="true">
        {`
          html {
            width: 300px;
          }

          body {
            margin: 0;
            background-color: #f6f8fa;
          }

          .icon {
            padding: 5px;
            cursor:pointer;
            border-radius: 50%;
          }
          .icon:hover {
            background-color: rgba(0,0,0,.075);
          }
          .logo {
            width: 28px;
            height: 28px;
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

          .button {
            cursor: pointer;
            padding: 6px 15px;
            font-size: 14px;
            border-radius: 2px;
            color: rgba(0,0,0,.85);
            border: 1px solid #d9d9d9;
            background: #fff;
            transition: all .3s cubic-bezier(.645,.045,.355,1);
          }
          .button.primary {
            color: #fff;
            border-color: #1890ff;
            background: #1890ff;
            text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
            box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
          }
          .button.primary:focus,
          .button.primary:hover {
              color: #fff;
              border-color: #40a9ff;
              background: #40a9ff;
          }

          input {
            font-size: 14px;
            line-height: 1.5715;
            width: 100%;
            padding: 4px 11px;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            box-sizing: border-box;
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

chrome.runtime.sendMessage(
  {
    event: WAVE_EVENTS.GET_PROFILE,
  },
  (response) => {
    console.log('Before Popup First Rendering:', response);
    const root = createRoot(document.getElementById('root'));
    root.render(<Popup profile={response} />);
  },
);
