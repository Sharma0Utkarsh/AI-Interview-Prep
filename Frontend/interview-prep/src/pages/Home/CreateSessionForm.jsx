import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input"
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreateSessionForm = () => {
    const [fromData, setFormData] = useState({
        role: "",
        experience: "",
        topicsToFocus:"",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (key,value) =>{
        setFormData((prevData) =>({
            ...prevData,
            [key]: value,
        }));
    };

    const handleCreateSession = async (e) =>{
        e.preventDefault();

        const {role ,experience, topicsToFocus} = fromData;

        if(!role || !experience ||!topicsToFocus){
            setError("Please fill all the required fields")
            return;
        }

        setError("");
        setIsLoading(true);

        try{
            //Call AI API to generate questions

            const aiResponse =  await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS,
                {
                    role,
                    experience,
                    topicsToFocus,
                    numberOfQuestions: 10,
                }
            );

            //Should be array like [{question, answer},...]
            const generatedQuestions = aiResponse.data;
            const response =  await axiosInstance.post(API_PATHS.SESSION.CREATE,{
                ...fromData,
                questions: generatedQuestions,
            });

            if(response.data?.session?._id){
                navigate(`/interview-prep/${response.data?.session?._id}`);
            }
        }catch(error){
            if (error.response && error.response.data.message){
                setError(error.response.data.message);
            }else{
                setError("Something went wrong...")
            }
        } finally{
            setIsLoading(false);
        }
    };
  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
        <h3 className='text-lg font-semibold text-black'>
            Start a New Interview Journey
        </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-3'>
            Fill out a few quick details and unlock your personalized set of interview questions!
        </p>
        <form onSubmit={handleCreateSession} className=''>
            <Input
            value={fromData.role}
            onChange={({ target })=> handleChange("role",target.value)}
            label="Target Role"
            placeholder="(e.g., Frontend Developer, UI/UX Designer,etc.)"
            type= "text"
            />

            <Input
            value={fromData.experience}
            onChange={({ target })=> handleChange("experience",target.value)}
            label="Year of Experience"
            placeholder="(e.g.,1 year, 3 year, 5+ year )" 
            type= "number"
            />

            <Input
            value={fromData.topicsToFocus}
            onChange={({ target })=> handleChange("topicsToFocus",target.value)}
            label="Topics to Focus On"
            placeholder="(Comma-Separated, e.g., React, Node.js , MongoDB)"
            type= "text"
            />

            <Input
            value={fromData.description}
            onChange={({ target })=> handleChange("description",target.value)}
            label="Description"
            placeholder="(Any specific goals or notes for this session)"
            type= "text"
            />

            {error && <p className='text-rose-500 text-xs pb-2.5'>{error}</p>}

            <button
                type="submit"
                className='w-full mt-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 cursor-pointer'
                disabled={isLoading}
            >
              {!isLoading && <SpinnerLoader/>}  Create Session
            </button>
        </form>
    </div>
  
)};

export default CreateSessionForm;