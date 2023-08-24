import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditEmployee from './EditEmployee';

function EmployeeDetail() {
    const {id} = useParams();
    const navigate = useNavigate()
    const [employee, setEmployee] = useState([])
    const [edit,setEdit] = useState(false)
    const [change,setChange] = useState("notrigger")
    useEffect(()=> {
        axios.get('http://localhost:7500/get/'+id)
        .then(res => setEmployee(res.data.Result[0]))
        .catch(err => console.log(err));
    },[])
    const handleLogout = () => {
		axios.get('http://localhost:7500/logout')
		.then(res => {
			navigate('/start')
		}).catch(err => console.log(err));
	}
    const handleedit = (event) => {
		setEdit(true);
        setChange("trigger")

    }
  return (
    <div>
        <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
              <div className='d-flex align-items-center flex-column mt-5'>
                {!edit ? <>
                <h3>Name: {employee.name}</h3>
                <h3>Email: {employee.email}</h3>
                <h3>Contact: {employee.contact}</h3></> 
                :<EditEmployee approve={change}/>  }
                
            </div>
            <div>
                <button className='btn btn-primary me-2' onClick={handleedit}>Edit</button>
                <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </div>
        </div>
    </div>
  )
}

export default EmployeeDetail