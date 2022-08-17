import React, {useState} from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "./SignupForm.css"

const SignupForm = ({setLoggedIn, setCurrentView})=>{
    const emptyFormData = {username:"",
                           password:"",
                           email:"",
                           };
    let [formData, setFormData] = useState(emptyFormData);
    let [error, setError] = useState("");
    
    const changeForm = (e)=>{
        setFormData((currentData)=>{
            const copy =  {...currentData,[e.target.name]:e.target.value}
            return copy
        });
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        try{
            const resp = await axios({method:"post",
                                    url:"http://127.0.0.1:5000/signup",
                                    headers:{"Content-Type":"application/json"},
                                    data:{username:formData.username,
                                        password:formData.password,
                                        email:formData.email}})
                                        
            if (resp.data.msg === "Signup successful"){
                localStorage.setItem('accessToken',resp.data.access_token);
                localStorage.setItem('user',resp.data.user);
                setLoggedIn(true);
                setCurrentView({view:"mealplan"});
            } else {
                setError(resp.data.msg)
            }    
        }
        catch(error){
            console.log(error)
        }
    
    }

    return(
        <div>
            <h3>Signup</h3>
            <p className="text-danger">{error}</p>
            <div className="row justify-content-center m-3">
            <form className="SignupForm-form col-lg-3 col-md-6">
                <div>   
                    <label className="form-label" htmlFor="username">Username:</label>
                    <input className="form-control"type="text" name="username" id="username" onChange={changeForm} value={formData.username}></input>
                </div>
                <div>
                    <label className="form-label" htmlFor="password">Password:</label>
                    <input className="form-control"type="password" name="password" id="password" onChange={changeForm} value={formData.password}></input>
                </div>
                <div>
                    <label className="form-label" htmlFor="email">Email:</label>
                    <input className="form-control"type="email" name="email" id="email" onChange={changeForm} value={formData.email}></input>
                </div>
                <Button className="greenbutton my-2" onClick={handleSubmit}>Create Account</Button>
            </form>
            </div>
        </div>
    );
};

export default SignupForm;