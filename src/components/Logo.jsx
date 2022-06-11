import { PAGE_URL } from '../common/constants';
import Link from './Link';
import iconLogo from '../public/images/icon.svg';

function Logo() {
  return (
    <Link className="logo" href={PAGE_URL.HOME}>
      <img
        alt="logo-icon"
        className="icon"
        src={iconLogo}
      />
      <style jsx="true">
        {`
          .logo {
            border-radius: 50%;
            display: inline-block;
            padding: 0.45rem;
          }

          .logo:hover {
            background-color: rgba(0,0,0,.075);
          }

          .icon {
            width: 28px;
            height: 28px;
          }
        `}
      </style>
    </Link>
  );
}

export default Logo;
