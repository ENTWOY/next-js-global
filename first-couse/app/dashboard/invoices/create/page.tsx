import FormWrapper from "@/app/components/FormWrapper";
import { fetchCustomers } from "@/app/helpers/api";
import { b_neue } from "@/app/ui/fonts";
import { Breadcrumbs } from "anjrot-components";

const breadCrumbs = [
  { label: "Invoices", href: "/dashboard/invoices" },
  {
    label: "Create Invoice",
    href: "/dashboard/invoices/create",
    active: true
  }
];

const CreateInvoice = async () => {
  const getCustomers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs breadcrumb={breadCrumbs} className={b_neue.className} />
      <FormWrapper customers={getCustomers} />
    </main>
  );
};

export default CreateInvoice;
