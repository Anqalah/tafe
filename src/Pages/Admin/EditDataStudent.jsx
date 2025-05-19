import { Fragment } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import FormEditDataStudent from "../../components/Fragments/FormEditDataStudent";

const EditDataStudent = () => {
  return (
    <Fragment>
      <AdminLayout>
        <FormEditDataStudent />
      </AdminLayout>
    </Fragment>
  );
};

export default EditDataStudent;
