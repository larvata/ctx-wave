import { PAGE_URL } from '../../common/constants';
import Link from '../Link';
import iconLogo from '../../public/images/icon.svg';

function Header() {
  return (
    <div className="header">
      <Link className="left" href={PAGE_URL.HOME}>
        <img alt="logo" className="icon logo" src={iconLogo} />
      </Link>
      <style jsx="true">
        {`
          .header {
            padding: 10px 10px 0px 5px;
            margin: 0 0 5px;
            background-color: #fff;
            border-bottom: 1px solid rgba(0,0,0,.05);
            box-shadow: 0 4px 4px rgb(0 0 0 / 1%);
          }
        `}
      </style>
    </div>
  );
}

export default Header;
