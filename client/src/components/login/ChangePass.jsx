import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { EyeInvisibleFilled, EyeTwoTone, LockOutlined } from '@ant-design/icons';
import { Button } from '../index';

const ChangePass = () => {
  const [form] = Form.useForm();
  const [isShowPass, setIsShowPass] = useState(false);
  const [payload, setPayload] = useState({});

  const onFinish = values => {
    setPayload(values);
  };

  return (
    <div className="w-full h-min-heigh-custom flex items-center justify-center">
      <div
        className="w-1/3 shadow-2xl p-6 gap-8 border
                flex flex-col items-center justify-center rounded-lg"
      >
        <h1 className="text-3xl font-semibold text-orange-600 font-Merriweather text-center">
          Welcome To Booking Mentor System
        </h1>
        <div className="flex justify-start items-center w-full gap-5 border-b text-lg font-bold">
          <span className="text-gray-600 border-b-4 border-orange-600">Change Password</span>
        </div>
        <div className="w-full">
          <Form name="change_password" initialValues={{ remember: true }} form={form} onFinish={onFinish}>
            {/* Password field */}
            <Form.Item name="newPassword" rules={[{ required: true, message: 'Please input your new Password!' }]}>
              <Input
                prefix={<LockOutlined className="mr-2" />}
                type={isShowPass ? 'text' : 'password'}
                placeholder="New Password"
                className="text-xl"
                suffix={
                  isShowPass ? (
                    <EyeTwoTone className="text-gray-400" onClick={() => setIsShowPass(false)} />
                  ) : (
                    <EyeInvisibleFilled className="text-gray-400" onClick={() => setIsShowPass(true)} />
                  )
                }
              />
            </Form.Item>

            {/* Confirm Password field */}
            <Form.Item
              name="confirmNewPassword"
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  }
                })
              ]}
            >
              <Input
                prefix={<LockOutlined className="mr-2" />}
                type={isShowPass ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="text-xl"
                suffix={
                  isShowPass ? (
                    <EyeTwoTone className="text-gray-400" onClick={() => setIsShowPass(false)} />
                  ) : (
                    <EyeInvisibleFilled className="text-gray-400" onClick={() => setIsShowPass(true)} />
                  )
                }
              />
            </Form.Item>

            {/* Submit button */}
            <Form.Item className="flex items-center justify-center w-full">
              <Button textColor="text-white" bgColor="bg-main-1" bgHover="bg-main-2" text="Confirm" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
