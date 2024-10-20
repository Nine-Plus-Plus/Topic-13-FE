import React, { memo, useEffect, useState } from 'react';
import Button from './Button';
import { useUserStore } from '../../store/useUserStore';
import { UserItem } from '..';
import { capitalizeFirstLetter } from '../../utils/commonFunction';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import { getStudentNotGroup } from '../../apis/StudentServices';

const GroupItem = ({
  idGroup,
  groupName,
  idTopic,
  totalPoint,
  projectName,
  totalMember,
  process,
  className,
  leader
  // setJoined,
  // joined
}) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const [joined, setJoined] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [studentNoGroup, setStudentNoGroup] = useState([]);
  const { userData } = useUserStore();

  const handleJoinForStudent = () => {
    setJoined(!joined);
  };

  const showADdMemberModal = () => {
    setAddModal(true);
  };

  const handleCancel = () => {
    setAddModal(false);
  };

  useEffect(() => {
    console.log(userData);

    const fetchStudentNoGroup = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getStudentNotGroup(userData?.aclass?.id, token);
        if (response && response?.statusCode === 200) setStudentNoGroup(response?.studentsDTOList);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudentNoGroup();
  }, [addModal]);

  const { role } = useUserStore();
  return (
    <div className=" border shadow-md rounded-md p-3 w-full">
      <h1 className="font-bold text-xl text-main-1"> Group name: {groupName}</h1>
      <div className="flex p-2 justify-between">
        <div className="flex flex-col gap-2 text-md">
          <p>Project Name: {projectName}</p>
          <p>Topic: {idTopic}</p>
          <p>Leader: {leader}</p>
        </div>
        <div className="flex flex-col gap-2 text-md">
          <p>Process: {process}%</p>
          <p>Total Point: {totalPoint} FUP</p>
          <p>Total member: {totalMember?.length}/5</p>
        </div>
        <div className="flex justify-center h-full flex-col gap-3 w-1/5">
          <Button
            text={isShowMore ? 'Show Less' : 'Show More'}
            textColor={'text-white'}
            bgColor={'bg-yellow-500'}
            bgHover={'hover:bg-yellow-400'}
            htmlType={'button'}
            fullWidth={'w-4/5'}
            onClick={() => {
              setIsShowMore(!isShowMore);
            }}
          />
          {role === 'MENTOR' && totalMember?.length < 5 && (
            <Button
              text={'Add More'}
              textColor={'text-white'}
              bgColor={'bg-green-500'}
              bgHover={'hover:bg-green-400'}
              htmlType={'button'}
              fullWidth={'w-4/5'}
              onClick={showADdMemberModal}
            />
          )}
          {totalMember?.length < 5 ? (
            role !== 'MENTOR' &&
            (joined ? (
              <Button
                text={'Join'}
                textColor={'text-white'}
                bgColor={'bg-green-500'}
                bgHover={'hover:bg-green-400'}
                htmlType={'button'}
                fullWidth={'w-4/5'}
                onClick={handleJoinForStudent}
              />
            ) : (
              <Button
                text={'Sent'}
                textColor={'text-white'}
                bgColor={'bg-gray-500'}
                bgHover={'hover:bg-gray-400'}
                htmlType={'button'}
                fullWidth={'w-4/5'}
                acHover={'hover:cursor-not-allowed'}
              />
            ))
          ) : (
            <Button
              text={'Full'}
              textColor={'text-white'}
              bgColor={'bg-red-500'}
              htmlType={'button'}
              fullWidth={'w-4/5'}
              acHover={'hover:cursor-not-allowed'}
            />
          )}
        </div>
      </div>
      {isShowMore && (
        <div
          className={`transition-all duration-1000 ease-out transform ${
            isShowMore ? 'translate-y-0 opacity-100 max-h-[1000px]' : '-translate-y-10 opacity-0 max-h-0'
          } overflow-hidden`}
        >
          {totalMember?.map(member => (
            <UserItem
              key={member.id}
              roleItem={capitalizeFirstLetter(member?.user?.role?.roleName)}
              specialized={member?.expertise}
              name={member?.user?.fullName}
              gender={member?.user?.gender}
              isAdded={false}
              idUser={member?.user?.id}
              code={member?.studentCode}
              groupRole={member?.groupRole}
              avatar={member?.user?.avatar}
            />
          ))}
        </div>
      )}
      {/* Modal Add Member */}
      <Modal
        title="Add Member To Group"
        open={addModal}
        onCancel={handleCancel}
        onOk={() => {
          form.submit();
        }}
        width={1500}
        style={{ top: 40 }}
      >
        <div className="max-h-[75vh] overflow-y-auto w-full flex flex-col gap-3">
          {studentNoGroup?.map(student => (
            <UserItem
              key={student?.id}
              idStudent={student?.id}
              addGroup={idGroup}
              roleItem={capitalizeFirstLetter(student?.user?.role?.roleName)}
              specialized={student?.expertise}
              name={student?.user?.fullName}
              gender={student?.user?.gender}
              isAdded={false}
              idUser={student?.user?.id}
              code={student?.studentCode}
              mentorAdd={userData?.id}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default memo(GroupItem);