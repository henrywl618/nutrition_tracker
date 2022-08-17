import React, {useState} from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const LoginForm = ({setLoggedIn, setCurrentView})=>{
    
    let [formData, setFormData] = useState({username:"",
                                            password:""});
    let [error, setError] = useState("");
    
    const handleChange = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setFormData((data)=>{
            const copy = {...data,[name]:value}
            return copy
        });
    };

    const login = async (e)=>{
        e.preventDefault();
        setError("");
        try{
            const resp = await axios({method:"post",
                                    url:"http://127.0.0.1:5000/login",
                                    headers:{"Content-Type":"application/json"},
                                    data:{username:formData.username,
                                        password:formData.password}})
            if (resp.data.msg === "Login successful"){
                localStorage.setItem('accessToken',resp.data.access_token);
                localStorage.setItem('user',resp.data.user);
                setLoggedIn(true);
                setCurrentView({view:"mealplan"});
            }
        }
        catch(error){
            if(error.response.data.msg === "Bad username or password"){
                setError(error.response.data.msg);
            }else{
                console.log(error)
            }
        }

    }

    return(
        <div>
            <p className="text-danger">{error}</p>
            <div className="row justify-content-center m-3">
            <form className="SignupForm-form col-lg-3 col-md-6">
                <div>   
                    <label className="form-label" htmlFor="username">Username:</label>
                    <input className="form-control"type="text" name="username" id="username" onChange={handleChange} value={formData.username}></input>
                </div>
                <div>
                    <label className="form-label" htmlFor="password">Password:</label>
                    <input className="form-control"type="password" name="password" id="password" onChange={handleChange} value={formData.password}></input>
                </div>
                <Button className="greenbutton my-2" onClick={login}>Login</Button>
            </form>
            </div>
        </div>
    )
};

export default LoginForm;