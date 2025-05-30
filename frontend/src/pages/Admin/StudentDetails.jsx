import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Select, Spin, message, Typography, Card, Space } from 'antd';
const { Title, Text } = Typography;
const { Option } = Select;

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/student/all');
        console.log("res", response.data.students);
        setStudents(response.data.students);
        
        // Extract unique years from student data
        const years = [...new Set(response.data.students.map(student => student.year))].sort();
        setAvailableYears(years);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load student data');
        message.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  // Filter students based on selected year
  const filteredStudents = selectedYear === 'all' 
    ? students 
    : students.filter(student => student.year === selectedYear);

  // Columns for students table
  const studentColumns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <a href={`/students/${record._id}`}>{text}</a>  // Fixed: Added backticks
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      sorter: (a, b) => a.rollNumber.localeCompare(b.rollNumber),
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      filters: availableYears.map(year => ({ text: year, value: year })),
      onFilter: (value, record) => record.year === value,
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      render: semester => semester ? semester.replace('sem', 'Semester ') : 'N/A',
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'WAT Submissions',
      key: 'watCount',
      render: (_, record) => record.watMarks ? record.watMarks.length : 0,
      sorter: (a, b) => (a.watMarks?.length || 0) - (b.watMarks?.length || 0),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title="All Students" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Title level={4} style={{ margin: 0 }}>Student Records</Title>
            <Select
              defaultValue="all"
              style={{ width: 200 }}
              onChange={setSelectedYear}
            >
              <Option value="all">All Years</Option>
              {availableYears.map(year => (
                <Option key={year} value={year}>Year {year}</Option>
              ))}
            </Select>
          </div>

          <Table
            columns={studentColumns}
            dataSource={filteredStudents}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
            bordered
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5}>
                    <Text strong>Total Students:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{filteredStudents.length}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Space>
      </Card>
    </div>
  );
};

export default StudentDetails;