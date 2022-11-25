//@ts-check
// StudentDrawerForm.js
import { Drawer, Input, Col, Select, Form, Row, Button, Spin } from "antd";
import { addNewStudent, updateStudent } from "./client";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { successNotification, errorNotification } from "./notification";

const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function StudentDrawerForm({
  showDrawer,
  setShowDrawer,
  fetchStudents,
  setObj,
  object,
  idStudent,
}) {
  const onCLose = () => (setShowDrawer(false), setObj(null));
  const [submitting, setSubmitting] = useState(false);

  const onFinish = (student) => {
    setSubmitting(true);
    console.log(JSON.stringify(student, null, 2));
    if (!object) {
      addNewStudent(student)
        .then(() => {
          console.log("student added");
          onCLose();
          successNotification(
            "Student successfully added",
            `${student.name} was added to the system`
          );
          fetchStudents();
        })
        .catch((err) => {
          console.log(err.response);
          err.response.json().then((res) => {
            errorNotification("Email error", res.message, "bottomLeft");
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      updateStudent(student, idStudent)
        .then(() => {
          console.log("student edited");
          onCLose();
          successNotification(
            "Student successfully edited",
            `${student.name} was edited on the system`
          );
          fetchStudents();
        })
        .catch((err) => {
          console.log(err.response);
          err.response.json().then((res) => {
            errorNotification(
              "Error while updating :",
              res.message,
              "bottomLeft"
            );
          });
        })
        .finally(() => {
          setSubmitting(false);
          setObj(null); // clearing the object passed
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    alert(JSON.stringify(errorInfo, null, 2));
  };

  // NO MATTER
  // useEffect(() => {
  //   console.log(student);
  //   fetchStudents();
  // }, []);

  return (
    <Drawer
      title={object ? `Editing student ${object.name}` : "Create new student"}
      width={720}
      onClose={onCLose}
      visible={showDrawer}
      destroyOnClose={true} // this property matters a lot
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button onClick={onCLose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        onFinishFailed={onFinishFailed}
        onFinish={onFinish}
        hideRequiredMark
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              initialValue={(object) ? object.name : ""}
              rules={[{ required: true, message: "Please enter student name" }]}
            >
              <Input placeholder="Please enter student name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              initialValue={(object) ? object.email : ""}
              rules={[
                { required: true, message: "Please enter student email" },
              ]}
            >
              <Input placeholder="Please enter student email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="gender"
              initialValue={(object) ? object.gender : ""}
              rules={[{ required: true, message: "Please select a gender" }]}
            >
              <Select placeholder="Please select a gender">
                <Option value="MALE">MALE</Option>
                <Option value="FEMALE">FEMALE</Option>
                <Option value="OTHERS">OTHER</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row>{submitting && <Spin indicator={antIcon} />}</Row>
      </Form>
    </Drawer>
  );
}

export default StudentDrawerForm;
