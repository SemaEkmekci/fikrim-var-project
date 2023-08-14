import React, { Component } from "react";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalHeader, Row, Col } from "reactstrap";
import { BiEdit } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
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
      projects: [],
      unitOptions:[]
    };

    this.columns = [
      {
        name: "Proje Adı",
        selector: (row) => row.projectName,
        sortable: true,
        width: "400px",
      },
      {
        name: "Proje Tarihi",
        selector: (row) => row.projectDate,
        sortable: true,
        width: "120px",
      },
      {
        name: "Proje Birimi",
        selector: (row) => row.unit,
        sortable: true,
        width: "200px",
      },
      {
        cell: (row) => (
          <button
            className="iconButton"
            onClick={() => this.handleViewApplication(row.projectName)}
          >
            <AiOutlineEye />
          </button>
        ),
      },

      {
        cell: (row) => (
          <button
            className="iconButton"
            onClick={() => this.updateModal(row.projectName)}
          >
            <BiEdit />
          </button>
        ),
      },
      {
        cell: (row) => (
          <button
            className="iconButton"
            onClick={() => this.deleteProject(row.projectName)}
          >
            <RiDeleteBin6Line />
          </button>
        ),
        allowOverflow: true,
      },
    ];
    // this.updateProject = this.updateProject.bind(this);
  }


 

  componentWillMount() {
    document.title = "Fikrim Var | Başvurularım";
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/getProjectInfo", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "error") {
            window.location.href = "./login";
          }
          console.log(data, "projects");
          const records = data.data.map((project) => {
            return {
              projectName: project.projectName,
              projectDate: project.date,
              unit: project.unit,
            };
          });
          this.setState({ projects: data.data, records: records });
        })
        .catch((error) => {
          console.error("Hata", error);
        });
    } else {
      window.location.href = "./login";
      console.log("Token bulunamadı");
    }

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
      this.setState({ updateProjectImage: reader.result });
      console.log(this.state.updateProjectImage);
    };
    reader.onerror = (error) => {
      console.log("Error", error);
    };
  };

  
  handleViewApplication = async (projectName) => {
    console.log("Tıklanan proje adı:", projectName);
    const selectedProject = this.state.projects.find(
      (projects) => projects.projectName === projectName
    );

    await this.setState({
      modalView: true,
      currentProject: selectedProject,
    });

    console.log("Seçilen proje:", this.state.currentProject);
  };

  updateModal = async (projectName) => {
    const selectedProject = this.state.projects.find(
      (projects) => projects.projectName === projectName
    );
    console.log("Seçilen projee:", selectedProject);
    if (selectedProject.status === true) {
      return Swal.fire({
        text: 'Proje birim sorumlusu tarafından okunmuştur. Bu yüzden güncellenemez.',
        icon: 'warning',
        confirmButtonColor: '#3085d6', 
      });

      
    }

    await this.setState({
      modalUpdate: true,
      currentProject: selectedProject,
    });
  };

  updateProject = async (projectName) => {
    fetch("http://localhost:5000/updateProject", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        updatedProject: this.state.currentProject.projectName,
        unit: this.state.updateProjectUnit || this.state.currentProject.unit,
        projectName:
          this.state.updateProjectName || this.state.currentProject.projectName,
        projectPurpose:
          this.state.updateProjectPurpose ||
          this.state.currentProject.projectPurpose,
        projectDetails:
          this.state.updateProjectDetails ||
          this.state.currentProject.projectPurpose,
        image:   this.state.updateProjectImage  || this.state.currentProject.image
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "update");
        Swal.fire({
          text: 'Güncelleme Başarılı',
          icon: 'success',
          confirmButtonColor: '#3085d6', 
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error("Hata", error);
        // alert("Güncelleme Sırasında Bir Hata oluştu",error);
      });
  };

  deleteProject = async (projectName) => {
    const selectedProject = this.state.projects.find(
      (projects) => projects.projectName === projectName
    );
    // await this.setState({currentProject: selectedProject});
    console.log("Seçilen projee:", selectedProject);
    if (selectedProject.status === true) {
      return Swal.fire({
        text: 'Proje birim sorumlusu tarafından okunmuştur. Bu yüzden silinemez.',
        icon: 'warning',
        confirmButtonColor: '#3085d6', 
      });
    }
      Swal.fire({
        title: `"${projectName}" isimli projeyi silmek istiyor musunuz?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Hayır',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.isConfirmed) {
          {
            fetch("http://localhost:5000/deleteProject", {
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
              .then((res) => res.json())
              .then((data) => {
                this.componentWillMount();
                console.log(data, "projects");
              })
              .catch((error) => {
                console.error("Hata", error);
              });
          }
        }
      })

      // window.confirm(`"${projectName}" isimli projeyi silmek istiyor musunuz?`) 
  };

  render() {
    const { modalView, modalUpdate, currentProject } = this.state;

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
              <h5 className="titleDetails"> Başvurulan Birim: </h5>
              <div className="projectDetails">
                {currentProject.unit === "ASL"
                  ? "Akıllı Şehir Laboratuvarı"
                  : currentProject.unit === "BL"
                  ? "Bist-Lab"
                  : ""}
              </div>
            </div>
            <span className="border-bottom"></span>
            <div>
              <h5 className="titleDetails"> Proje Amacı:</h5>
              <div className="projectDetails">
                {currentProject.projectPurpose}
              </div>
            </div>
            <span className="border-bottom"></span>
            <div>
              <h5 className="titleDetails"> Detaylı Proje Tanıtımı:</h5>
              <div className="projectDetails">
                <pre>{currentProject.projectDetails}</pre>
              </div>
            </div>
            <span className="border-bottom"></span>

            <div>
              <h5 className="titleDetails"> Proje İle İlgili Resimler:</h5>
              {currentProject.image === "" || currentProject.image === null ? (
                "İlgili Resim Yok"
              ) : (
                <img width={100} height={100} src={currentProject.image} />
              )}
            </div>
          </ModalBody>
        </Modal>

        <Modal
          size="lg"
          isOpen={modalUpdate}
          toggle={() => this.setState({ modalUpdate: !modalUpdate })}
          style={{ maxWidth: "80%" }}
        >
          <ModalHeader
            toggle={() => this.setState({ modalUpdate: !modalUpdate })}
          >
            <h3 className="titleDetails">
              "{currentProject.projectName}" Projesi Güncelleme Ekranı
            </h3>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={this.updateProject}>
              <Row>
                <Col lg={12}>
                  <div>
                  <select
                      className="form-control"
                      defaultValue={currentProject.unit}
                      onChange={(e) => this.setState({ updateProjectUnit: e.target.value })}
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
                        return null;
                        })}
                      </select>
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <input
                      type="text"
                      className="form-control form-margin"
                      placeholder="Proje Adı"
                      defaultValue={currentProject.projectName}
                      onChange={(e) =>
                        this.setState({ updateProjectName: e.target.value })
                      }
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <textarea
                      type="text"
                      className="form-control form-margin"
                      placeholder="Proje Amacı"
                      defaultValue={currentProject.projectPurpose}
                      onChange={(e) =>
                        this.setState({ updateProjectPurpose: e.target.value })
                      }
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div>
                    <textarea
                      className="form-control text-area form-margin"
                      placeholder="Detaylı Proje Tanıtımı"
                      defaultValue={currentProject.projectDetails}
                      onChange={(e) =>
                        this.setState({ updateProjectDetails: e.target.value })
                      }
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                <div>
                  <label>Varsa Proje ile İlgili Resim Dosyası:</label>
                  <input
                      id="fileInput"
                      type="file"
                      accept="image/jpg, image/jpeg, image/png"
                      className="form-control"
                      onChange={this.convertToBase64}
                  />
                   {currentProject.image && this.state.updateProjectImage ? (
                      <div>
                        <img width={100} height={100} src={currentProject.image} />
                        <span className="arrow">&#8594;</span>
                        <img width={100} height={100} src={this.state.updateProjectImage} />
                      </div>
                    ) : currentProject.image ? (
                      <img width={100} height={100} src={currentProject.image} />
                    ) : this.state.updateProjectImage ? (
                      <img width={100} height={100} src={this.state.updateProjectImage} />
                    ) : (
                      "İlgili Resim Yok"
                    )}
                </div>

                </Col>
              </Row>
              <button
                className="button-form"
                type="submit"
                onClick={this.updateProject}
              >
                Güncelle
              </button>
            </form>
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
          {/* <h1 id='titletop'>Fikrim Var</h1> */}
        </div>
        <div className="container">
          <p id="titlemid">Başvurularım</p>
          <DataTable
            columns={this.columns}
            
            data={this.state.records}
            fixedHeader
            pagination
            noDataComponent="Görüntülecek Başvurunuz Bulunmamaktadır"
            paginationPerPage={10}
            paginationRowsPerPageOptions={[2, 5, 10]}
            paginationComponentOptions={{
              rowsPerPageText: "Sayfa başına proje:",
            }}
            // onRowClicked={(row) => this.handleViewApplication(row.projectName)}
          />
        </div>

        <div className="container">
          <p id="titlebottom">Başvuru Yapılması Durumda İzlenecek Yol</p>
          <p>
            Tamamlanan bütün başvurularınız bu sayfada görüntülenmektedir.{" "}
            <br />
            Başvuru yapılan birim sorumlusu tarafından başvurunuz incelenecek ve
            size geri dönüş yapılacaktır. <br />
            Herhangi bir probleminiz olması durumunda example@gmail.com adresi
            ile iletişime geçiniz
          </p>
        </div>
      </div>
    );
  }
}
