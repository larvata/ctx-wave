import Logo from '../Logo';

function Header() {
  return (
    <div className="header">
      <Logo />
      <span className="title">
        {browser.i18n.getMessage('extension_name')}
      </span>
      <style jsx="true">
        {`
          .header {
            padding: 5px;
            margin: 0 0 5px;
            background-color: #fff;
            border-bottom: 1px solid rgba(0,0,0,.05);
            box-shadow: 0 4px 4px rgb(0 0 0 / 1%);
          }
          .header .title {
            line-height: 2;
            font-size: 1rem;
            vertical-align: middle;
          }
        `}
      </style>
    </div>
  );
}

export default Header;
