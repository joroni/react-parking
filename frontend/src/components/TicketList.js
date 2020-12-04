import React, { Component } from 'react'
import { getList, addToList, deleteItem, updateItem, getLot } from './TicketListFunctions'
import FormValidator from './FormValidator'

class TicketList extends Component {
  constructor() {
    super();

    this.validator = new FormValidator([
      {
        field: "ticket",
        method: "isEmpty",
        validWhen: false,
        message: "Ticket name is required",
      },
      {
        field: "status",
        method: "isEmpty",
        validWhen: false,
        message: "Status is required",
      },
    ]);

    this.state = {
      id: "",
      ticket: "",
      status: 0,
      createdAt: "",
      isUpdate: false,
      errorMessage: "",
      items: [],
      validation: this.validator.valid(),
    
        lots: [],
        selectedLot: "",
        validationError: "",
      
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    this.getAll(token);
  //  this.getLot();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCreate(e) {
    e.preventDefault();
    const token = localStorage.usertoken;
    this.setState({
      id: "",
      ticket: "",
      status: 0,
      createdAt: "",
      isUpdate: false,
      errorMessage: "",
      items: [],
      validation: this.validator.valid(),
    });
    this.getAll(token);
  }

  getStatus(statusCode) {
    const status = ["Occupied", "Available"];
    return status[statusCode];
  }

  formatDate(date) {
    Date.prototype.format = function (format) {
      date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds(),
      };

      if (/(y+)/i.test(format)) {
        format = format.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }

      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? date[k]
              : ("00" + date[k]).substr(("" + date[k]).length)
          );
        }
      }

      return format;
    };

    return date.format("yyyy-MM-dd hh:mm:ss");
  }

  getAll = (token) => {
    getList(token).then((data) => {
      if (data.status !== "success") {
        localStorage.removeItem("usertoken");
        this.props.history.push(`/login`);
      } else {
        this.setState(
          {
            ticket: "",
            items: [...data],
          },
          () => {
            console.log(this.state.items);
          }
        );
      }
    });

    getLot(token).then((data) => {
      if (data.status !== "success") {
        localStorage.removeItem("usertoken");
        this.props.history.push(`/login`);
      } else {
        this.setState(
          {
            ticket: "",
            lots: [...data],
          },
          () => {
            console.log(this.state.lots);
          }
        );
      }
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    if (validation.isValid) {
      const token = localStorage.usertoken;

      const ticketRequest = {
        token: token,
        name: this.state.ticket,
        status: this.state.status,
      };

      addToList(ticketRequest)
        .then(() => {
          this.getAll(token);
        })
        .catch((err) => {
          this.setState({ editDisabled: false, errorMessage: err.message });
        });
      this.setState({ editDisabled: false });
    }
  };

  onUpdate = (e) => {
    e.preventDefault();
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    if (validation.isValid) {
      const token = localStorage.usertoken;
      const ticketUpdateRequest = {
        id: this.state.id,
        token: token,
        name: this.state.ticket,
        status: this.state.status,
      };
      updateItem(ticketUpdateRequest)
        .then(() => {
          this.getAll(token);
        })
        .catch((err) => {
          this.setState({
            editDisabled: false,
            isUpdate: false,
            errorMessage: err.message,
          });
        });
    }
    this.setState({ editDisabled: false, isUpdate: false, status: 0 });
  };

  onEdit = (item_id, item, status, e) => {
    e.preventDefault();
    this.setState({
      id: item_id,
      ticket: item,
      status: status,
      errorMessage: "",
      isUpdate: true,
      validation: this.validator.valid(),
    });
  };

  onDelete = (val, e) => {
    e.preventDefault();
    const token = localStorage.usertoken;
    deleteItem(val, token)
      .then((res) => {
        if (res.data.status === "failed") {
          this.setState({ errorMessage: res.data.message });
        }
        this.getAll(token);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.data.message });
      });
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-12 mt-5">
          <div className="col-md-12">
            {this.state.errorMessage !== "" ? (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <strong>Error Message: </strong> {this.state.errorMessage}
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="ticket">Lot</label>
              <div className="row">
                  <div className="col">
                <select
                className="form-control"
                  value={this.state.selectedLot}
                  onChange={(e) =>
                    this.setState({
                      selectedLot: e.target.value,
                      validationError:
                        e.target.value === ""
                          ? "You must select a Lot"
                          : "",
                    })
                  }
                >
                     <option></option>
                  {this.state.lots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.name}{" "}
                    </option>
                  ))}{" "}
                </select>{" "}
                <div
                  style={{
                    color: "red",
                    marginTop: "5px",
                  }}
                >
                  {this.state.validationError}{" "}
                  </div>
                </div>{" "}
              </div>
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="ticket">Lot</label>
              <div className="row">
                  <div className="col">
                <select
                className="form-control"
                  value={this.state.selectedLot}
                  onChange={(e) =>
                    this.setState({
                      selectedLot: e.target.value,
                      validationError:
                        e.target.value === ""
                          ? "You must select a Lot"
                          : "",
                    })
                  }
                >
                     <option></option>
                  {this.state.lots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.name}{" "}
                    </option>
                  ))}{" "}
                </select>{" "}
                <div
                  style={{
                    color: "red",
                    marginTop: "5px",
                  }}
                >
                  {this.state.validationError}{" "}
                  </div>
                </div>{" "}
              </div>
            </div>
</div>
            <div className="form-group">
              <label htmlFor="ticket">Ticket Title</label>
              <div className="row">
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.ticket}
                    name="ticket"
                    onChange={this.onChange}
                  />
                  <span className="help-block">
                    {this.state.validation.ticket.message}
                  </span>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="status">Ticket Status</label>
              <div className="row">
                <div className="col-md-12">
                  <select
                    className="form-control"
                    name="status"
                    value={this.state.status}
                    onChange={this.onChange}
                  >
                    <option value="0">Occupied</option>
                    <option value="1">Avilable</option>
                  </select>
                  <span className="help-block">
                    {this.state.validation.status.message}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={this.onUpdate.bind(this)}
              style={this.state.isUpdate ? {} : { display: "none" }}
            >
              Update
            </button>
            <button
              type="submit"
              onClick={this.onSubmit.bind(this)}
              className="btn btn-success btn-block"
              style={this.state.isUpdate ? { display: "none" } : {}}
            >
              Submit
            </button>
            <button
              onClick={this.onCreate.bind(this)}
              className="btn btn-info btn-block"
              style={this.state.isUpdate ? {} : { display: "none" }}
            >
              Create New
            </button>
          </form>
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle No</th>
                <th>Status</th>
                <th>Start</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.map((item, index) => (
                <tr key={index}>
                  <td className="text-left">{item.name}</td>
                  <td className="text-left">{this.getStatus(item.status)}</td>
                  <td className="text-left">
                    {this.formatDate(new Date(item.createdAt))}
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-info mr-1"
                      disabled={this.state.editDisabled}
                      onClick={this.onEdit.bind(
                        this,
                        item.id,
                        item.name,
                        item.status
                      )}
                    >
                      Edit
                    </button>
                    <button
                      href=""
                      className="btn btn-danger"
                      onClick={this.onDelete.bind(this, item.id)}
                      style={this.state.isUpdate ? { display: "none" } : {}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TicketList