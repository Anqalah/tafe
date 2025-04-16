import { Fragment } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import { FormAddTeacher } from "../../components/Fragments/FormAddTeacher";

const AddTeacher = () => {
  return (
    <Fragment>
      <AdminLayout>
        <FormAddTeacher />
      </AdminLayout>
    </Fragment>
  );
};

export default AddTeacher;
