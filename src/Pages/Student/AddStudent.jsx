import { Fragment } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import FormAddStudent from "../../components/Fragments/FormAddStudent.jsx";
const AddStudent = () => {
  return (
    <Fragment>
      <AdminLayout>
        <FormAddStudent />
      </AdminLayout>
    </Fragment>
  );
};

export default AddStudent;
