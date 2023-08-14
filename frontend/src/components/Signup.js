import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


export default class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            name : "",
            surname: "",
            email : "",
            password : "",
            confirmPassword : "",
            role: "user",
            mailVerification:false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (e) => {
         e.preventDefault();
        const { name, surname, email, password, confirmPassword, mailVerification } = this.state;
        if (password !== confirmPassword) {
          Swal.fire({
            text: 'Şifreler Eşleşmiyor. Lütfen Aynı Şifreyi Girin',
            icon: 'error',
            confirmButtonColor: '#3085d6', 
          });
          return;
        }
        console.log(name, surname, email, password);
        fetch("http://localhost:5000/signup",{
          method:"POST",
          crossDomain:true,
          headers:{
            "Content-Type": "application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
          },
          body: JSON.stringify({
            name: this.state.name,
            surname: this.state.surname,
            email: this.state.email,
            password: this.state.password,
            role: this.state.role,
            mailVerification: this.state.mailVerification
          }),
        }).then((res)=>res.json())
        .then((data) => {
          console.log(data,"userSignup");
          if(data.status === "ok"){
            Swal.fire({
              text: 'Kayıt Başarılı',
              icon: 'success',
              confirmButtonColor: '#3085d6', 
            });
            window.location.href="./login";
          }
        })
}

  render() {
    return (
        <section className="home">
        <div className="form_container">
          <div className="form signup_form">
            <form onSubmit={this.handleSubmit}>
              <h2>Kayıt Ol</h2>
              <div className="input_box">
                <input type="text" placeholder="Ad" name='name' onChange={e=>this.setState({name:e.target.value})} required />
                
              </div>
              <div className="input_box">
                <input type="text" placeholder="Soyad" name='surname' onChange={e=>this.setState({surname:e.target.value})} required />
                
              </div>
              <div className="input_box">
                <input type="email" placeholder="E-Posta" name='email' onChange={e=>this.setState({email:e.target.value})} required />
              </div>
              <div className="input_box">
                <input type="password" placeholder="Şifre" name='password' onChange={e=>this.setState({password:e.target.value})} required />
              </div>
              <div className="input_box">
                <input type="password" placeholder="Şifre Tekrar" name='confirmPassword' onChange={e => this.setState({ confirmPassword: e.target.value })} required />
              </div>
    
              <button type='submit' className="button">Hesap Oluştur</button>
    
              <div className='login_signup'>
                Zaten hesabınız var mı?
                <Link to="/login" > <br/> Giriş Yap </Link>
                </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}
