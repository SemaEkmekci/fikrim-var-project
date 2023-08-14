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
      currentManager: [],
      currentProjectName: "",
      updateProjectUnit: "",
      updateProjectName: "",
      updateProjectPurpose: "",
      updateProjectDetails: "",
      updateProjectImage: "",
      unit: "",
      records: [{}],
      managers: [],
    };

    this.columns = [
      {
        name: "Birim Sorumlusu Adı-Soyadı",
        selector: (row) => row.managerName,
        sortable: true,
        width: "400px",
      },
      {
        name: "Mail Adresi",
        selector: (row) => row.managerMail,
        sortable: true,
        width: "220px",
      },
      {
        name: "Birimi",
        selector: (row) => row.unit,
        sortable: true,
        width: "200px",
      },
      {
        cell: (row) => (
          <div>
          <button
            className="iconButton" 
            onClick={() => this.deleteManager(row.managerName,row.managerMail, row.unit)}
          >
            <RiDeleteBin6Line />
          </button>
          </div>
        ),
        allowOverflow: true,
      },
    ];
  }


 

  componentWillMount() {
    document.title = "Fikrim Var | Birim Sorumluları";
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/getUnitManagerInfo", {
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
          console.log(data, "managers");
          const records = data.data.map((manager) => {
            
            const managerName = `${manager.userName} ${manager.userSurname}`;
            return {
              managerName: managerName,
              managerMail: manager.email,
              unit: manager.unit,
            };
          });
          this.setState({ managers: data.data, records: records });
        })
        .catch((error) => {
          console.error("Hata", error);
        });
    } else {
      window.location.href = "./login";
      console.log("Token bulunamadı");
    }
  }
     

  deleteManager = async (managerName, managerMail, unit) => {
    const selectedProject = this.state.managers.find(
      (manager) => manager.userName === managerName
    );
    console.log("Seçilen projee:", selectedProject);
      Swal.fire({
        title: `"${managerName}" isimli birim sorumlusunu silmek istiyor musunuz?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Hayır',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.isConfirmed) {
          {
            fetch("http://localhost:5000/deleteManager", {
              method: "POST",
              crossDomain: true,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({
                managerMail: managerMail,
                unit: unit
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                this.componentWillMount();
                console.log(data, "Manager");
              })
              .catch((error) => {
                console.error("Hata", error);
              });
          }
        }
      })




    
    
      
  };

  render() {
    const { modalView, modalUpdate, currentManager } = this.state;

    return (
      <div className="home">
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
          <a id="a" href="./superUserPage">
            <h1 id="titletop">Fikrim Var</h1>
          </a>
        </div>
        <div className="container">
          <p id="titlemid">Birim Sorumluları</p>
          <DataTable
            columns={this.columns}
            data={this.state.records}
            fixedHeader
            pagination
            noDataComponent="Görüntülecek Birim Sorumlusu Bulunmamaktadır"
            paginationPerPage={10}
            paginationRowsPerPageOptions={[2, 5, 10]}
            paginationComponentOptions={{
              rowsPerPageText: "Sayfa başına sorumlu:",
            }}
          />
        </div>
      </div>
    );
  }
}
