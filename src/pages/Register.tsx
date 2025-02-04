import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useForm, SubmitHandler } from "react-hook-form"
import InputErrorMessage from '../components/ui/InputErrorMessage'
import { REGISTER_FORM } from '../data'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema } from '../validation'
import axiosInstance from '../config/axios.config'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { IErrorResponse } from '../interfaces'

interface IFormInput {
  username: string
  email: string
  password: string
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    setIsLoading(true);

    try {
      const { status } = await axiosInstance.post('/auth/local/register', data);
      if (status === 200) {
        toast.success(
          "You will navigate to the login page after 2 seconds to login.",
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

        setTimeout(() => {
          navigate("/login");
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
  console.log(errors)

  // Renders
  const renderRegisterForm = REGISTER_FORM.map(({ name, placeholder, type, validation }, index) => {
    return (
      <div key={index}>
        <Input type={type} placeholder={placeholder} {...register(name, validation)} />
        {errors[name] &&
          <InputErrorMessage msg={errors[name]?.message} />
        }
      </div>
    )
  })
  
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} >
        {renderRegisterForm}

        {/* <div>
        <Input placeholder='Username' {...register('username', { required: true, minLength: 5 })} />
        {errors.username?.type === "required" && (
          <InputErrorMessage msg="Username is required" />
        )}
        {errors.username?.type === "minLength" && (
          <InputErrorMessage msg="Username must be at least 5 characters" />
        )}
        </div>

        <div>
        <Input placeholder='Email address' {...register('email', { required: "Email is required", pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ })} />
        {errors.email?.type === "required" && (
          <InputErrorMessage msg="Email is required" />
        )}
        {errors.email?.type === "pattern" && (
          <InputErrorMessage msg="Email is invalid" />
        )}
        </div>

        <div>
        <Input placeholder='Password' {...register('password', { required: "Password is required", minLength: 8 })} />
        {errors.password?.type === "required" && (
          <InputErrorMessage msg="Password is required" />
        )}
        {errors.password?.type === "minLength" && (
          <InputErrorMessage msg="Password must be at least 8 characters" />
        )}
        </div> */}

        <Button fullWidth isLoading={isLoading} >
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form>
    </div>
  )
}

export default RegisterPage
