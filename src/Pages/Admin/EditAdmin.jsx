import { Fragment } from "react";
import FormEditAdmin from "../../components/Fragments/FormEditAdmin";
import AdminLayout from "../../components/Layouts/AdminLayout";

const EditAdmin = () => {
  return (
    <Fragment>
      <AdminLayout>
        <FormEditAdmin />
      </AdminLayout>
    </Fragment>
  );
};

export default EditAdmin;
