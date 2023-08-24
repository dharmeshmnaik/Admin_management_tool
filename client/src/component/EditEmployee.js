import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function EditEmployee({approve}) {
	console.log(approve);
	const [data, setData] = useState({
		name: '',
		email: '',
		contact: '',
		comment: '',
		oldemail:'',
		oldcontact:''
	})
	const [sdata, setChangeData] = useState({
		comment: '',
		oldemail:'',
		oldcontact:'',
		
	})
	const navigate = useNavigate()
	
	const {id} = useParams();

	useEffect(()=> {
		axios.get('http://localhost:7500/get/'+id)
		.then(res => {
			setData({...data, name: res.data.Result[0].name,
				email: res.data.Result[0].email,
				address: res.data.Result[0].address,
				contact: res.data.Result[0].contact,
				comment: res.data.Result[0].comment,
				oldemail:res.data.Result[0].oldemail,
				oldcontact:res.data.Result[0].oldcontact,
				
			})
		})
		.catch(err =>console.log(err));
	}, [])

	const handleSubmit = (event) => {
		if(approve==="trigger"){
			event.preventDefault();
		axios.put('http://localhost:7500/updateapproval/'+id, sdata)
		.then(res => {
			if(res.data.Status === "Success") {
				navigate('/employee')
			}
		})
		.catch(err => console.log(err));
			alert(`submited for approval`);
		}else{
		event.preventDefault();
		axios.put('http://localhost:7500/update/'+id, data)
		.then(res => {
			if(res.data.Status === "Success") {
				navigate('/employee')
			}
		})
		.catch(err => console.log(err));
	}
	}
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
			<h2>Update Employee</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
			<div class="col-12">
					<label for="inputName" class="form-label">Name</label>
					<input type="text" class="form-control" id="inputName" placeholder='Enter Name' autoComplete='off'
					onChange={e => setData({...data, name: e.target.value})} value={data.name}/>
				</div>
				<div class="col-12">
					<label for="inputEmail4" class="form-label">Email</label>
					<input type="email" class="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
					onChange={e => {setData({...data, email: e.target.value});setChangeData({...sdata, oldemail: e.target.value})}} value={data.email}/>
				</div>
				<div class="col-12">
					<label for="inputContact" class="form-label">Phone Number</label>
					<input type="text" class="form-control" id="inputContact" placeholder="Enter Phone Number" autoComplete='off'
					onChange={e => {setData({...data, contact: e.target.value});setChangeData({...sdata, oldcontact: e.target.value})}} value={data.contact}/>
				</div>
				<div class="col-12">
					<label for="inputcommentt" class="form-label">Comment</label>
					<input type="textarea" class="form-control" id="inputContact" placeholder="Enter Reason for change" autoComplete='off'
					onChange={e => {setData({...data, comment: e.target.value});setChangeData({...sdata, comment: e.target.value})}}value={data.comment}/>
				</div>
				<div class="col-12">
					<button type="submit" class="btn btn-primary">Update</button>
				</div>
			</form>
		</div>
  )
}

export default EditEmployee