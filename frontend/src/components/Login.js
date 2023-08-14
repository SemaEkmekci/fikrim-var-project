import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Login.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    window.localStorage.clear();
    document.title = 'Giriş Yap';
  }

  handleSubmit(e) {    
    e.preventDefault();
    const { email, password } = this.state;
    console.log(email, password);
    fetch("http://localhost:5000/login", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userLogin");
        console.log(data.role);
        if (data.status === "ok") {
          Swal.fire({
            text: 'Giriş Başarılı',
            icon: 'success',
            confirmButtonColor: '#3085d6', 
          }).then(() => {
          window.localStorage.setItem("token", data.data);
          if (data.role === "user") {
            window.location.href = "./userHomePage";
          } else if (data.role === "unitManager") {
            window.location.href = "./adminHomePage";
          } else if(data.role === "superUser"){
            window.location.href = "./superUserPage";
          } else {
            console.log("Bilinmeyen rol veya rol belirtilmemiş");
          }  });
        } else {
          Swal.fire({
            text: 'Kullanıcı Bulunamadı',
            icon: 'error',
            confirmButtonColor: '#3085d6', 
          });
        
        }
       
      });
  }

  render() {
    return (
      <section className="home">
        <div className="form_container">
          <i className="uil uil-times"></i>
          <div className="form login_form">
            <form action="#" onSubmit={this.handleSubmit}>
              <h2>Giriş Yap</h2>
              <div className="input_box">
                <input
                  type="email"
                  placeholder="E-Posta"
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                  name="email"
                />
              </div>
              <div className="input_box">
                <input
                  type="password"
                  placeholder="Şifre"
                  onChange={(e) => this.setState({ password: e.target.value })}
                  name="password"
                  required
                />
              </div>

              <button type="submit" className="button">
                Giriş Yap
              </button>
              <div className="login_signup">
                Hesabınız yok mu?
                <Link to="/signup">
                  <br /> Hesap Oluştur
                </Link>
              </div>
              <div className="forgotPassword">
                <Link to="/forgotPassword">
                  Şifremi Unuttum
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}
