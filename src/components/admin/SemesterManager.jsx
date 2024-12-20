import { Button, Table, Form, Modal, Input, message, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { createSemester, deleteSemester, getAllSemester, updateSemester } from '../../apis/SemesterServices';
import dayjs from 'dayjs';

const SemesterManager = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSemesters = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        const response = await getAllSemester(token);
        if (response?.data?.statusCode === 200)
          setSemesters(
            response?.data?.semesterDTOList?.map(semester => ({
              ...semester,
              dateCreated: dayjs(semester.dateCreated).format('HH:mm DD-MM-YYYY')
            }))
          );
        else setSemesters([]);
      } catch (err) {
        setError(err?.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  const showCreateModal = () => {
    form.resetFields(); // Xóa các giá trị trong form
    setIsCreateModalVisible(true); // Hiển thị modal tạo người dùng
  };

  const handleCreateSemester = async () => {
    const token = localStorage.getItem('token');
    let response;
    try {
      const values = await form.validateFields();
      const { dateStart, dateEnd } = values;

      const dataCreate = {
        ...values,
        dateStart: dayjs(dateStart).format('DD-MM-YYYY'),
        dateEnd: dayjs(dateEnd).format('DD-MM-YYYY')
      };
      console.log(dataCreate);

      response = await createSemester(dataCreate, token);
      console.log(response);

      if (response?.statusCode === 200 && response?.semesterDTO) {
        setSemesters([response?.semesterDTO, ...semesters]);
        setIsCreateModalVisible(false);
        message.success('Semester created successfully');
      } else {
        message.error('Failed to create semester:' + response?.message);
      }
    } catch (error2) {
      console.error('Create semester error:', error2);
      message.error('Failed to create semester: ' + (response.message || 'Unknown error'));
    }
  };

  const handleUpdateSemester = async () => {
    const token = localStorage.getItem('token');
    let response;
    try {
      const values = await form.validateFields();
      const { dateStart, dateEnd } = values;

      const dataCreate = {
        ...values,
        dateStart: dayjs(dateStart).format('DD-MM-YYYY'),
        dateEnd: dayjs(dateEnd).format('DD-MM-YYYY')
      };
      console.log(selectedSemester.id, dataCreate);

      response = await updateSemester(selectedSemester.id, dataCreate, token);
      console.log(response);

      if (response?.statusCode === 200) {
        // Cập nhật lại danh sách người dùng với thông tin mới
        setSemesters(
          semesters.map(semester => (semester.id === response.semesterDTO.id ? response.semesterDTO : semester))
        );
        setIsUpdateModalVisible(false);
        message.success('Semester update successfully');
      } else {
        message.error('Failed to update semester: ' + response?.message);
      }
    } catch (error2) {
      console.error('Update semester error:', error2);
      message.error('Failed to update semester: ' + (response.message || 'Unknown error'));
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const showUpdateModal = semester => {
    setSelectedSemester(semester);

    // Set values for the form
    form.setFieldsValue({
      semesterName: semester.semesterName,
      dateStart: dayjs(semester.dateStart, 'DD-MM-YYYY') || undefined,
      dateEnd: dayjs(semester.dateEnd, 'DD-MM-YYYY') || undefined
    });
    setIsUpdateModalVisible(true);
  };

  const handleDelete = async semesterId => {
    const token = localStorage.getItem('token');
    try {
      const response = await deleteSemester(semesterId, token);
      if (response && response.data.statusCode === 200) {
        message.success('Semester deleted successfully');
        setSemesters(prevSemester => prevSemester.filter(semester => semester.id !== semesterId)); // Cập nhật danh sách người dùng
      } else {
        message.error('Failed to delete semester: ' + response.data.message);
      }
    } catch (error) {
      console.error('Delete semester error:', error);
      message.error('Failed to delete semester: ' + error.message);
    }
  };

  const handleCancelCreate = () => {
    form.resetFields();
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Semester',
      dataIndex: 'semesterName',
      key: 'semesterName'
    },
    {
      title: 'Date Start',
      dataIndex: 'dateStart',
      key: 'dateStart'
    },
    {
      title: 'Date End',
      dataIndex: 'dateEnd',
      key: 'dateEnd'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (text, record) => (
        <div className="flex flex-col gap-2">
          {record.availableStatus === 'INACTIVE' ? (
            <Button className="bg-gray-500 text-white  w-full hover:cursor-not-allowed" style={{ marginRight: '10px' }}>
              Inactive
            </Button>
          ) : (
            <Button
              className="bg-blue-500 text-white  w-full"
              onClick={() => showUpdateModal(record)}
              style={{ marginRight: '10px' }}
            >
              Update
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-full bg-gray-100">
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Semester List</h1>
      <Button type="primary" onClick={showCreateModal} style={{ marginBottom: '10px' }}>
        Create Semester
      </Button>
      <Table
        columns={columns}
        dataSource={semesters}
        bordered
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ y: 430 }}
        loading={loading}
      />
      {/* Modal for creating semester */}

      <Modal
        title="Create semester"
        open={isCreateModalVisible}
        onOk={handleCreateSemester}
        onCancel={handleCancelCreate}
      >
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Semester Name"
              name="semesterName"
              rules={[
                {
                  required: true,
                  message: 'Please input your semester name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date start"
              name="dateStart"
              rules={[
                {
                  required: true,
                  message: 'Please input your semester start date!'
                }
                // {
                //   validator: (_, value) =>
                //     value && value.isAfter(dayjs(), 'day')
                //       ? Promise.resolve()
                //       : Promise.reject(new Error('The start date cannot be in the past.'))
                // }
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label="Date end"
              name="dateEnd"
              dependencies={['dateStart']}
              rules={[
                {
                  required: true,
                  message: 'Please input your semester end date!'
                },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const dateStart = getFieldValue('dateStart');
                    if (!value || !dateStart) {
                      return Promise.resolve();
                    }

                    const minEndDate = dayjs(dateStart).add(3, 'months');
                    if (value.isBefore(minEndDate)) {
                      return Promise.reject(new Error('End date must be at least 3 months after the start date.'));
                    }

                    // if (value.isBefore(dayjs(), 'day')) {
                    //   return Promise.reject(new Error('End date cannot be in the past.'));
                    // }

                    return Promise.resolve();
                  }
                })
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {/* Modal update */}
      <Modal
        title="Update semester"
        open={isUpdateModalVisible}
        onOk={handleUpdateSemester}
        onCancel={handleCancelCreate}
      >
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Semester Name"
              name="semesterName"
              rules={[
                {
                  required: true,
                  message: 'Please input your semester name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date start"
              name="dateStart"
              rules={[
                {
                  required: true,
                  message: 'Please input your date semester start!'
                }
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label="Date end"
              name="dateEnd"
              dependencies={['dateStart']}
              rules={[
                {
                  required: true,
                  message: 'Please input your semester end date!'
                },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const dateStart = getFieldValue('dateStart');
                    if (!value || !dateStart) {
                      return Promise.resolve();
                    }

                    const minEndDate = dayjs(dateStart).add(3, 'months');
                    if (value.isBefore(minEndDate)) {
                      return Promise.reject(new Error('End date must be at least 3 months after the start date.'));
                    }

                    return Promise.resolve();
                  }
                })
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default SemesterManager;
