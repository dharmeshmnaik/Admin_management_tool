import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Employee() {
  const [data, setData] = useState([])
  const [app, setApp] = useState({
		name: '',
		email: '',
		contact: '',
		comment: '',
		oldemail:'',
		oldcontact:''
	})

  useEffect(()=> {
    axios.get('http://localhost:7500/getEmployee')
    .then(res => {
      if(res.data.Status === "Success") {
        setData(res.data.Result);
      } else {
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }, [])

  const handleDelete = (id) => {
    axios.delete('http://localhost:7500/delete/'+id)
    .then(res => {
      if(res.data.Status === "Success") {
        window.location.reload(true);
      } else {
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }
  function unixTime(unixtime) {
    let ip =unixtime.split(/[TZ]/);
    let [Day, Time] = ip;
    return Day
    };
  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Approval List</h3>
      </div>
      <Link to="/create" className='btn btn-success'>Add Employee</Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>SL.NO</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Action</th>
              <th>Approvals</th>
              <th>Upcomming Change</th>
              <th>Requested Date</th>
              <th>Reason for change</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return <tr key={index}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.contact}</td>
                  <td>
                    <Link to={`/employeeEdit/`+employee.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                    <button onClick={e => handleDelete(employee.id)} className='btn btn-sm btn-danger'>delete</button>
                  </td>
                  <td>
                  
                  {(employee.oldemail || employee.oldcontact) && <Link to={`/approval/`+employee.id} className='btn btn-success btn-sm me-2'>Pending Approvel</Link>}
                  
                  </td>
                  <td>{(employee.oldemail) &&<p>Email: {employee.oldemail}</p>}
                  {(employee.oldcontact) && <p>Contact: {employee.oldcontact}</p>}</td>
                  <td>{unixTime(employee.updatetime)}</td>
                  <td>{employee.comment}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employee