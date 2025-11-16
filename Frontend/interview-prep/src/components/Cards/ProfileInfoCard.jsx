import React , { useContext }from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext';

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };


  return (
    <div className=''>
        <img
        src = {user.profileImageUrl}
        alt=""
        className=''/>
        <div>
            <div
            className=''>
                {user.name || ""}
            </div>
            <button
            className=''
            onClick={handleLogout}>
                Logout
            </button>
        </div>
    </div>
  )
}

export default ProfileInfoCard