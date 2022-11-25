//@ts-check
import React, { useState, useEffect } from "react";
import { getAllStudents, removeStudent, updateStudent } from "./client";
import {
  Layout,
  Menu,
  Breadcrumb,
  Table,
  Spin,
  Empty,
  Button,
  Badge,
  Tag,
  Avatar,
  Popconfirm,
  Radio,
  Image,
  Divider,
} from "antd";

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import StudentDrawerForm from "./StudentDrawerForm";
import "./App.css";
import { errorNotification, successNotification } from "./notification";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const TheAvatar = ({ name }) => {
  let trim = name.trim();
  if (trim.length === 0) {
    return <Avatar icon={<UserOutlined />} />;
  }
  const split = trim.split(" ");
  if (split.length === 1) {
    return <Avatar>{name.charAt(0)}</Avatar>;
  }
  return <Avatar>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>;
};

let onConfirmDelete = (studentId, callback) => {
  removeStudent(studentId)
    .then(() => {
      successNotification(
        "Student deleted",
        `Student with ${studentId} was deleted`
      );
      callback(); // update student list
    })
    .catch((err) => {
      err.response
        .json()
        .then(() => errorNotification("Not found", err.message));
    });
};

const columns = (fetchStudents, callback) => [
  {
    title: "",
    dataIndex: "avatar",
    key: "avatar",
    render: (text, student) => <TheAvatar name={student.name} />,
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Options",
    key: "options",
    render: (text, student) => (
      <Radio.Group>
        <Popconfirm
          paddingBottom="topRight"
          title={`Are you sure to delete ${student.name} ?`}
          onConfirm={() => onConfirmDelete(student.id, fetchStudents)}
          okText="Yes"
          cancelText="No"
        >
          <Radio.Button value="small">Delete</Radio.Button>
        </Popconfirm>
        <Radio.Button value="default" onClick={() => callback(student)}>
          Edit
        </Radio.Button>
      </Radio.Group>
    ),
  },
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [obj, setObj] = useState(null);
  const [id, setId] = useState(0);

  const fetchStudents = () =>
    getAllStudents()
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStudents(data);
      })
      .catch((err) => {
        console.log(err.response);
        err.response.json().then((res) => {
          console.log(res);
          errorNotification(
            "There was an issue",
            `${res.message} [${res.status}] with ${res.error}`
          );
        });
      })
      .finally(() => setFetching(false));

  useEffect(() => {
    console.log("component is mounted");
    fetchStudents();
  }, []);

  const openStudentUpdate = (student) => { // from callback
    setObj(student);
    setId(student.id);
    setShowDrawer(!showDrawer);
  };

  const renderStudents = () => {
    if (fetching) {
      return <Spin indicator={antIcon} />;
    }
    if (students.length <= 0) {
      return (
        <>
          <Button
            onClick={() => setShowDrawer(!showDrawer)}
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            size="small"
          >
            Add New Student
          </Button>
          <StudentDrawerForm
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
            fetchStudents={fetchStudents}
            setObj={setObj}
            object={(obj) ? obj : null}
            idStudent={id}
          />
          <Empty />
        </>
      );
    }
    return (
      <>
        <StudentDrawerForm
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          fetchStudents={fetchStudents}
          setObj={setObj}
          object={(obj) ? obj : null}
          idStudent={id}
          />
        <Table
          dataSource={students}
          columns={columns(fetchStudents, openStudentUpdate)} // 2º parameter as a callback function
          bordered
          title={() => (
            <>
              <Tag>Number of students</Tag>
              <Badge count={students.length} className="site-badge-count-4" />
              <br />
              <br />
              <Button
                onClick={() => setShowDrawer(!showDrawer)}
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                size="small"
              >
                Add New Student
              </Button>
            </>
          )}
          pagination={{ pageSize: 12 }} // amount of rows
          scroll={{ y: 500 }} // height 
          rowKey={(student) => student.id}
        />
      </>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {renderStudents()}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <Divider>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://amigoscode.com/p/full-stack-spring-boot-react"
            >
              Click here to access Fullstack Spring Boot & React for
              professionals
            </a>
          </Divider>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
