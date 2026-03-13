import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export const metadata = {
  title: "Security Settings | Admin",
  description: "Update your administrative credentials",
};

export default function PasswordSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <ChangePasswordForm />
    </div>
  );
}
