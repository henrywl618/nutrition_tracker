import React, {useState} from "react";
import axios from "axios";

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
                setLoggedIn(true);
                setCurrentView("diary");
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
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" onChange={changeForm} value={formData.username}></input>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" onChange={changeForm} value={formData.password}></input>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" onChange={changeForm} value={formData.email}></input>
                <button onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    );
};

export default SignupForm;