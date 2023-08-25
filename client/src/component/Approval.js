import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';


function Approval({}) {
	//console.log(approve);
	const [data, setData] = useState({
		name: '',
		email: '',
		contact: '',
		comment: '',
		oldemail:'',
		oldcontact:''
	})
	const [sdata, setChangeData] = useState({
		email: '',
		contact: '',
        comment: '',
		oldemail:'',
		oldcontact:'',
		
	})
    const [checked, setChecked] = useState(false);
    const [lchecked, setLchecked] = useState(false);
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
    const handlecheck =(e) => {
        setChecked(true); 
        setChangeData({...sdata, contact: data.oldcontact, email:data.oldemail, oldemail:"",oldcontact:"",comment:""});
        alert('approving request')

    }
    const handlereject =(e) => {
        setLchecked(true); 
        setChangeData({...sdata, contact: data.contact, email:data.email, oldemail:"",oldcontact:"",comment:""});
        alert('rejecting request')

    }
	const handleApprove = (event) => {
		event.preventDefault();
        //console.log(JSON.stringify(sdata))
		axios.put('http://localhost:7500/update/'+id, sdata)
		.then(res => {
			if(res.data.Status === "Success") {
				navigate('/employee')
                alert(`Operation sucessful!`)
			}
		})
		.catch(err => console.log(err));
	
	}
    
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
			<h2>Approve Employee</h2>
			<form class="row g-3 w-50" onSubmit={handleApprove}>
			<div class="col-12">
					<label for="inputName" class="form-label">Name</label>
					<input type="text" class="form-control" id="inputName"disabled placeholder='Enter Name' autoComplete='off'
					 value={data.name}/>
				</div>
				<div class="col-12">
					<label for="inputEmail4" class="form-label">Current Email</label>
					<input type="email" class="form-control" id="inputEmail4" disabled placeholder='Enter Email' autoComplete='off'
					 value={data.email}/>
				</div>
				
                <div class="col-12">
					<label for="inputEmail4" class="form-label">Upcomming Email</label>
					<input type="email" class="form-control" id="inputEmail4" disabled placeholder='Upcomming Enter Email' autoComplete='off'
					value={data.oldemail}/>
				</div>
                <div class="col-12">
					<label for="inputContact" class="form-label">Current Phone Number</label>
					<input type="text" class="form-control" id="inputContact" disabled placeholder="Enter Phone Number" autoComplete='off'
					 value={data.contact}/>
				</div>
				<div class="col-12">
					<label for="inputContact" class="form-label">Upcomming Phone Number</label>
					<input type="text" class="form-control" id="inputContact" disabled placeholder="Upcomming Phone Number" autoComplete='off'
					value={data.oldcontact}/>
				</div>
				<div class="col-12">
					<label for="inputcommentt" class="form-label">Comment</label>
					<input type="textarea" class="form-control" id="inputContact"disabled placeholder="Enter Reason for change" autoComplete='off'
					value={data.comment}/>
				</div>
				
                
                <div class="col-12">
					{checked ? <button type="submit" class="btn btn-primary">Proceed?</button> :<><button type="button" onClick={(e) =>{handlecheck(e)}}class="btn btn-primary">Approve</button></>}
				</div>
			    <div class="col-12">
					{lchecked ? <button type="button" class="btn btn-primary">Proceed?</button> :<><button type="button" onClick={(e) =>{handlereject(e)}}class="btn btn-primary">Reject</button></>}
				</div>
            </form>
		</div>
  )
}

export default Approval