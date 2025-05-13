import { Fragment } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import FormEditDataAdmin from "../../components/Fragments/FormEditDataAdmin";

const EditDataAdmin = () => {
  return (
    <Fragment>
      <AdminLayout>
        <FormEditDataAdmin />
      </AdminLayout>
    </Fragment>
  );
};

export default EditDataAdmin;
