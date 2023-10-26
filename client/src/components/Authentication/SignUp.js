import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp (){
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [userInfos, setUserInfos] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const onInputChanged = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    const infosObj = { ...userInfos };
    infosObj[inputName] = inputValue;
    setUserInfos(infosObj);
  };

  const onBtnClicked = (e) => {
    e.preventDefault();
    const url = "http://localhost:3001/register";
    axios.post(url, userInfos).then((res) => {
      const errMsg = res?.data?.message;
      const emailAlreadyExists = res?.data?.code == 11000;

      if (errMsg) setErrMsg(errMsg.split(":").pop());
      else if (emailAlreadyExists) setErrMsg("This email address already exists.");
      else navigate("/")
    });
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
            SIGN UP
          </div>
          <form>
            <FormInput inputType="name" onInputChanged={onInputChanged} />
            <FormInput inputType="surname" onInputChanged={onInputChanged} />
            <FormInput inputType="email" onInputChanged={onInputChanged} />
            <FormInput inputType="password" onInputChanged={onInputChanged} />

            <div className="block md:flex items-center justify-between">
              <button
                onClick={onBtnClicked}
                className="align-middle bg-blue-500 hover:bg-blue-600 text-center px-4 py-2 text-white text-sm font-semibold rounded-lg inline-block shadow-lg"
              >
                SIGN UP
              </button>
              <p className="text-xs text-red-500">{errMsg}</p>
            </div>
            <h3 className="text-center text-blue-500 cursor-pointer"
            onClick={()=>navigate('/login')}
            >Already have an account?</h3>
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

