import { PAGE_URL } from '../../common/constants';
import Link from '../Link';
import iconLogo from '../../public/images/icon.svg';

function Footer() {
  return (
    <div className="footer">
      <div className="logo-container">
        <Link href={PAGE_URL.HOME}>
          <img alt="logo-icon" className="icon logo" src={iconLogo} />
        </Link>
      </div>
      <div className="content">
        <div>
          <Link href={PAGE_URL.ABOUT}>
            {chrome.i18n.getMessage('Footer_About')}
          </Link>
          <span>·</span>
          <Link href={PAGE_URL.GITHUB}>
            {chrome.i18n.getMessage('Footer_Participate')}
          </Link>
        </div>
        <div>
          <Link href={PAGE_URL.TWITTER}>
            {chrome.i18n.getMessage('Share_Site_Twitter')}
          </Link>
          <span>·</span>
          <Link href={PAGE_URL.WEIBO}>
            {chrome.i18n.getMessage('Share_Site_Weibo')}
          </Link>
          <span>·</span>
          <Link href={PAGE_URL.TELEGRAM}>
            {chrome.i18n.getMessage('Share_Site_Telegram')}
          </Link>
        </div>

        <span>{`Langchao.org ${new Date().getFullYear()}`}</span>
      </div>

      <style jsx="true">
        {`
          .footer {
            text-align: center;
            font-size: 0.8rem;
            margin: 1rem 0 1rem 0;
          }

          a, span {
            line-height: 1.75;
            color: #586069;
            text-decoration: none;
            margin-right: 0.25rem;
          }
        `}
      </style>
    </div>
  );
}

export default Footer;
