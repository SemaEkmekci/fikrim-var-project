import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Login.css';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    document.title = 'Şifremi Unuttum';
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email } = this.state;
  
    fetch("http://localhost:5000/forgotPassword", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "error") {
          Swal.fire({
            text: 'Kullanıcı Bulunamadı.',
            icon: 'error',
            confirmButtonColor: '#3085d6', 
          });
          
        }else{
          Swal.fire({
            text: 'Mailinize gelen linke tıklayarak şifrenizi güncelleyebilirsiniz.Spamı kontrol etmeyi unutmayın',
            icon: 'info',
            confirmButtonColor: '#3085d6', 
          });
          
        }
      })
  }
  render() {
    return (
      <section className="home">
        <div className="form_container">
          <i className="uil uil-times"></i>
          <div className="form login_form">
            <form onSubmit={this.handleSubmit}>
              <h2>Parola Sıfırla</h2>
              <div className="input_box">
                <input
                  type="email"
                  placeholder="E-Posta"
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                  name="email"
                />
              </div>
              <button type="submit" className="button">
                Gönder
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
