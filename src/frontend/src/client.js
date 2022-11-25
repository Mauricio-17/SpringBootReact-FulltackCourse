import fetch from "unfetch"; 

const URL = "api/v1/student";

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  // convert non-2xx HTTP responses into errors:
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
};

export const getAllStudents = () => fetch(URL).then(checkStatus);

export const addNewStudent = (student) =>
  fetch(URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(student),
  }).then(checkStatus);

export const updateStudent = (student, id) =>
  fetch(`${URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(student),
  }).then(checkStatus);

export const removeStudent = (studentId) =>
  fetch(`${URL}/${studentId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  }).then(checkStatus);
