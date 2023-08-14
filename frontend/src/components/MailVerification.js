import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Login.css';

export default class MailVerification extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    document.title = 'Mail Doğrulama';
  }

  handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
    fetch("http://localhost:5000/mailVerification", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "error") {
          Swal.fire({
            text: 'Kullanıcı Bulunamadı Kayıt Olunuz.',
            icon: 'error',
            confirmButtonColor: '#3085d6', 
          });
          window.location.href="./signup";
        }else{
          Swal.fire({
            text: 'Mailinize gelen linke tıklayarak mailinizi doğrulayabilirsiniz.Spamı kontrol etmeyi unutmayın',
            icon: 'info',
            confirmButtonColor: '#3085d6', 
          });
        }
      })}
      else{
        Swal.fire({
          text: 'Önce Giriş Yapınız',
          icon: 'info',
          confirmButtonColor: '#3085d6', 
        });
        window.location.href="./login";
      }
  }
  render() {
    return (
      <section className="home">
        <div className="form_container">
          <i className="uil uil-times"></i>
          <div className="form login_form">
            <form onSubmit={this.handleSubmit}>
              <h2>Mail Doğrulama</h2>
              <button type="submit" className="button">
                Aktivasyon Linki Gönder
              </button>
              <div className="login_signup">
                Hesabınız yok mu?
                <Link to="/signup">
                  <br /> Hesap Oluştur
                </Link>
              </div>
              <div className="forgotPassword">
                <Link to="/login">
                  Giriş Yap
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}
