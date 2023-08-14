import React, { Component } from 'react'; 
import { Modal, ModalBody, ModalHeader, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';

import { BiEdit } from "react-icons/bi";
import '../AdminHomePage.css';

export default class AdminHomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalUpdate: false,
      userData:"",
      unit:"",
      projectName:"",
      projectPurpose:"",
      projectDetails:"",
      image:"",
      date:"",
      status:false,
      isUpdateSelected: true,
      isInputDisabled:true,
      updateUserName:"",
      updateUserSurname:"",
      updateEmail:"",
      unitOptions:[]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentWillMount() {
    document.title = 'Fikrim Var';
    fetch("http://localhost:5000/homePage",{
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept:"application/json",
        "Acces-Control-Allow-Origin":"*",
      },
      body: JSON.stringify({
          token:window.localStorage.getItem("token"),
      }),
    })
    .then((res)=> res.json())
    .then((data) => {
      console.log(data);
      if(data.data == null){
        Swal.fire({
          text: 'Lütfen Tekrar Giriş Yapınız.',
          icon: 'warning',
          confirmButtonColor: '#3085d6',
        });
        window.location.href="./login";
      }
      if(data.status === "error" ){
        window.location.href="./login";
      } else if(data.data.role === "user"){
        window.location.href="./userHomePage";
      } else if(data.data.role === "superUser"){
        window.location.href = "./superUserPage";
      } else if(data.data.mailVerification === false){
        window.location.href="./mailVerification";
      } else{
        console.log(data,"userHomePage");
        this.setState({userData:data.data});
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

  convertToBase64 = (e) => {
    console.log(e);
    
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      this.setState({ image: reader.result });
      console.log(this.state.image)
    };
    reader.onerror = error => {
      console.log("Error", error);
    };
  }
  
  handleSubmit = (e) => {

    e.preventDefault();
    
    const { unit, projectName, projectPurpose, projectDetails, image } = this.state;
    if(unit==""){
      Swal.fire({
        text: 'Lütfen Birim Seçin.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
     
      return;
    }
    if(projectName==="" || projectPurpose === "" || projectDetails === ""){
      Swal.fire({
        text: 'Lütfen Boş Alan Bırakmayınız.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0].split('-').reverse().join('-');
    console.log(unit, projectName, projectPurpose,projectDetails,image, formattedDate);
    fetch("http://localhost:5000/projectInfo", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        name: this.state.userData.userName,
        surname: this.state.userData.userSurname,
        email: this.state.userData.email,
        unit: this.state.unit,
        projectName: this.state.projectName,
        projectPurpose: this.state.projectPurpose,
        projectDetails: this.state.projectDetails,
        image: this.state.image,
        date: formattedDate,
        status: this.state.status
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      
      console.log(data, "projectInfo");
      if (data.status === "ok") {
        this.setState({ modal: !this.state.modal })
        Swal.fire({
          text: 'Proje Gönderildi.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
        
      
      } else {
        Swal.fire({
          text: 'Aynı Proje İsmine Sahip Başka Bir Proje Var. Projeniz Gönderilmedi.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
        
      }
    })
    .catch((error) => {
      console.error("Proje gönderme işlemi sırasında bir hata oluştu:", error);
      Swal.fire({
        text: 'Dosya Boyutu Daha Küçük Bir Resim Yükleyin',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    });
  };

  handleMeetingCheckboxChange = () => {
    this.setState((prevState) => ({
      isUpdateSelected: !prevState.isUpdateSelected,
      isInputDisabled: !prevState.isUpdateSelected,
      datePlace: "",
      dateTime: "",
    }));
  };



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
            text: 'E-Posta Kullanılıyor.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
          });
        }
        else {
          Swal.fire({
            text: 'Güncelleme İşlemi Sırasında Bir Hata Oluştu.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
          });
        }
      })
      .catch((error) => {
        console.error("Güncelleme sırasında bir oluştu:", error);
        // alert(error);
      });
    } catch (error) {
      console.error("Hata", error);
    }
  };
  
  
  

  logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  render() {
    const { modal,modalUpdate, userData } = this.state;

    return (
      <div className='home'>
        <Modal
          size='lg'
          isOpen={modal}
          toggle={() => this.setState({ modal: !modal })}
          centered
        >
          <ModalHeader
            toggle={() => this.setState({ modal: !modal })}
          >
            Fikrim Var / Başvuru Yap
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
                         {this.state.unitOptions.map((unit) => {
                           if (unit.unitManager) {
                             return (
                               <option key={unit.unitName} value={unit.unitName}>
                                 {unit.unitName}
                               </option>
                             );
                           }
                           return null; // unitManager false ise null döndürerek bu birimi atla
                           })}
                    </select>
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input type='text'
                      className='form-control form-margin'
                      placeholder='Proje Adı'
                      onChange={e=>this.setState({projectName:e.target.value})}
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <textarea
                      type='text'
                      className='form-control form-margin'
                      placeholder='Proje Amacı'
                      onChange={e=>this.setState({projectPurpose:e.target.value})}
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <textarea
                      className='form-control text-area form-margin'
                      placeholder='Detaylı Proje Tanıtımı'
                      onChange={e=>this.setState({projectDetails:e.target.value})}
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <label>Varsa Proje ile İlgili Resim Dosyası:</label>
                    <input id='fileInput' type='file' accept='image/jpg, image/jpeg, image/png' className='form-control ' onChange={this.convertToBase64}></input>
                    {this.state.image === "" || this.state.image == null ? "" : <img width={100} height={100} src={this.state.image} />}
                  </div>
                </Col>
              </Row>
              <button className='button-form' type='submit'onClick={this.handleSubmit} >Gönder</button>
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
            {/* <h3 className='titleDetails'>"{currentProject.projectName}" Projesi Güncelleme Ekranı</h3>  */}
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

        <nav className='sidebar'>
          <header>
            <div className='image-text'>
              <a className="logo" href="https://kapsulteknoloji.org">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.6 74.87" stroke="currentColor" fill="#005eb1" className="h-full w-full drop-shadow-xl">
                  <path d="M67.6 0H44.06s-4.78.41-7.76 4.86c-2.98 4.45-13.88 20.88-13.88 20.88l-5.8-8.85H.14S3.4 27.84 3.81 29.41c.41 1.58 1.23 4.51 1.4 5.47.09.44 1.13 4.91 1.23 7.88 0 .76.28 6.55-.4 10.4-.28 1.43-.45 4.45-2.85 11.43C1.43 70.35 0 74.84 0 74.84h12.05s4.92-.51 7.62-4.54c.79-1.2 10.71-15.75 10.71-15.75l7.31 11.06h-9.23l-6.3 9.27h32.41L35.94 46.43 67.6 0ZM12.85 64.02c1.11-3.09 1.9-8.06 2.09-9.44 2.12-14.2-2.33-27.11-2.33-27.11l9.68 14.73S43.19 11 43.78 10.11c.59-.88 1.2-.8 1.2-.8h5.29S13.31 63.55 12.85 64.02"></path>
                </svg>
              </a>
              <div className='text header-text'>
                <span className='name'> Fikrim Var </span>
                <span className='platform'> Kapsül Teknoloji Platformu </span>
              </div>
            </div>
          </header>

          <div className='menu-bar'>
            <div className='menu'>
              <li className='nav-link'>
                <a className='text nav-text button' href='Application'> Başvurularım </a>
              </li>
            </div>
            <div className='menu'>
              <li className='nav-link'>
                <a className='text nav-text button' href='Messages'> Mesajlarım </a>
              </li>
            </div>
            
            

            <div className='bottom-content'>
              <li className='nav-link'>
                <a onClick={this.logOut} className='text nav-text button'> Çıkış Yap </a>
              </li>
              <li className='nav-link profile-details profile'>
                <a onClick={() => this.setState({ modalUpdate: true })} className='text nav-text button profile-name'>{this.state.userData.userName} {this.state.userData.userSurname}</a>
              </li>
              {/* <li className='profile'>
              
                <div className="profile-details">
                    <div className="profile-name"> {this.state.userData.userName} {this.state.userData.userSurname}</div>     
                </div>
              </li> */}
            </div>
          </div>
        </nav>

        <div className="flex-parent jc-center">
          <button className='buttonapp' onClick={() => this.setState({ modal: true })}>Başvuru Yap</button>
          <a className="projectIdea" href='ProjectIdeas'> <button className='buttonapp'  >  Proje Fikirleri </button></a>
        </div>
      </div>
    );
  }
}


