import React, { useEffect, useMemo, useState } from "react";
import { userService, authenticationService } from '@/_services';
import { SECRET } from "../_services/secret";
import toast, { Toaster } from 'react-hot-toast';


var CryptoJS = require("crypto-js");

export default function loadingSpinner({ open }) {
    const [close, setClose] = useState(false);
    const [errmessage, seterrmessage] = useState(false);
    const [errdocument, seterrdocument] = useState(false);

    const [message, setmessage] = useState("");
    const [allMessages, setallMessages] = useState([]);
    const [allDocuments, setallDocuments] = useState([]);
    const [document, setdocument] = useState("");
    const [documentname, setdocumentname] = useState("");
    const [documentType, setdocumentType] = useState("");

    const currentUser = authenticationService.currentUserValue;


    const [tab, settab] = useState(1);

    const addMessage = (e) => {

        e.preventDefault();

        if (!message) {
            seterrmessage(true);
        }


        const user = currentUser._doc;

        let obj = {

            message: message,
            userid: user.userid,
            role: user.role,
            username: user.username

        }


        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), SECRET.secret).toString();

        console.log(ciphertext);

        // // Decrypt
        // var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // console.log(decryptedData); 


        if (message) {

            authenticationService.saveMessage({ data: ciphertext })
                .then(
                    data => {
                        console.log(data)
                        getAllMes();
                        toast.success('Saved Successfully !',
                        {
                        //   icon: '👏',
                          style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                          },
                        })
                    },
                    error => {
                        console.log(error)
                        toast.error(error,
                        {
                        //   icon: '👏',
                          style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                          },
                        })
                    }
                );

        }

    }

    const onChangeDocument = (e) => {
        let file = e.target.files[0];

        seterrdocument(false);

        let fileName = file.name.split('.').slice(0, -1).join('.')

        setdocumentname(fileName);
        setdocumentType(file.name.split('.').pop());

        console.log("file>>>>>>", file)

        if (e.target.files[0] !== null) {

            let reader = new FileReader();
            reader.readAsDataURL(file);
            let baseURL;
            reader.onload = () => {
                baseURL = reader.result;
                setdocument(baseURL);
                console.log("doc>>>>>>", baseURL)
            };
        }
    };

    const addDocument = (e) => {

        e.preventDefault();

        if (!document) {
            seterrdocument(true);
        }


        const user = currentUser._doc;

        let obj = {

            document: document,
            userid: user.userid,
            role: user.role,
            username: user.username,
            fileName: documentname,
            fileType:documentType

        }

        console.log(">>>>", obj)

        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), SECRET.secret).toString();

        console.log(ciphertext);



        if (document) {

            authenticationService.saveDocument({ data: ciphertext })
                .then(
                    data => {
                        console.log(data)
                        getAlDocs();
                        toast.success('Saved Successfully !',
                        {
                        //   icon: '👏',
                          style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                          },
                        })
                        
                    },
                    error => {
                        console.log(error)
                        toast.error(error,
                            {
                            //   icon: '👏',
                              style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                              },
                            })
                    }
                );

        }

    }

    const getAllMes = () => {

        authenticationService.getMessages()
            .then(
                data => {
                    console.log(data)
                    setallMessages(data.data)
                },
                error => {
                    console.log(error)
                    toast.error(error,
                        {
                        //   icon: '👏',
                          style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                          },
                        })
                }
            );
    }

    const getAlDocs = () => {

        authenticationService.getDocuments()
            .then(
                data => {
                    console.log(data)
                    setallDocuments(data.data)
                },
                error => {
                    console.log(error)
                    toast.error(error,
                        {
                        //   icon: '👏',
                          style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                          },
                        })
                }
            );
    }

    useEffect(() => {
        getAllMes();
        getAlDocs();

    }, [])


    return (
        <div>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            <h2 className="d-flex justify-content-center" >Dashboard</h2>
            <div class="card text-center">
                <div class="card-header">
                    <ul class="nav nav-tabs card-header-tabs">
                        <li class="nav-item">
                            <a class={`nav-link ${tab === 1 ? "active" : ""}`} aria-current="true"
                                onClick={() => {
                                    settab(1);
                                }}
                            >Message</a>
                        </li>

                        {
                            currentUser._doc.role === "Manager" &&

                            <li class="nav-item">
                                <a class={`nav-link ${tab === 2 ? "active" : ""}`}
                                    onClick={() => {
                                        settab(2);
                                    }}
                                >Document</a>
                            </li>
                        }

                    </ul>
                </div>

                {
                    tab === 1 ?
                        <div class="card-body w-100">
                            <h5 class="card-title">Enter Message</h5>
                            <div class="mb-3 mt-3 w-100">
                                <label for="exampleFormControlInput1" class="form-label d-flex justify-content-left">Message</label>
                                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="message"
                                    onChange={(e) => {
                                        setmessage(e.target.value);
                                        seterrmessage(false);
                                    }}
                                />
                                {
                                    errmessage &&
                                    <p class="text-right d-flex flex-row-reverse text-danger " style={{ fontSize: "10pt" }} >This field is required</p>
                                }

                            </div>
                            <a href="" class="btn btn-primary" onClick={addMessage} >Save</a>
                        </div>
                        :
                        <div class="card-body">
                            <h5 class="card-title">Upload Document</h5>
                            <div class="mb-3 mt-3">
                                <label for="exampleFormControlInput1" class="form-label d-flex justify-content-left">Document</label>
                                <input type="file" class="form-control" id="exampleFormControlInput1" placeholder="message"
                                    onChange={(e) => {

                                        if (e.target.files[0]) {

                                            onChangeDocument(e);


                                            // setError(false);
                                        }
                                    }}
                                />

                                {
                                    errdocument &&

                                    <p class="text-right d-flex flex-row-reverse text-danger " style={{ fontSize: "10pt" }} >This field is required</p>
                                }

                            </div>
                            <a href="#" class="btn btn-primary" onClick={addDocument}>Upload</a>
                        </div>

                }



            </div>
            <div class="row mt-5">
                <div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-4">Documents</h5>

                            <div
                                style={{
                                    height: "185px",
                                    overflow: "auto"
                                }}
                            >
                                {allDocuments.map(single => {

                                    return (
                                        <div
                                            style={{
                                                display: "-webkit-inline-flex"
                                            }}
                                            onClick={(e) => {
                                                authenticationService.downloadDocument(single.document)
                                                    .then(
                                                        data => {
                                                            console.log(data)

                                                        },
                                                        error => {
                                                            console.log(error)
                                                        }
                                                    );
                                            }}
                                        >
                                            <p class="card-text">{single.document}</p><i class="bi bi-file-earmark-pdf-fill ml-4 text-danger" style={{ cursor: "pointer" }} ></i>
                                        </div>
                                    );
                                })}
                            </div>



                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Messages</h5>

                            <div
                                style={{
                                    height: "200px",
                                    overflow: "auto"
                                }}
                            >
                                {allMessages.map(single => {

                                    return (
                                        <p class="card-text">{single.message}</p>
                                    );
                                })}
                            </div>

                            {/* <a href="#" class="btn btn-primary">Go somewhere</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}