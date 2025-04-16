import { Fragment } from "react";
import FormEditTeacher from "../../components/Fragments/FormEditTeacher";
import AdminLayout from "../../components/Layouts/AdminLayout";

const EditTeacher = () => {
  return (
    <Fragment>
      <AdminLayout>
        <FormEditTeacher />
      </AdminLayout>
    </Fragment>
  );
};

export default EditTeacher;
