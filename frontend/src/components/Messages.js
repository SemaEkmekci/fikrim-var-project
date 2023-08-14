import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { Modal, ModalBody, ModalHeader, Row, Col } from "reactstrap";
// import { BiEdit } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import "../Application.css";

export default class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: false,
      modalUpdate: false,
      currentProject: [],
      currentProjectName: "",
      updateProjectUnit: "",
      updateProjectName: "",
      updateProjectPurpose: "",
      updateProjectDetails: "",
      updateProjectImage: "",
      unit: "",
      records: [{}],
      feedback: [],
      datePlace: ""
    };

    this.columns = [
      {
        name: "Proje Adı",
        selector: (row) => row.projectName,
        sortable: true,
        width: "230px",
      },
      {
        name: "Randevu Zamanı",
        selector: (row) => row.projectDate,
        sortable: true,
        width: "150px",
      },
      {
        name: "Proje Birimi",
        selector: (row) => row.unit,
        sortable: true,
        width: "200px",
      },
      {
        name: "Proje Durumu",
        selector: (row) => row.projectStatus,
        sortable: true,
        width: "130px",
      },
      {
        name: "Mesaj Tarihi",
        selector: (row) => row.feedbackDate,
        sortable: true,
        width: "130px",
      },
      {
        name: "Mesaj Saati",
        selector: (row) => row.feedbackTime,
        sortable: true,
        width: "130px",
      },
      {
        cell: (row) => (
          <button
            className="iconButton"
            onClick={() => this.handleViewFeedback(row.projectName, row.feedbackDate, row.feedbackTime)}
          >
            <AiOutlineEye />
          </button>
        ),
      },
    
    ];
  }
  

  componentWillMount() {
    document.title = "Fikrim Var | Mesajlarım";
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/getFeedbackInfo", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "feedback");
          const records = data.data.map((feedBack) => {
            
            let status = "";
            
          
            if(feedBack.projectStatus === "start"){
                status = "Başlangıç";
            }
            else if(feedBack.projectStatus === "evaluation"){
                status = "Değerlendirme";
            }
            else{
                status = "Tamamlandı";
            }
            if(feedBack.meetingPlace === "KTP"){
                this.state.datePlace = "Kapsül Teknoloji Platformu"
            }
            return {
              projectName: feedBack.projectName,
              projectDate: feedBack.date
                ? `${feedBack.date} - ${feedBack.time}`
                : "Randevu oluşturulmadı",
              unit: feedBack.unit,
              projectStatus: status,
              feedbackDate: feedBack.feedbackDate,
              feedbackTime: feedBack.feedbackTime
            };
          });
          this.setState({ feedBack: data.data, records: records });
        })
        .catch((error) => {
          console.error("Hata", error);
        });
    } else {
      window.location.href = "./login";
      console.log("Token bulunamadı");
    }
  }
   

  handleViewFeedback = async (projectName, feedbackDate, feedbackTime) => {
    console.log("Tıklanan proje adı:", projectName);
    const selectedFeedback = this.state.feedBack.find((feedback) => {
      return feedback.projectName === projectName && feedback.feedbackDate === feedbackDate && feedback.feedbackTime === feedbackTime;
    });

    await this.setState({
      modalView: true,
      currentProject: selectedFeedback,
    });

    console.log("Seçilen proje:", this.state.currentProject);
  };

  render() {
    const { modalView,  currentProject } = this.state;

    return (
      <div className="home">
        <Modal
          size="lg"
          isOpen={modalView}
          toggle={() => this.setState({ modalView: !modalView })}
          style={{ maxWidth: "80%" }}
        >
          <ModalHeader toggle={() => this.setState({ modalView: !modalView })}>
            <h3 className="titleDetails">{currentProject.projectName}</h3>
          </ModalHeader>
          <ModalBody>
            <div>
              <h5 className="titleDetails"> Birim Sorumlusu Mesajı: </h5>
              <div className="projectDetails">
                
                <pre>{currentProject.projectFeedbackMessage}
                </pre>
              </div>
            </div>
            <span className="border-bottom"></span>
            <div>
              <h5 className="titleDetails"> Randevu Yeri: </h5>
              <div className="projectDetails">
                {this.state.datePlace}
              </div>
            </div>
            <div>
              <h5 className="titleDetails">Randevu Zamanı:</h5>
              {currentProject.date === "" || currentProject.date === null ? (
                "Randevu Oluşturulmadı."
              ) : (
                <div className="projectDetails">
                  {(currentProject.date + " - " + currentProject.time)}
                </div>
              )}
            </div>

            {/* <div>
              <h5 className="titleDetails"> Proje İle İlgili Resimler:</h5>
              {currentProject.image === "" || currentProject.image === null ? (
                "İlgili Resim Yok"
              ) : (
                <img width={100} height={100} src={currentProject.image} />
              )}
            </div> */}
          </ModalBody>
        </Modal>


        <div className="top">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 67.6 74.87"
            stroke="currentColor"
            fill="#ffffffb5"
            className="kapsul h-full w-full drop-shadow-xl"
          >
            <path d="M67.6 0H44.06s-4.78.41-7.76 4.86c-2.98 4.45-13.88 20.88-13.88 20.88l-5.8-8.85H.14S3.4 27.84 3.81 29.41c.41 1.58 1.23 4.51 1.4 5.47.09.44 1.13 4.91 1.23 7.88 0 .76.28 6.55-.4 10.4-.28 1.43-.45 4.45-2.85 11.43C1.43 70.35 0 74.84 0 74.84h12.05s4.92-.51 7.62-4.54c.79-1.2 10.71-15.75 10.71-15.75l7.31 11.06h-9.23l-6.3 9.27h32.41L35.94 46.43 67.6 0ZM12.85 64.02c1.11-3.09 1.9-8.06 2.09-9.44 2.12-14.2-2.33-27.11-2.33-27.11l9.68 14.73S43.19 11 43.78 10.11c.59-.88 1.2-.8 1.2-.8h5.29S13.31 63.55 12.85 64.02"></path>
          </svg>
          <a id="a" href="./userHomePage">
            <h1 id="titletop">Fikrim Var</h1>
          </a>
        </div>
        <div className="container">
          <p id="titlemid">Mesajlarım</p>
          <DataTable 
            columns={this.columns}
            
            data={this.state.records}
            fixedHeader
            pagination
            noDataComponent="Görüntülecek Mesajınız Bulunmamaktadır"
            paginationPerPage={10}
            paginationRowsPerPageOptions={[2, 5, 10]}
            paginationComponentOptions={{
            rowsPerPageText: "Sayfa başına proje:",
            }}
            // onRowClicked={(row) => this.handleViewApplication(row.projectName)}
          />
        </div>
      </div>
    );
  }
}
