import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | WASH Sector North East Nigeria 5W Reporting Platform"
        description="WASH Sector North East Nigeria 5W Activity Reporting Platform login for Borno, Adamawa and Yobe partners"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
