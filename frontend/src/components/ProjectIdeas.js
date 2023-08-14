import React, { Component } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { Modal, ModalBody, ModalHeader, Row, Col } from 'reactstrap';
import { GoDiscussionOutdated } from 'react-icons/go';
import { AiOutlineEye } from 'react-icons/ai';
import { RiMailSendFill } from 'react-icons/ri';
import '../Application.css';



export default class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalFeedBack: false,
      currentProject : [],
      isMeetingSelected: true,
      isInputDisabled:true,
      currentDate:"",
      currentTime:"",
      projectStatus:"",
      projectFeedbackMessage:"",
      datePlace: "",
      date: "",
      time:"",
      records: [
        {
        }, 
      ],
      projects: []
    };
    
    this.columns = [
      {
        name: 'Proje Adı',
        selector: (row) => row.projectName,
        sortable: true,
        width: '220px',
        
      },
      {
        name: 'Proje Tarihi',
        selector: (row) => row.projectDate,
        sortable: true,
        width: '120px'

      },
      {
        name: 'Proje Sahibi',
        selector: (row) => row.projectOwner,
        sortable: true,
        width: '200px'

      },
      {
        name: 'Proje Sahibi E-Posta',
        selector: (row) => row.projectOwnerMail,
        sortable: true,
        width: '220px'
      },
      {
        name: 'Proje Durumu',
        selector: (row) => row.projectStatus,
        sortable: true,
        width: '150px'  
      },
      {
        cell: (row) => (
          <button className='iconButton' title="Projeyi Gör" onClick={() => this.handleViewApplication(row.projectName)} >
            <AiOutlineEye/></button>
        ),
      },
      
      {
        cell: (row) => (
          <button className='iconButton' title="Geri Dönüş Yap" onClick={() => this.handleViewFeedBackModal(row.projectName)}>
            <RiMailSendFill/>
            </button>
        ),
        allowOverflow: true,
      },
    ];
  }

  

  componentWillMount() {
   
    document.title = 'Fikrim Var | Proje Fikirleri';
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/getProjectIdea", {
        method: "GET",
        headers: {
          "Authorization": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.status === "error"){
            window.location.href="./login";
          }
          console.log(data, "projects");
          
          const records = data.data.map(project => {
            const status = project.status === true ? "Okundu" : "Okunmadı";
            return {
              projectName: project.projectName,
              projectDate: project.date,
              projectOwner: project.name + " " + project.surname,
              projectOwnerMail: project.email,
              projectStatus: status,
            };
          });
          
          this.setState({ projects: data.data, records: records })
        })
        .catch((error) => {
          console.error("Hata", error);
        });
    } else {
      window.location.href="./login";
      console.log("Token bulunamadı");
    }
  }

  handleViewApplication = async (projectName) => {
    console.log("Tıklanan proje adı:", projectName);
    const selectedProject = this.state.projects.find((projects) => projects.projectName === projectName);
    await this.setState({
      modal: true,
      currentProject: selectedProject,
    });
    fetch("http://localhost:5000/updateStatus", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        projectName: projectName,
      }),
    })
    
    console.log("Seçilen proje:", this.state.currentProject);
   

  };


  handleMeetingCheckboxChange = () => {
    this.setState((prevState) => ({
      isMeetingSelected: !prevState.isMeetingSelected,
      isInputDisabled: !prevState.isMeetingSelected,
      datePlace: "",
      date: "",
      time:""
    }));
  };

  handleViewFeedBackModal = async (projectName) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate()+1);

    const currentDate = tomorrow.toISOString().split('T')[0];

    const feedbackTime = now.toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
    });
    console.log("Türkiye saati:", feedbackTime);
    // const feedbackday = new Date();
    const formattedDate = now
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
    // const currentTime = now.toTimeString().slice(0, 5);
    // console.log(currentTime);
    console.log(currentDate);

    console.log("Tıklanan proje adı:", projectName);
    const selectedProject = this.state.projects.find((projects) => projects.projectName === projectName);
    
    await this.setState({
      modalFeedBack: true,
      currentProject: selectedProject,
      currentDate: currentDate,
      feedbackDate: formattedDate,
      feedbackTime: feedbackTime
      // currentTime: currentTime 
    });
    console.log("Seçilen proje:", this.state.currentProject);
  };
  
  handleFeedBackSubmit = (e) => {
    e.preventDefault();
    let formattedDate = "";
    const { currentProject, projectStatus, projectFeedbackMessage, datePlace, date, time, feedbackDate, feedbackTime } = this.state;
    if (projectStatus === "") {
      return Swal.fire({
        text: 'Lütfen Proje Durumu Seçin',
        icon: 'warning',
        confirmButtonColor: '#3085d6', 
      });
     
    }
    if (projectFeedbackMessage === "") {
      return Swal.fire({
        text: 'Lütfen Boş Alan Bırakmayınız',
        icon: 'warning',
        confirmButtonColor: '#3085d6', 
      });
    }

    if (!this.state.isMeetingSelected) {
      if (date === "" || time === "" || datePlace === "") {
         return Swal.fire({
        text: 'Lütfen Randevu Bilgilerini Tam Olarak Giriniz.',
        icon: 'warning',
        confirmButtonColor: '#3085d6', 
      });
      } else {
        const dateParts = date.split("-");
        formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }
  
    console.log(currentProject, projectStatus, projectFeedbackMessage, datePlace, date, time);
    fetch("http://localhost:5000/feedBack", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        name: currentProject.name,
        surname: currentProject.surname,
        email: currentProject.email,
        unit: currentProject.unit,
        projectName: currentProject.projectName,
        projectStatus: projectStatus,
        projectFeedbackMessage: projectFeedbackMessage,
        datePlace: datePlace,
        date: formattedDate,
        time: time,
        feedbackDate: feedbackDate,
        feedbackTime: feedbackTime
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "feedBack");
        if (data.status === "ok") {
          this.setState({ modalFeedBack: !this.state.modalFeedBack });
          Swal.fire({
            text: 'Mesajınız İletildi',
            icon: 'success',
            confirmButtonColor: '#3085d6', 
          });
        } else {
          console.log(data.error);
          Swal.fire({
            text: 'Mesaj Gönderilirken Bir Hata Oluştu. Daha Sonra Tekrar Deneyin',
            icon: 'error',
            confirmButtonColor: '#3085d6', 
          });
        }
      })
      .catch((error) => {
        console.error("Feedback sırasında bir hata oluştu:", error);
      });
  };


  handleModalCloseAndReload = () => {
    this.setState({ modal: false });
    window.location.reload();
  };




  
  render() {
    const { modal, modalFeedBack,currentProject} = this.state;
    return (
      <div className='home'>
        <Modal
          size='lg'
          isOpen={modal}
          toggle={() => {
            this.setState({ modal: !modal });    
          }}
          style={{ maxWidth: "80%" }}
        >
           <ModalHeader toggle={this.handleModalCloseAndReload}>
          
            <h3 className='titleDetails'>{currentProject.projectName}</h3> 
          </ModalHeader>
          <ModalBody>
            <div> 
              <h5 className='titleDetails'> Başvurulan Birim:{" "}
                </h5> 
                <div className='projectDetails'>
                  {currentProject.unit}
                </div>
            </div>
            <span className="border-bottom"></span>
            <div> 
              <h5 className='titleDetails'> Proje Amacı:
                 </h5>
                 <div className='projectDetails'>

                 {currentProject.projectPurpose}

                 </div>
            </div>
            <span className="border-bottom"></span>
            <div> 
              <h5 className='titleDetails'> Detaylı Proje Tanıtımı:
                 </h5>
                 <div className='projectDetails'>
                <pre> {currentProject.projectDetails} </pre>

                 </div>
            </div>
            <span className="border-bottom"></span>

           <div>
           <h5 className='titleDetails'> Proje İle İlgili Resimler:</h5>
           {currentProject.image === "" || currentProject.image === null ? "İlgili Resim Yok" : <img width={100} height={100} src={currentProject.image} />}
           </div>
          </ModalBody>
        </Modal>

        <Modal
          size='lg'
          isOpen={modalFeedBack}
          toggle={() => {
            this.setState({ modalFeedBack: !modalFeedBack });
          }}
          style={{ maxWidth: "80%" }}  
        >
           <ModalHeader toggle={() => this.setState({ modalFeedBack: !modalFeedBack })}>
            <h3 className='titleDetails'>{currentProject.projectName}</h3> 
          </ModalHeader>
          <ModalBody>
          <form onSubmit={this.handleSubmit}>
              <Row>
              <Col lg={12}>
                  <div>
                    <select className='form-control' 
                     onChange={e=>this.setState({projectStatus:e.target.value})}>
                      <option value="">Proje Durumu Seçin</option>
                      <option value="start">Başlangıç</option>
                      <option value="evaluation">Değerlendirme</option>
                      <option value="completed">Tamamlandı</option>
                    </select>
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <textarea
                      className='form-control text-area form-margin'
                      placeholder='Proje Sahibine Geri Dönüş Mesajı'
                      onChange={e=>this.setState({projectFeedbackMessage:e.target.value})}
                      required
                    />
                  </div>
                </Col>
                <Col>
                <div className='buttons'>
                  <label htmlFor="meeting">
                    Randevu Oluşturmak İstiyor Musunuz?
                    <span className="dateSpan">
                    <input 
                    type="checkbox"
                    id="meeting" 
                    value="meeting"
                    onChange={this.handleMeetingCheckboxChange}
                    />
                    <GoDiscussionOutdated className="date" style={{ position: 'absolute', top: '0', left: '0' }} />
                    </span>
                  </label>
               
           
                </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <select className='form-control' disabled={this.state.isInputDisabled}
                     value={this.state.isMeetingSelected ? "" : this.state.datePlace}
                     onChange={e=>this.setState({datePlace:e.target.value})}
                     required={this.state.isMeetingSelected ? false : true}
                     >
                      <option value="" disabled selected>Randevu Yeri Seçin</option>
                      <option value="KTP">Kapsül Teknoloji Platformu</option> 
                    </select>
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <label htmlFor="dateInput">Randevu Tarihi:</label>
                    <input
                      id="dateInput"
                      type="date"
                      className="form-control"
                      disabled={this.state.isInputDisabled}
                      value={this.state.isMeetingSelected ? '' : this.state.date}
                      onChange={e=>this.setState({date:e.target.value})}
                      min={this.state.currentDate}
                      required={this.state.isMeetingSelected ? false : true}
                    />

                    <label htmlFor="timeInput">Randevu Saati:</label>
                    <input
                      id="timeInput"
                      type="time"
                      className="form-control"
                      disabled={this.state.isInputDisabled}
                      value={this.state.isMeetingSelected ? '' : this.state.time}
                      onChange={e=>this.setState({time:e.target.value})}
                      required={this.state.isMeetingSelected ? false : true}
                    />
                  </div>
                </Col>
              </Row>
              <button className='button-form' type='submit'onClick={this.handleFeedBackSubmit} >Gönder</button>
            </form>
          </ModalBody>
        </Modal>
      
        <div className='top'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.6 74.87" stroke="currentColor" fill="#ffffffb5" className="kapsul h-full w-full drop-shadow-xl">
            <path d="M67.6 0H44.06s-4.78.41-7.76 4.86c-2.98 4.45-13.88 20.88-13.88 20.88l-5.8-8.85H.14S3.4 27.84 3.81 29.41c.41 1.58 1.23 4.51 1.4 5.47.09.44 1.13 4.91 1.23 7.88 0 .76.28 6.55-.4 10.4-.28 1.43-.45 4.45-2.85 11.43C1.43 70.35 0 74.84 0 74.84h12.05s4.92-.51 7.62-4.54c.79-1.2 10.71-15.75 10.71-15.75l7.31 11.06h-9.23l-6.3 9.27h32.41L35.94 46.43 67.6 0ZM12.85 64.02c1.11-3.09 1.9-8.06 2.09-9.44 2.12-14.2-2.33-27.11-2.33-27.11l9.68 14.73S43.19 11 43.78 10.11c.59-.88 1.2-.8 1.2-.8h5.29S13.31 63.55 12.85 64.02"></path>
          </svg>
          <a id='a' href='./adminHomePage'><h1 id='titletop'>Fikrim Var</h1></a>
        </div>
        <div className='container'>
          <p id='titlemid'>Proje Fikirleri</p>
          <DataTable columns={this.columns} data={this.state.records} fixedHeader pagination 
            noDataComponent="Görüntülecek Başvurunuz Bulunmamaktadır"
            paginationPerPage={10} 
            paginationRowsPerPageOptions={[2,5,10]}
            paginationComponentOptions={{rowsPerPageText: 'Sayfa başına proje:'}}
            
            />
     
        </div>
      </div>
    );
  }
}
