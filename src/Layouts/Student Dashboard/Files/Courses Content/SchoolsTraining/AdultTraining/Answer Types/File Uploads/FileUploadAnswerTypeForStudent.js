import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Formik, FormikConsumer, useFormik } from 'formik'
import { Link, useHistory, useRouteMatch, useLocation, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { createAnswers , createAssignmentAnswers} from '../../../../../Apis/apiForAnswers';
import { createAudioFile } from '../../../../../Apis/apiForAudioSending';
import { getRegisterationStudentsById } from '../../../../../Apis/apiForRegistrations';
import axios from 'axios';

function FileUploadAnswerTypeForStudent() {
  let {id} = useParams()
  const location = useLocation();
  const editorRef = useRef(null);
  const history = useHistory()
  const [studentDataValues, setStudentDataValues] = useState([])
  const [file, setFile] = useState('')
  const [files, setFiles] = useState([])
  const [filesNewName, setFilesNewName] = useState(id)
  const [newName, setNewName] = useState([])

    useEffect(() => {
      
        const fetchStudentData = async function() {
          const studentData = await getRegisterationStudentsById(id)
          console.log(studentData)
          setStudentDataValues(studentData)
        }
        fetchStudentData()
    }, [])
           /*const { register, handleSubmit } = useForm({
    defaultValues: { text: todo ? todo.text : "" },
  });*/

  /*const submitHandler = handleSubmit((data) => {
    onSubmit(data)
  });*/
  const timerId = setTimeout(() => {
    chartsData()
  }, 1500);

  const chartsData = () => {
    fileForCv()

}


const fileChanged = (e) => {
  var testingFileChange  = e.target.files[0]
  //testingFileChange.name = "hi"
  var file = testingFileChange;
  var blob = file.slice(0, file.size, file.type);
  var random = Math.floor(Math.random() * 100000) + 100
  var settingName = id + random + file.name 
  var newFile = new File([blob], settingName, {type: file.type});
  setNewName(settingName)
  console.log(newFile)
  const f = newFile
  setFile(f)
}
const uploadFile = () => {
  let data = new FormData();
  data.append('file', file);
  console.log(file)
  console.log(data)
  createAudioFile(data)
  /*
  fetch('/api/files', {
    method: 'POST',
    body: data
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        this.loadFiles();
      } else {
        alert('Upload failed');
      }
    });
    */
}



const fileForCv = () => {
    axios({
        method: "POST",
        url: `https://syntics.co/api/file/display/${location.state.referenceName}`,
        responseType: "blob"
      })
        .then(res => rezzingFileForCv(res.data),)
        
  }
  const rezzingFileForCv = (response) => {
    var urlCreator = window.URL || window.webkitURL;
    var cvUrl = urlCreator.createObjectURL(response);
    document.querySelector("#audioReference").href = cvUrl;
  }
  const log = (data) => {
      if (editorRef.current) {
        data.answerContent = editorRef.current.getContent({ format: "text" });
        data.studentId = data.studentId.id
        data.teacherId = location.state.teacherId
        data.coursetype = location.state.coursetype
        data.name = studentDataValues.name
        data.email = studentDataValues.email
        data.referenceName = newName

        if((location.state.startDate != null) && (location.state.endDate != null)){
          console.log(data)
          createAssignmentAnswers(data)
          history.push(`/student/list-of-subjects-for-assignments/${id}`)
        }
        else{
          console.log(data)
          createAnswers(data)
          history.push(`/student/list-of-subjects/${id}`)
        }
      }
  };

  /*useEffect(() => {
    const fetchTodo = async () => {
      const blogstitle = await getPlacementTestblogstitle(`${props.match.params._id}`)
      setblogstitle(blogstitle)
    }
    fetchTodo()
  }, []);
  */
  const onSubmit = async (data) => {
    await uploadFile()
    await log(data)
    //history.push("/placement-blogstitle-details")
  }


    //1 Start of by making initial values 
    const formik = useFormik({
        initialValues: {
           name:'',
           email:'',
           grade: location.state.grade,
           coursetype:'',
           answertype: location.state.answertype,
           questionContent: location.state.questioncontent,
           questionTitle: location.state.questiontitle,
           totalMarks: location.state.totalmarks,
           answerContent:'',
           marksObtained: '',
           teacherRemarks: '',
           referenceName: '',
           questionReferenceName: location.state.referenceName,
           teacherId: '',
           studentId: {id},
           questionId: location.state._id
          
        },

        //4 Make onSubmit propert to handle what happens to data on form submisison

        onSubmit: values => {

          
          //createTodo(formik.values)
          //redirecting 
          //history.push("/")

          onSubmit(formik.values)

        },

        //5 Make validation property
        
        validate: values => {
            
            let errors = {}

            const letters = /^[A-Za-z ]+$/;

            const cnic = /^[0-9--]+$/;

            const phone = /^[0-9]+$/;

            const symbols = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
            
            return errors


        }


    })

    console.log("Form errors", formik.errors)
    
    return (
        <>
<div>
<div className = "mt-5 pt-4">
{/* Content Wrapper */}
<div id="content-wrapper" className="d-flex flex-column">
{/* Main Content */}
<div id="content">
  {/* Begin Page Content */}
  <div className="containerBlackDashboard-fluid">
    {/* Page Heading */}
    <h1 className="h3BlackDashboard mb-2 text-gray-800">Course Content</h1>
    {/* DataTales Example */}
    <div className="card shadow mb-4 text-center">
      <div className="card-header py-3" style = {{color : "white", backgroundColor : "#306EFF"}}>
        <h6 className="m-0 font-weight-bold text-white">{location.state.questiontitle}</h6>
      </div>
      <div className="card-body">
      {location.state.questioncontent}
      <div>
      <div className="card-header py-3 mt-4" style = {{color : "white", backgroundColor : "#306EFF"}}>
        <h6 className="m-0 font-weight-bold text-white">Attachment</h6>
      </div>
      <div className = "mt-4">
      <a id = "audioReference" className="text-dark" style = {{textDecoration : 'none', fontWeight : 'bold'}} >
      {location.state.referenceName}
      </a>
      </div>
      </div>
      </div>
    </div>
    <div className="card shadow mb-4 text-center">
      <div className="card-header py-3" style = {{color : "white", backgroundColor : "#306EFF"}}>
        <h6 className="m-0 font-weight-bold text-white">Answer</h6>
       
      </div>
      <div className="card-body">
      <div class="p-3 mb-2" style = {{color : "white", backgroundColor : "#306EFF"}}>
          <label><h6 className = "text-white">Upload a File</h6></label>
     </div>
      <input type="file" onChange={(e) => fileChanged(e)}/>
      </div>
      <div className="card-body">
      <form onSubmit={formik.handleSubmit}>
                  <div className = "mt-4"> 
                      <div class="p-3 mb-2" style = {{color : "white", backgroundColor : "#306EFF"}}>
                          <label><h6 className = "text-white">Type your Answer to above Question below</h6></label>
                      </div>
                      <hr />
                  </div>
                  <Editor
                        apiKey='zbxzyzqkm6uw6oz4uywxx4kbvw59xasjkldmya07y0hfjupf'
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue=""
                        init={{
                        height: 500,
                        browser_spellcheck : true,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
               
                    <div className="containerSass mt-3 mb-2">
                        <button type="submit" className="btn btn-outline-primary">
                        Submit Answer
                        </button>
                    </div>
                  </form>
      </div>
    </div>
  </div>
  {/* /.containerBlackDashboard-fluid */}
</div>
{/* End of Main Content */}
{/* Footer */}
<footer className="sticky-footer bg-white">
  <div className="containerBlackDashboard my-auto">
    <div className="copyright text-center my-auto">
      <span></span>
    </div>
  </div>
</footer>
{/* End of Footer */}
</div>
{/* End of Content Wrapper */}
{/* End of Page Wrapper */}
      </div>
      </div>
      </>
    )
}

export default FileUploadAnswerTypeForStudent
