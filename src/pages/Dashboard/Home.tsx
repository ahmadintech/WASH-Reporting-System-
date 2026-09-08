import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import CoordinatorDashboard from "./CoordinatorDashboard";
import PartnerDashboard from "./PartnerDashboard";

export default function Home() {
  const { currentUser } = useAuth();
  const role = currentUser?.role || "coordinator";

  const getPageMeta = () => {
    switch (role) {
      case "admin":
        return {
          title: "Sector Administrator Console | WASH Sector North East Nigeria",
          desc: "Full sector governance, 5W quality assurance, partner compliance, and master data controls.",
        };
      case "coordinator":
        return {
          title: "Cluster Coordination Desk | WASH Sector North East Nigeria",
          desc: "Humanitarian gap analysis, LGA vulnerability matrix, cholera alerts, and inter-agency coordination.",
        };
      case "partner":
        return {
          title: `${currentUser?.organization || "Partner"} Portal | WASH 5W Reporting`,
          desc: "Implementing partner field activity reporting, project tracking, and beneficiary demographics.",
        };
      default:
        return {
          title: "WASH 5W Activity Reporting Platform | North East Nigeria",
          desc: "Humanitarian response monitoring for Borno, Adamawa, and Yobe states.",
        };
    }
  };

  const meta = getPageMeta();

  return (
    <>
      <PageMeta title={meta.title} description={meta.desc} />

      {role === "admin" ? (
        <AdminDashboard />
      ) : role === "partner" ? (
        <PartnerDashboard />
      ) : (
        <CoordinatorDashboard />
      )}
    </>
  );
}
