import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login (){
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [loginInfos, setLoginInfos] = useState({
    email: "",
    password: "",
  });
  const onInputChanged = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    const infosObj = { ...loginInfos };
    infosObj[inputName] = inputValue;
    setLoginInfos(infosObj);
  };

  const onBtnClicked = (e) => {
    e.preventDefault();

    const url = "http://localhost:3001/login";
    if(loginInfos?.email){

      axios.post(url, loginInfos,{ withCredentials: true }).then((res) => {
        const errMsg = res?.data?.message;
  
        if (errMsg) setErrMsg(errMsg.split(":").pop());
        else navigate("/")
  
      });
    }
  };
  return (
    <div className="p-2 items-center justify-center ">
      <div className="block lg:flex bg-white lg:shadow-lg rounded-lg">
        <div className="w-full lg:w-1/3 flex lg:border-r border-gray-200">
          <div className="m-auto rounded-full">
            <a
              href="/"
              className="flex items-base pt-10 lg:p-2 -mb-10 lg:-mb-0"
            >
              <img
                src="https://img.freepik.com/premium-vector/chat-app-logo-design-template-can-be-used-icon-chat-application-logo_605910-1724.jpg"
                alt=""
                className="w-12 lg:w-64"
              />
              <div className="block lg:hidden text-2xl text-primary hover:text-primary tracking-wide font-semibold uppercase">
                Chat APP
              </div>
            </a>
          </div>
        </div>
        <div className="w-full lg:w-2/3 px-6 py-16">
          <div className="mb-4 font-light tracking-widest text-2xl">
            SIGN IN
          </div>
          <form>
            <FormInput inputType="email" onInputChanged={onInputChanged} />
            <FormInput inputType="password" onInputChanged={onInputChanged} />

            <div className="block md:flex items-center justify-between">
              <button
                onClick={onBtnClicked}
                className="align-middle bg-blue-500 hover:bg-blue-600 text-center px-4 py-2 text-white text-sm font-semibold rounded-lg inline-block shadow-lg"
              >
                LOGIN
              </button>
       
              <p className="text-xs text-red-500">{errMsg}</p>
            </div>
            <h3 className="text-center text-blue-500 cursor-pointer"
            onClick={()=>navigate('../signup')}
            >Don't have an account??</h3>
          </form>
        </div>
      </div>
    </div>
  );
};

function FormInput({ inputType, onInputChanged }) {
  const label = inputType[0].toUpperCase() + inputType.slice(1);

  return (
    <div className="mb-4">
      <label for={inputType} className="block mb-2 text-sm text-gray-800">
        {label}
      </label>
      <input
        type={inputType}
        name={inputType}
        onChange={onInputChanged}
        className="focus:border-blue-500 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
        autocomplete={inputType}
        required
      />
      <div v-if="feedback.email.error">
        <div
          className="text-sm text-red-500 mt-2"
          v-text="feedback.email.message"
        ></div>
      </div>
    </div>
  );
}

