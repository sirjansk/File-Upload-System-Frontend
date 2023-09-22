import "./App.css";
import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = {
    selectedFile: null,
    fileUploadedSuccessfully: false,
    shareableLink: null,
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload = () => {
    if (!this.state.selectedFile) {
      alert("Choose a file to upload first!");
      return;
    }

    const formData = new FormData();
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    axios
      .post(
        "https://my9h5z96wh.execute-api.ap-south-1.amazonaws.com/prod/file-upload",
        formData
      )
      .then(() => {
        this.setState({
          selectedFile: null,
          fileUploadedSuccessfully: true,
          shareableLink: null, // Clear the shareable link when uploading a new file
        });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  onGetLink = () => {
    if (this.state.fileUploadedSuccessfully && this.state.selectedFile) {
      axios
        .post(
          "https://my9h5z96wh.execute-api.ap-south-1.amazonaws.com/prod/get-link",
          { fileName: this.state.selectedFile.name }
        )
        .then((response) => {
          const signedUrl = response.data.link;
          this.setState({ shareableLink: signedUrl });
        })
        .catch((error) => {
          console.error("Error getting shareable link:", error);
        });
    } else if (!this.state.fileUploadedSuccessfully) {
      alert("Upload a file first!");
    }
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name : {this.state.selectedFile.name}</p>
          <p>File Type : {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else if (this.state.fileUploadedSuccessfully) {
      return (
        <div>
          <br />
          <h4>Your file has been uploaded successfully!</h4>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose a file before pressing the upload button!</h4>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="container">
        <h2>File Upload System</h2>
        <h3>File uploading service with React and Serverless API!</h3>
        <div>
          <input type="file" onChange={this.onFileChange}></input>
          <button onClick={this.onFileUpload}>Upload</button>
          <button onClick={this.onGetLink}>Get Shareable Link</button>
        </div>
        {this.fileData()}
        {this.state.shareableLink && (
          <div>
            <h4>Shareable Link:</h4>
            <a
              href={this.state.shareableLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.state.shareableLink}
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default App;
