import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LOGIN_FORM } from "../data";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { loginSchema } from "../validation";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

interface IFormInput {
  identifier: string
  password: string
}

const LoginPage = () => {
 const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    setIsLoading(true);

    try {
      const { status , data: resData } = await axiosInstance.post('/auth/local', data);
      if (status === 200) {
        toast.success(
          "You will navigate to the home page after 2 seconds",
          {
            position: "bottom-center",
            duration: 1500,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
            },
          }
        );

        localStorage.setItem("loggedInUser", JSON.stringify(resData));

        setTimeout(() => {
          location.replace("/");
        }, 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renders
  const renderLoginForm = LOGIN_FORM.map(({ name, placeholder, type, validation }, index) => {
    return (
      <div key={index}>
        <Input type={type} placeholder={placeholder} {...register(name, validation)} />
        {errors[name] &&
          <InputErrorMessage msg={errors[name]?.message} />
        }
      </div>
    )
  });

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}
        {/* <Input placeholder="Email address" />
        <Input placeholder="Password" /> */}
        <Button fullWidth isLoading={isLoading}>Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;
