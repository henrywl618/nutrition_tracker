import React, {useState} from "react";
import axios from "axios";

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
                setLoggedIn(true);
                setCurrentView("diary");
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
            <h2>Login</h2>
            <p className="text-danger">{error}</p>
            <form>
                <label htmlFor="username">
                Username: 
                </label>
                <input id="username" name="username" onChange={handleChange} value={formData.username}></input>
                <label htmlFor="password">
                Password: 
                </label>
                <input type="password" id="password" name="password" onChange={handleChange} value={formData.password}></input>
                <button onClick={login}>Login</button>
            </form>
        </div>
    )
};

export default LoginForm;