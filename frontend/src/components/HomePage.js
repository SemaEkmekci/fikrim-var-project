import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../HomePage.css';

export default class Login extends Component {
  componentDidMount() {
    document.title = 'Fikrim Var | Ana Sayfa';
  }

  render() {
    return (
        <div>
        
      <div className='bgTop'>
      <div>
        <nav className="navbar navbarHomePage navbar-expand-lg navbar-light bg-transparent"> 
            <div className="image-text">
              <a className="logo" href="https://kapsulteknoloji.org">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 67.6 74.87"
                  stroke="currentColor"
                  fill="#005eb1"
                  className="logoSvg"
                >
                  <path d="M67.6 0H44.06s-4.78.41-7.76 4.86c-2.98 4.45-13.88 20.88-13.88 20.88l-5.8-8.85H.14S3.4 27.84 3.81 29.41c.41 1.58 1.23 4.51 1.4 5.47.09.44 1.13 4.91 1.23 7.88 0 .76.28 6.55-.4 10.4-.28 1.43-.45 4.45-2.85 11.43C1.43 70.35 0 74.84 0 74.84h12.05s4.92-.51 7.62-4.54c.79-1.2 10.71-15.75 10.71-15.75l7.31 11.06h-9.23l-6.3 9.27h32.41L35.94 46.43 67.6 0ZM12.85 64.02c1.11-3.09 1.9-8.06 2.09-9.44 2.12-14.2-2.33-27.11-2.33-27.11l9.68 14.73S43.19 11 43.78 10.11c.59-.88 1.2-.8 1.2-.8h5.29S13.31 63.55 12.85 64.02"></path>
                </svg>
              </a>
              <div className="header-text ">
                <span className="name"> Fikrim Var </span>
              </div>
            </div>
            <div className="collapse navbar-collapse navbarHomePageLink" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                <Link to="/login" className='nav-link'>
                  Giriş Yap
                </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className='nav-link'>
                  Hesap Oluştur
                </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="homePage">
            <div className='centeredText'>
                <span>Fikrim Var <br/> Projesi ile Fikrinizi Paylaşın</span>
            </div>
        </div>
      </div>
      </div>
    );
  }
}


