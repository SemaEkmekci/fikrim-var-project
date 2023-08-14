import React, { Component } from "react";
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalHeader, Row, Col } from "reactstrap";
import { BiEdit } from "react-icons/bi";
import "../UserHomePage.css";

export default class SuperUserHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalUpdate: false,
      modalUnit: false,
      name : "",
      surname: "",
      email : "",
      password : "",
      confirmPassword : "",
      role: "unitManager",
      unit : "",
      mailVerification:false,
      userData:"",
      updateSelected: true,
      isInputDisabled:true,
      updateUserName:"",
      updateUserSurname:"",
      updateEmail:"",
      newUnit: "",
      unitOptions : []
    };
  }

  componentWillMount() {
    document.title = "Fikrim Var | Admin Panel";
    fetch("http://localhost:5000/homePage", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Acces-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.data == null){
          Swal.fire({
            text: 'Lütfen Tekrar Giriş Yapınız',
            icon: 'warning',
            confirmButtonColor: '#3085d6', 
          });
          window.location.href="./login";
        }
        if (data.status === "error") {
          window.location.href = "./login";
        } else if (data.data.role === "unitManager") {
          window.location.href = "./adminHomePage";
        } else if (data.data.mailVerification === false) {
          window.location.href = "./mailVerification";
        } else {
          console.log(data, "userHomePage");
          this.setState({ userData: data.data });
        }
      });

      fetch("http://localhost:5000/getUnit", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Acces-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "units");
          this.setState({ unitOptions: data.data }, () => {
            console.log(this.state.unitOptions, "unitOptions");
          });
        })
        .catch((error) => {
          console.error("Hata", error);
      });
  }

  updateUser = async (projectName) => {
    try {
      fetch("http://localhost:5000/updateUser", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          updatedUser: this.state.userData.email,
          userName: this.state.updateUserName || this.state.userData.userName,
          userSurname: this.state.updateUserSurname || this.state.userData.userSurname,
          email: this.state.updateEmail || this.state.userData.email,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Update User");
        if (data.status === "ok") {
          if(data.data === "true"){
            Swal.fire({
              text: 'Bilgileriniz Güncellendi. Lütfen tekrar giriş yapınız.',
              icon: 'success',
              confirmButtonColor: '#3085d6', 
            });
            window.localStorage.clear();
            window.location.href = "./login";
          }
        
        } 
        else if(data.error === "Mail Error"){
          Swal.fire({
            text: 'E-posta kullanılıyor.',
            icon: 'error',
            confirmButtonColor: '#3085d6', 
          });
        }
        else {
          Swal.fire({
            text: 'Güncelleme işlemi sırasında bir hata oluştu. Daha Sonra Tekrar Deneyin.',
            icon: 'error',
            confirmButtonColor: '#3085d6', 
          });
        }
      })
      .catch((error) => {
        console.error("Güncelleme sırasında bir hata oluştu:", error);
        // alert(error);
      });
    } catch (error) {
      console.error("Hata", error);
    }
  };


  handleSubmit = (e) => {
  e.preventDefault();
   const { name, surname, email, password, confirmPassword, unit, role} = this.state;
   if (password !== confirmPassword) {
    Swal.fire({
      text: 'Şifreler eşleşmiyor, lütfen aynı şifreyi girin.',
      icon: 'error',
      confirmButtonColor: '#3085d6', 
    });
   
     return;
   } else if (name === "" || surname === "" || email === "" || unit === "" || password === "" || confirmPassword === ""){
    Swal.fire({
      text: 'Lütfen boş alan bırakmayınız.',
      icon: 'warning',
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
       name: name,
       surname: surname,
       email: email,
       password: password,
       role: role,
       unit: unit,
       mailVerification: this.state.mailVerification
     }),
   }).then((res)=>res.json())
   .then((data) => {
     console.log(data,"userSignup");
     if(data.status === "ok"){
       this.setState({ modal: !this.state.modal })
       Swal.fire({
        text: 'Kayıt Başarılı',
        icon: 'success',
        confirmButtonColor: '#3085d6', 
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
       
     }else{
      Swal.fire({
        text: 'Mail adresi başka bir sorumlu tarafından kullanılıyor.',
        icon: 'warning',
        confirmButtonColor: '#3085d6', 
      });
     }
   })
}


unitSubmit = (e) => {
  e.preventDefault();
 const { newUnit } = this.state;
 
 if (newUnit === ""){
  Swal.fire({
    text: 'Lütfen Boş Alan Bırakmayınız.',
    icon: 'warning',
    confirmButtonColor: '#3085d6', 
  });
   return;
 }
 console.log(newUnit);
 fetch("http://localhost:5000/newUnit",{
   method:"POST",
   crossDomain:true,
   headers:{
     "Content-Type": "application/json",
     Accept:"application/json",
     "Access-Control-Allow-Origin":"*",
   },
   body: JSON.stringify({
      unitName: newUnit,
      unitManager: false
   }),
 }).then((res)=>res.json())
 .then((data) => {
   console.log(data,"newUnit");
   if(data.status === "ok"){
      this.setState({ modalUnit: !this.state.modal })
      Swal.fire({
        text: 'Ekleme Başarılı',
        icon: 'success',
        confirmButtonColor: '#3085d6', 
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
   }
   else{
    Swal.fire({
      text: 'Birim Zaten Kayıtlı',
      icon: 'error',
      confirmButtonColor: '#3085d6', 
    });
   }
 })


}
  
  handleMeetingCheckboxChange = () => {
    this.setState((prevState) => ({
    isUpdateSelected: !prevState.isUpdateSelected,
    isInputDisabled: !prevState.isUpdateSelected,
    datePlace: "",
    dateTime: "",
  }));
};


  logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  render() {
    const { modal, modalUpdate, modalUnit,userData, unitOptions} = this.state;

    return (
      <div className="home">
        <Modal
          size="lg"
          isOpen={modal}
          toggle={() => this.setState({ modal: !modal })}
          centered
        >
          <ModalHeader toggle={() => this.setState({ modal: !modal })}>
            Fikrim Var / Birim Sorumlusu Ekle
          </ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <Row>
                <Col lg={12}>
                  <div>
                  <select
                    className="form-control"
                    value={this.state.unit}
                    onChange={(e) => this.setState({ unit: e.target.value })}
                  >
                    <option value="" disabled>
                      Birim Seçin
                    </option>
                    {this.state.unitOptions.map((unit, index) => (
                      <option
                        value={unit.unitName}
                        disabled={unit.unitManager}
                      >
                        {unit.unitName}
                      </option>
                    ))}
                  </select>
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input
                      type="text"
                      className="form-control form-margin"
                      placeholder="Birim Sorumlusu Adı"
                      onChange={(e) =>
                        this.setState({ name: e.target.value })
                      }
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input
                      type="text"
                      className="form-control form-margin"
                      placeholder="Birim Sorumlusu Soyadı"
                      onChange={(e) =>
                        this.setState({ surname: e.target.value })
                      }
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input
                      className="form-control form-margin"
                      placeholder="Birim Sorumlusu E-Posta"
                      onChange={(e) =>
                        this.setState({ email: e.target.value })
                      }
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                <div >
                    <input className="form-control form-margin"
                      type="password"
                      placeholder="Şifre"
                      onChange={(e) => this.setState({ password: e.target.value })}
                      name="password"
                      required
                    />
                </div>
                <div>
                <input className="form-control form-margin"
                type="password" 
                placeholder="Şifre Tekrar" 
                name='confirmPassword' 
                onChange={e => this.setState({ confirmPassword: e.target.value })} 
                required />
              </div>
                </Col>
              </Row>
              <button
                className="button-form"
                type="submit"
                onClick={this.handleSubmit}
              >
                Birim Sorumlusu Ekle
              </button>
            </form>
          </ModalBody>
        </Modal>

  <Modal
          size="lg"
          isOpen={modalUpdate}
          toggle={() => this.setState({ modalUpdate: !modalUpdate })}
          style={{ maxWidth: "40%" }}
        >
          <ModalHeader
            toggle={() => this.setState({ modalUpdate: !modalUpdate })}
          >
            <button
            className="iconButton"
            onClick={this.handleMeetingCheckboxChange}
          >
            <BiEdit />
          </button>
        
          </ModalHeader>
          <ModalBody>
            <form onSubmit={this.updateUser}>
              <Row>
                <Col lg={12}>
                  <div></div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input
                      type="text"
                      className="form-control form-margin"
                      placeholder="İsim"
                      defaultValue={userData.userName}
                      disabled={this.state.isInputDisabled}
                      onChange={e=>this.setState({updateUserName:e.target.value})}
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input
                      type="text"
                      className="form-control form-margin"
                      placeholder="Soyisim"
                      defaultValue={userData.userSurname}
                      disabled={this.state.isInputDisabled}
                      onChange={e=>this.setState({updateUserSurname:e.target.value})}
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input
                      className="form-control form-margin"
                      placeholder="E-Posta"
                      defaultValue={userData.email}
                      disabled={this.state.isInputDisabled}
                      onChange={e=>this.setState({updateEmail:e.target.value})}
                      required
                    />
                  </div>
                </Col>
              </Row>
              <button
                className="button-form"
                type="submit"
                onClick={this.updateUser}
                disabled={this.state.isInputDisabled}
              >
                Güncelle
              </button>
            </form>
          </ModalBody>
        </Modal>

        <Modal
          size="lg"
          isOpen={modalUnit}
          toggle={() => this.setState({ modalUnit : !modalUnit })}
          style={{ maxWidth: "40%" }}
        >
          <ModalHeader
            toggle={() => this.setState({ modalUnit: !modalUnit })}
          >
            Fikrim Var / Birim Ekle
          </ModalHeader>
          <ModalBody>
            <form onSubmit={this.unitCreate}>
              <Row>
                <Col lg={12}>
                  <div></div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input
                      type="text"
                      className="form-control form-margin"
                      placeholder="Birim Adı"
                      onChange={e=>this.setState({newUnit:e.target.value})}
                      required
                    />
                  </div>
                </Col>
              </Row>
              <button
                className="button-form"
                type="submit"
                onClick={this.unitSubmit}
              >
                Birim Ekle
              </button>
            </form>
          </ModalBody>
        </Modal>

        <nav className="sidebar">
          <header>
            <div className="image-text">
              <a className="logo" href="https://kapsulteknoloji.org">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 67.6 74.87"
                  stroke="currentColor"
                  fill="#005eb1"
                  className="h-full w-full drop-shadow-xl"
                >
                  <path d="M67.6 0H44.06s-4.78.41-7.76 4.86c-2.98 4.45-13.88 20.88-13.88 20.88l-5.8-8.85H.14S3.4 27.84 3.81 29.41c.41 1.58 1.23 4.51 1.4 5.47.09.44 1.13 4.91 1.23 7.88 0 .76.28 6.55-.4 10.4-.28 1.43-.45 4.45-2.85 11.43C1.43 70.35 0 74.84 0 74.84h12.05s4.92-.51 7.62-4.54c.79-1.2 10.71-15.75 10.71-15.75l7.31 11.06h-9.23l-6.3 9.27h32.41L35.94 46.43 67.6 0ZM12.85 64.02c1.11-3.09 1.9-8.06 2.09-9.44 2.12-14.2-2.33-27.11-2.33-27.11l9.68 14.73S43.19 11 43.78 10.11c.59-.88 1.2-.8 1.2-.8h5.29S13.31 63.55 12.85 64.02"></path>
                </svg>
              </a>

              <div className="text header-text">
                <span className="name"> Fikrim Var </span>
                <span className="platform"> Kapsül Teknoloji Platformu </span>
              </div>
            </div>
          </header>

          <div className="menu-bar">
          <div className="menu">
              <li className="nav-link">
                <a className="text nav-text button" href="UnitManagers">
                  Birim Sorumluları
                </a>
              </li>
            </div>
            <div className="bottom-content">
              <li className="nav-link">
                <a onClick={this.logOut} className="text nav-text button">
                  Çıkış Yap
                </a>
              </li>
              <li className="nav-link profile-details profile">
                <a
                  onClick={() => this.setState({ modalUpdate: true })}
                  className="text nav-text button profile-name"
                >
                  {this.state.userData.userName}{" "}
                  {this.state.userData.userSurname}
                </a>
              </li>
            </div>
          </div>
        </nav>

        <div className="flex-parent jc-center">
          <button
            className="buttonapp"
            onClick={() => this.setState({ modal: true })}
          >
            Birim Sorumlusu Ekle
          </button>
          <button
            className="buttonapp"
            onClick={() => this.setState({ modalUnit: true })}
          >
            Birim Ekle
          </button>
        </div>
      </div>
    );
  }
}
