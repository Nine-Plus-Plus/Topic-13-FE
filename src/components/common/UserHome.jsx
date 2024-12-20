import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import path from '../../utils/path';
import { getAllSkill } from '../../apis/SkillServices';
import { getTop3Mentor } from '../../apis/MentorServices';
import icons from '../../utils/icon';
import Loading from './Loading';

const UserHome = () => {
  const [mentors, setMentors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { FaStar, FaStarHalf } = icons;
  const ITEMS_PER_PAGE = 5; // Số lượng kỹ năng hiển thị trên mỗi trang

  const handleStar = star => {
    let stars = [];
    if (star > 0) for (let i = 1; i <= star; i++) stars.push(<FaStar color="#F8D72A" className="start-item" />);
    if (star > 0 && star % 1 !== 0) stars.push(<FaStarHalf color="#F8D72A" className="start-item" />);
    return stars;
  };

  // Tính toán các chỉ mục hiển thị
  const startIndex = currentIndex;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleSkills = skills.slice(startIndex, endIndex);

  const handleNext = () => {
    const remainingSkills = skills.length - endIndex;
    if (remainingSkills > 0) {
      setCurrentIndex(currentIndex + Math.min(2, remainingSkills));
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      const previousSkills = currentIndex;
      setCurrentIndex(currentIndex - Math.min(2, previousSkills));
    }
  };

  // Lấy danh sách top mentor
  useEffect(() => {
    const fetchTop3Mentor = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        const response = await getTop3Mentor(token);
        console.log(response);

        response?.statusCode === 200 ? setMentors(response?.mentorsDTOList) : setMentors([]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTop3Mentor();
  }, []);

  // Lấy danh sách skills
  useEffect(() => {
    const fetchSkill = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        const response = await getAllSkill('', token);
        setSkills(response.data.skillsDTOList);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, []);

  return (
    <div className="flex flex-col">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <Loading />
        </div>
      )}
      {/* Header: Top Mentor */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="row mb-5 flex justify-center font-bold text-xl text-main-1">Top3 Mentors of the Week</div>
        <div className="flex justify-between items-center p-3 ">
          {mentors?.map(mentor => (
            <div key={mentor.id} className="w-1/3 p-2 border-2 shadow-2xl mr-5">
              <div className="relative overflow-visible">
                <div
                  className="relative overflow-hidden transition-transform duration-300 ease-in-out transform hover:-translate-y-8"
                  data-animation="true"
                >
                  <div className="flex justify-center mt-n4 mx-3">
                    <img src={mentor?.user?.avatar} alt="avatar" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                </div>
                <div className="flex flex-col flex-grow text-center p-2">
                  <p className="text-lg font-bold text-red-500">{mentor.user.fullName}</p>
                  <div className="flex justify-center">
                    {handleStar(mentor.star).length > 0 &&
                      handleStar(mentor.star).map((star, number) => {
                        return <span key={number}>{star}</span>;
                      })}
                  </div>
                  <p className="text-dark">{mentor.skills.map(skill => skill.skillName).join(', ')}</p>
                </div>
                <div className="flex justify-center">
                  <Button
                    text={'View Profile'}
                    fullWidth={'w-full'}
                    htmlType={'text'}
                    bgColor={'bg-blue-500'}
                    textColor={'text-white'}
                    textSize={'text-sm'}
                    to={`view-mentor/${path.USER_PROFILE}/Mentor/${mentor.user.id}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="gap-3 pt-5">
        <div className="bg-white p-8 rounded-lg border-2 shadow-2xl">
          <div className="row mb-5 flex justify-center font-bold text-xl text-main-1">Skills</div>

          <div className="flex items-center">
            {/* Nút mũi tên trái */}
            {startIndex > 0 && (
              <button onClick={handlePrevious} className="text-main-1 text-2xl mr-3 hover:cursor-pointer">
                &#8592; {/* Mũi tên trái */}
              </button>
            )}

            {/* Danh sách kỹ năng */}
            <div className="flex justify-between p-3 overflow-hidden w-full">
              {visibleSkills && visibleSkills.length > 0 ? (
                visibleSkills.map(skill => (
                  <Link
                    key={skill.id}
                    to={`${path.USER_VIEW_MENTOR}?skill=${skill?.id}`}
                    className="bg-white p-5 rounded-lg border-2 shadow-2xl flex flex-col items-center mx-2 transition-transform duration-300 hover:scale-105"
                    style={{ flex: '0 0 18%' }}
                  >
                    <div className="mt-2 text-dark text-center" title={skill?.skillDescription}>
                      {skill?.skillName}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center w-full text-gray-500">The skill list is null</div>
              )}
            </div>

            {/* Nút mũi tên phải */}
            {endIndex < skills.length && (
              <button onClick={handleNext} className="text-main-1 text-2xl ml-3 hover:cursor-pointer">
                &#8594; {/* Mũi tên phải */}
              </button>
            )}
          </div>

          {/* <div className="flex justify-between overflow-x-auto p-3" style={{ overflowY: 'hidden' }}>
            {skills && skills.length > 0 ? (
              skills.map(skill => (
                <Link
                  key={skill.id}
                  to={`${path.USER_VIEW_MENTOR}?skill=${skill?.id}`}
                  className="bg-white p-5 rounded-lg border-2 shadow-2xl flex flex-col items-center mx-2 transition-transform duration-300 hover:scale-105"
                  style={{ flex: '0 0 15.35%' }}
                >
                  <div className="mt-2 text-dark text-center" title={skill?.skillDescription}>
                    {skill?.skillName}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center w-full text-gray-500">The skill list is null</div>
            )}
          </div> */}
        </div>
      </div>

      {/* Features */}
      <div className="flex gap-3 pt-5 pb-10">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="font-bold text-xl pb-5">Wide Networking</h2>
            <p>
              Connect to reputation mentors all over the campus. Just stay at home and learn with mentor through our
              website.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-bold text-xl pb-5">Easy & Fast</h2>
            <p>Choose mentors and book sessions in just few steps. Search fast with our helpful filter.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-bold text-xl pb-5">Upgrade Your Skills</h2>
            <p>Find your topic and gain knowlege, then improve your skill with our experienced mentors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
