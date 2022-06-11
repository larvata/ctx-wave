import Logo from '../Logo';

function Header() {
  return (
    <div className="header">
      <Logo />
      <style jsx="true">
        {`
          .header {
            padding: 5px;
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
