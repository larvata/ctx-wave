import { PAGE_URL } from '../../common/constants';
import Link from '../Link';
import Logo from '../Logo';

function Footer() {
  return (
    <div className="footer">
      <Logo />
      <div className="content">
        <div>
          <Link href={PAGE_URL.ABOUT}>
            {chrome.i18n.getMessage('Footer_About')}
          </Link>
          <span>·</span>
          <Link href={PAGE_URL.FEEDBACK}>
            {chrome.i18n.getMessage('Footer_Feedback')}
          </Link>
        </div>
        <span>{`Langchao.org ${new Date().getFullYear()}`}</span>
      </div>

      <style jsx="true">
        {`
          .footer {
            text-align: center;
            font-size: 0.8rem;
            padding: 1rem;
          }

          .footer a,
          .footer span {
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
